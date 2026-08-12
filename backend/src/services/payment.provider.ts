import * as crypto from 'crypto';

/**
 * PaymentProvider interface — abstracts payment gateway integration.
 * Allows swapping between sandbox/mock and real providers (Mercado Pago, Stripe).
 */
export interface PixPaymentResult {
  gatewayId: string;
  qrCode: string;
  qrCodeBase64: string;
  expiresAt: Date;
}

export interface PaymentProvider {
  createPixPayment(amount: number, orderId: string, description: string): Promise<PixPaymentResult>;
  verifyPayment(gatewayId: string): Promise<{ status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' }>;
}

/**
 * Sandbox PIX Provider — generates deterministic PIX codes for development/testing.
 * In production, replace with MercadoPagoProvider or similar.
 */
export class SandboxPixProvider implements PaymentProvider {
  private readonly PIX_EXPIRATION_MINUTES = 30;

  async createPixPayment(amount: number, orderId: string, description: string): Promise<PixPaymentResult> {
    const gatewayId = `pix_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
    const expiresAt = new Date(Date.now() + this.PIX_EXPIRATION_MINUTES * 60 * 1000);

    // Generate a deterministic PIX code (EMV format simplified for sandbox)
    const pixPayload = [
      '00020126',
      `52040000`,
      `5303986`, // BRL
      `54${amount.toFixed(2).length.toString().padStart(2, '0')}${amount.toFixed(2)}`,
      `5802BR`,
      `59${description.substring(0, 25).length.toString().padStart(2, '0')}${description.substring(0, 25)}`,
      `62${orderId.length.toString().padStart(2, '0')}${orderId}`,
      `6304`,
    ].join('');

    // QR Code content is the PIX payload
    const qrCode = `${pixPayload}${gatewayId}`;

    // Base64 representation (in production this would be an actual QR image)
    const qrCodeBase64 = Buffer.from(qrCode).toString('base64');

    return {
      gatewayId,
      qrCode,
      qrCodeBase64,
      expiresAt,
    };
  }

  async verifyPayment(_gatewayId: string): Promise<{ status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' }> {
    // In sandbox, payment status is controlled via webhook
    return { status: 'PENDING' };
  }
}
