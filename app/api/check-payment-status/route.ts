import { NextRequest, NextResponse } from 'next/server';

// In-memory stores (replace with database in production)
const completedPayments = new Set<string>();
const pendingPurchases = new Map<string, { timestamp: string, paymentLinkID: string }>();

export async function POST(req: NextRequest) {
  try {
    const { email, paymentLinkID, action } = await req.json();
    
    if (action === 'register') {
      // Register a pending purchase with paymentLinkID
      pendingPurchases.set(email, {
        timestamp: new Date().toISOString(),
        paymentLinkID
      });
      return NextResponse.json({ registered: true });
    }
    
    // Check if payment is completed for this email and paymentLinkID
    const isCompleted = completedPayments.has(email);
    const pendingPurchase = pendingPurchases.get(email);
    const isPending = pendingPurchase?.paymentLinkID === paymentLinkID;
    
    console.log('Payment status check:', { 
      email, 
      paymentLinkID,
      isCompleted,
      isPending,
      completedPayments: Array.from(completedPayments),
      pendingPurchases: Object.fromEntries(Array.from(pendingPurchases.entries()).map(([k, v]) => [k, v]))
    });
    
    return NextResponse.json({ 
      success: isCompleted,
      isPending,
      shouldShowSuccess: isPending && isCompleted
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export { completedPayments, pendingPurchases }; 