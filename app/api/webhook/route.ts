import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { completedPayments, pendingPurchases } from '../check-payment-status/route';

// Webhook payload type based on documentation
interface WebhookPayload {
  paymentLinkID: string;
  paymentID: string;
  fromAddress: string;
  toAddress: string;
  hash: string;
  network: 'ETHEREUM' | 'POLYGON' | 'BASE' | 'SOLANA';
  token: 'USDC' | 'USDT' | 'PYUSD';
  amount: number;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  Payer_Email?: string;
}

function verifyWebhookSignature(secret: string, toAddress: string, amount: number, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${toAddress}${amount}`)
    .digest('hex');
  
  return signature === expectedSignature;
}

// Track emails sent to prevent duplicate sends
const emailsSent = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-webhook-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const payload: WebhookPayload = await req.json();
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    // Verify signature
    if (!verifyWebhookSignature(webhookSecret, payload.toAddress, payload.amount, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Process completed payments
    if (payload.status === 'COMPLETED' && payload.Payer_Email) {
      try {
        const email = payload.Payer_Email.toLowerCase();
        console.log('Processing payment for:', email);
        console.log('Pending purchases:', Object.fromEntries(pendingPurchases));

        const pendingPurchase = pendingPurchases.get(email);
        
        // Check if this was a pending purchase for the correct payment link
        if (pendingPurchase?.paymentLinkID === payload.paymentLinkID && !emailsSent.has(email)) {
          console.log('Found matching pending purchase for:', email);
          completedPayments.add(email);
          
          // Send email and mark as sent
          console.log('Sending course access email to:', email);
          // TODO: Implement actual email sending
          emailsSent.add(email);
          
          console.log('Payment completed and email sent for:', email);

          // Wait before removing from pending
          setTimeout(() => {
            pendingPurchases.delete(email);
            console.log('Removed from pending purchases:', email);
          }, 5000);
        }

        console.log('Current completed payments:', Array.from(completedPayments));
        
      } catch (error) {
        console.error('Error processing payment:', error);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 