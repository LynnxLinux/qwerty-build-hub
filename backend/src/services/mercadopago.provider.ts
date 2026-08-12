import * as crypto from 'crypto';
import { PaymentProvider, PixPaymentResult } from './payment.provider';
import { logger } from '../config/logger';

const MP_API_BASE = 'https://api.mercadopago.com';

export interface MercadoPagoOrderResponse {
  id: string;
  status: string;
  status_detail: string;
  external_reference: string;
  total_amount: string;
  transactions: {
    payments: Array<{
      id: string;
      status: string;
      status_detail: string;
      amount: string;
      payment_method: {
        id: string;
        type: string;
        ticket_url?: string;
        qr_code?: string;
        qr_code_base64?: string;
      };
    }>;
  };
}

/**
 * Mercado Pago Provider — integrates with the Orders API for PIX payments.
 * Uses the newest Checkout Transparente (Orders API) endpoint.
 *
 * Requires: MERCADOPAGO_ACCESS_TOKEN env var (test token starts with APP_USR).
 */
export class MercadoPagoProvider implements PaymentProvider {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Create a PIX payment via Mercado Pago Orders API.
   */
  async createPixPayment(amount: number, orderId: string, description: string, payerEmail?: string): Promise<PixPaymentResult> {
    const idempotencyKey = crypto.randomUUID();

    const body = {
      type: 'online',
      total_amount: amount.toFixed(2),
      external_reference: orderId,
      processing_mode: 'automatic',
      description: description.substring(0, 240),
      transactions: {
        payments: [
          {
            amount: amount.toFixed(2),
            payment_method: {
              id: 'pix',
              type: 'bank_transfer',
            },
            expiration_time: 'PT30M', // 30 minutes
          },
        ],
      },
      payer: {
        email: payerEmail || 'test_user_br@testuser.com',
      },
    };

    const response = await fetch(`${MP_API_BASE}/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(`[MercadoPago] Erro ao criar pagamento: ${response.status}`, { body: errorBody });
      throw new Error(`Mercado Pago API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json() as MercadoPagoOrderResponse;
    const payment = data.transactions.payments[0];

    if (!payment) {
      throw new Error('Mercado Pago: nenhum pagamento retornado na resposta');
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30min from now

    return {
      gatewayId: data.id, // MP Order ID
      qrCode: payment.payment_method.qr_code || '',
      qrCodeBase64: payment.payment_method.qr_code_base64 || '',
      expiresAt,
    };
  }

  /**
   * Verify payment status by consulting the MP Orders API.
   */
  async verifyPayment(gatewayId: string): Promise<{ status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' }> {
    const response = await fetch(`${MP_API_BASE}/v1/orders/${gatewayId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      logger.error(`[MercadoPago] Erro ao consultar pagamento: ${response.status}`);
      return { status: 'PENDING' }; // Graceful degradation
    }

    const data = await response.json() as MercadoPagoOrderResponse;
    return { status: this.mapStatus(data.status) };
  }

  /**
   * Validate webhook notification from Mercado Pago.
   * MP sends x-signature header with format: ts=TIMESTAMP,v1=HASH
   * The hash is HMAC-SHA256 of "id:{data.id};request-id:{x-request-id};ts:{ts};{template}"
   * signed with the webhook secret.
   *
   * For sandbox/development when no secret is configured, we skip validation
   * but still require server-side verification of the payment.
   */
  static validateWebhookSignature(
    xSignature: string | undefined,
    xRequestId: string | undefined,
    dataId: string,
    webhookSecret: string | undefined,
  ): boolean {
    if (!webhookSecret) {
      // In development without secret, skip signature validation
      // but ALWAYS verify payment server-side
      return true;
    }

    if (!xSignature) return false;

    // Parse x-signature header: "ts=TIMESTAMP,v1=HASH"
    const parts: Record<string, string> = {};
    xSignature.split(',').forEach((part) => {
      const [key, value] = part.split('=');
      if (key && value) parts[key.trim()] = value.trim();
    });

    const ts = parts['ts'];
    const v1 = parts['v1'];
    if (!ts || !v1) return false;

    // Build manifest string
    const manifest = `id:${dataId};request-id:${xRequestId || ''};ts:${ts};`;

    // Compute expected signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(manifest)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(v1),
      Buffer.from(expectedSignature),
    );
  }

  private mapStatus(mpStatus: string): 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' {
    switch (mpStatus) {
      case 'paid':
      case 'approved':
        return 'PAID';
      case 'action_required':
      case 'pending':
        return 'PENDING';
      case 'expired':
        return 'EXPIRED';
      case 'rejected':
      case 'cancelled':
      case 'refunded':
      default:
        return 'FAILED';
    }
  }
}
