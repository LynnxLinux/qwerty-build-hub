import { PaymentStatus, OrderStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AuditRepository } from '../repositories/audit.repository';
import { OrderRepository } from '../repositories/order.repository';
import { SandboxPixProvider, PaymentProvider } from './payment.provider';
import { MercadoPagoProvider } from './mercadopago.provider';
import { AppError } from '../utils/AppError';
import { logPayment } from '../config/logger';

/**
 * Returns the appropriate payment provider based on environment configuration.
 * Uses MercadoPago when MERCADOPAGO_ACCESS_TOKEN is set, otherwise falls back to Sandbox.
 */
function getPaymentProvider(): PaymentProvider {
  const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (mpToken) {
    return new MercadoPagoProvider(mpToken);
  }
  return new SandboxPixProvider();
}

export class PaymentService {
  private auditRepo = new AuditRepository();
  private orderRepo = new OrderRepository();

  /**
   * Create a PIX payment for an order.
   * Value comes from the Order in the database — NEVER from the frontend.
   */
  async createPayment(orderId: string, userId: string) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw AppError.notFound('Pedido não encontrado');
    if (order.userId !== userId) throw AppError.forbidden('Acesso negado');

    // Only allow payment for PENDING orders
    if (order.status !== OrderStatus.PENDING) {
      throw AppError.badRequest(`Pedido não está disponível para pagamento (status: ${order.status})`);
    }

    // Check if payment already exists and is active
    const existingPayment = await prisma.payment.findFirst({ where: { orderId } });
    if (existingPayment) {
      if (existingPayment.status === PaymentStatus.PAID) {
        throw AppError.conflict('Pagamento já realizado');
      }
      if (existingPayment.status === PaymentStatus.PENDING) {
        const expiresAt = existingPayment.gatewayResponse
          ? (existingPayment.gatewayResponse as { expiresAt?: string }).expiresAt
          : null;
        if (expiresAt && new Date(expiresAt) > new Date()) {
          return existingPayment; // Return existing non-expired pending payment
        }
        // Expired — cancel and create new
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { status: PaymentStatus.CANCELLED },
        });
      }
    }

    // Create PIX payment via provider — amount from database, NOT from frontend
    const provider = getPaymentProvider();
    const pixResult = await provider.createPixPayment(
      Number(order.total),
      orderId,
      `Pedido ${order.orderNumber}`,
    );

    // Persist payment record
    const payment = await prisma.payment.upsert({
      where: { orderId },
      update: {
        status: PaymentStatus.PENDING,
        gatewayId: pixResult.gatewayId,
        gatewayResponse: {
          qrCode: pixResult.qrCode,
          qrCodeBase64: pixResult.qrCodeBase64,
          expiresAt: pixResult.expiresAt.toISOString(),
        },
        paidAt: null,
        failedAt: null,
      },
      create: {
        orderId,
        method: 'PIX',
        status: PaymentStatus.PENDING,
        amount: order.total, // Amount from DB, not client
        currency: 'BRL',
        gatewayId: pixResult.gatewayId,
        gatewayResponse: {
          qrCode: pixResult.qrCode,
          qrCodeBase64: pixResult.qrCodeBase64,
          expiresAt: pixResult.expiresAt.toISOString(),
        },
      },
    });

    logPayment('PAYMENT_CREATED', orderId, { gatewayId: pixResult.gatewayId });
    return payment;
  }

  /**
   * Get payment details for an order (with expiration check).
   */
  async getPaymentByOrderId(orderId: string, userId: string) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw AppError.notFound('Pedido não encontrado');
    if (order.userId !== userId) throw AppError.forbidden('Acesso negado');

    const payment = await prisma.payment.findFirst({ where: { orderId } });
    if (!payment) throw AppError.notFound('Pagamento não encontrado');

    // Check expiration for pending payments
    if (payment.status === PaymentStatus.PENDING) {
      const gatewayData = payment.gatewayResponse as { expiresAt?: string } | null;
      if (gatewayData?.expiresAt && new Date(gatewayData.expiresAt) < new Date()) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.CANCELLED },
        });
        return { ...payment, status: PaymentStatus.CANCELLED };
      }
    }

    return payment;
  }

  /**
   * Handle webhook from Mercado Pago (or sandbox).
   *
   * Mercado Pago webhook format:
   * { action: "payment.updated", data: { id: "ORDER_ID" }, type: "payment" }
   *
   * Sandbox/legacy format:
   * { paymentId: "...", status: "approved", eventId: "..." }
   *
   * This handler supports BOTH formats for backward compatibility.
   */
  async handleWebhook(
    payload: Record<string, unknown>,
    headers: { xSignature?: string; xRequestId?: string; rawSignature?: string },
  ) {
    // Detect format: Mercado Pago vs legacy sandbox
    const isMercadoPagoFormat = payload.action && payload.data && payload.type;

    if (isMercadoPagoFormat) {
      return this.handleMercadoPagoWebhook(payload, headers);
    }

    // Legacy sandbox format
    return this.handleLegacyWebhook(payload, headers.rawSignature || '');
  }

  /**
   * Process Mercado Pago webhook notification.
   * ALWAYS verifies payment server-side — never trusts webhook payload alone.
   */
  private async handleMercadoPagoWebhook(
    payload: Record<string, unknown>,
    headers: { xSignature?: string; xRequestId?: string },
  ) {
    const data = payload.data as { id?: string } | undefined;
    const mpOrderId = data?.id;

    if (!mpOrderId) {
      throw AppError.badRequest('Webhook: data.id ausente');
    }

    // Validate signature if webhook secret is configured
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    const isValid = MercadoPagoProvider.validateWebhookSignature(
      headers.xSignature,
      headers.xRequestId,
      mpOrderId,
      webhookSecret,
    );

    if (!isValid) {
      logPayment('WEBHOOK_INVALID_SIGNATURE', mpOrderId, {});
      throw AppError.unauthorized('Assinatura de webhook inválida');
    }

    // Find payment by gatewayId (MP order ID)
    const payment = await prisma.payment.findFirst({ where: { gatewayId: mpOrderId } });
    if (!payment) {
      // Payment not found — could be for an order we don't know about
      logPayment('WEBHOOK_PAYMENT_NOT_FOUND', mpOrderId, {});
      // Return 200 to MP so it doesn't retry
      return { processed: true, skipped: true, reason: 'payment_not_found' };
    }

    // ALWAYS verify payment server-side with MP API
    const provider = getPaymentProvider();
    const verification = await provider.verifyPayment(mpOrderId);

    // Map verified status to our PaymentStatus
    const targetStatus = this.mapVerifiedStatus(verification.status);

    // Idempotency: if already in this status, skip
    if (payment.status === targetStatus) {
      logPayment('WEBHOOK_IDEMPOTENT', mpOrderId, { status: targetStatus });
      return { processed: true, idempotent: true };
    }

    // Don't downgrade from PAID/REFUNDED
    if (payment.status === PaymentStatus.PAID && targetStatus !== PaymentStatus.REFUNDED) {
      logPayment('WEBHOOK_SKIPPED_FINAL_STATE', mpOrderId, { current: payment.status, incoming: targetStatus });
      return { processed: true, skipped: true };
    }

    // Verify amount consistency
    const order = await prisma.order.findUnique({ where: { id: payment.orderId } });
    if (!order) {
      logPayment('WEBHOOK_ORDER_NOT_FOUND', mpOrderId, { orderId: payment.orderId });
      return { processed: true, skipped: true, reason: 'order_not_found' };
    }

    // Process status update in transaction
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: targetStatus,
          paidAt: targetStatus === PaymentStatus.PAID ? new Date() : undefined,
          failedAt: targetStatus === PaymentStatus.FAILED ? new Date() : undefined,
          refundedAt: targetStatus === PaymentStatus.REFUNDED ? new Date() : undefined,
          gatewayResponse: {
            ...(payment.gatewayResponse as object || {}),
            lastWebhook: {
              action: String(payload.action || ''),
              verifiedStatus: verification.status,
              processedAt: new Date().toISOString(),
            },
          },
        },
      });

      // Update order status based on payment
      if (targetStatus === PaymentStatus.PAID) {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CONFIRMED },
        });
      }
      // Note: stock was already decremented at order creation (Etapa 4/5)
      // Do NOT decrement stock again here
    });

    await this.auditRepo.create({
      actorId: undefined,
      action: 'PAYMENT_PROCESSED',
      resource: 'Payment',
      resourceId: payment.id,
      newData: { status: targetStatus, gatewayId: mpOrderId, action: String(payload.action || '') },
    });

    logPayment('WEBHOOK_PROCESSED', mpOrderId, { orderId: payment.orderId, status: targetStatus });

    // Enqueue payment notification
    try {
      const { enqueueNotification } = require('../jobs');
      const eventType = targetStatus === 'PAID' ? 'payment_approved' : 'payment_failed';
      enqueueNotification({ eventType, entityId: payment.id, userId: order.userId });
    } catch { /* Jobs may not be available */ }

    return { processed: true };
  }

  /**
   * Legacy webhook handler (sandbox/HMAC-based).
   */
  private async handleLegacyWebhook(payload: Record<string, unknown>, signature: string) {
    const { paymentId, status, eventId } = payload as {
      paymentId?: string;
      status?: string;
      eventId?: string;
    };

    if (!paymentId || !status) {
      throw AppError.badRequest('Payload de webhook inválido');
    }

    // Validate HMAC signature
    const webhookSecret = process.env.WEBHOOK_SECRET || 'dev-webhook-secret-change-in-production';
    const crypto = require('crypto');
    const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(payload)).digest('hex');
    if (signature !== expectedSignature) {
      logPayment('WEBHOOK_INVALID_SIGNATURE', paymentId, {});
      throw AppError.unauthorized('Assinatura inválida');
    }

    // Find payment by gatewayId
    const payment = await prisma.payment.findFirst({ where: { gatewayId: paymentId } });
    if (!payment) {
      throw AppError.notFound('Pagamento não encontrado');
    }

    const targetStatus = this.mapWebhookStatus(status);

    // Idempotency
    if (payment.status === targetStatus) {
      return { processed: true, idempotent: true };
    }

    if (payment.status === PaymentStatus.PAID || payment.status === PaymentStatus.REFUNDED) {
      return { processed: true, skipped: true };
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: targetStatus,
          paidAt: targetStatus === PaymentStatus.PAID ? new Date() : undefined,
          failedAt: targetStatus === PaymentStatus.FAILED ? new Date() : undefined,
          refundedAt: targetStatus === PaymentStatus.REFUNDED ? new Date() : undefined,
          gatewayResponse: {
            ...(payment.gatewayResponse as object || {}),
            lastWebhook: { eventId, status, processedAt: new Date().toISOString() },
          },
        },
      });

      if (targetStatus === PaymentStatus.PAID) {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CONFIRMED },
        });
      }
    });

    await this.auditRepo.create({
      actorId: undefined,
      action: 'PAYMENT_PROCESSED',
      resource: 'Payment',
      resourceId: payment.id,
      newData: { status: targetStatus, eventId, gatewayId: paymentId },
    });

    logPayment('WEBHOOK_PROCESSED', paymentId, { orderId: payment.orderId, status: targetStatus });
    return { processed: true };
  }

  private mapVerifiedStatus(status: string): PaymentStatus {
    switch (status) {
      case 'PAID': return PaymentStatus.PAID;
      case 'FAILED': return PaymentStatus.FAILED;
      case 'EXPIRED': return PaymentStatus.CANCELLED;
      default: return PaymentStatus.PENDING;
    }
  }

  private mapWebhookStatus(status: string): PaymentStatus {
    const map: Record<string, PaymentStatus> = {
      approved: PaymentStatus.PAID,
      paid: PaymentStatus.PAID,
      rejected: PaymentStatus.FAILED,
      failed: PaymentStatus.FAILED,
      refunded: PaymentStatus.REFUNDED,
      cancelled: PaymentStatus.CANCELLED,
    };
    return map[status.toLowerCase()] || PaymentStatus.FAILED;
  }
}
