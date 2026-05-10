import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // 1. Verify the Webhook Signature
    const rawBody = await req.text();
    const signature = req.headers.get('X-Signature') || '';
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 2. Parse the verified payload
    const data = JSON.parse(rawBody);
    const eventName = data.meta.event_name;
    const obj = data.data.attributes;
    
    // The user_id we passed during checkout creation
    const userId = data.meta.custom_data?.user_id;

    // We only care if we have a user to attach this to
    if (!userId) {
      console.warn('Webhook received but no user_id found in custom_data');
      return NextResponse.json({ received: true });
    }

    const supabase = await createClient();

    // 3. Handle specific subscription events
    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const status = obj.status; // 'active', 'past_due', 'unpaid', 'cancelled', 'expired'
      
      // Update user's profile with premium status
      await supabase
        .from('users')
        .update({
          subscription_tier: status === 'active' ? 'premium' : 'free',
          lemon_squeezy_customer_id: obj.customer_id,
          lemon_squeezy_subscription_id: data.data.id,
        })
        .eq('id', userId);

      console.log(`Updated user ${userId} premium status to ${status === 'active'}`);
    } 
    else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      // Revoke premium access
      await supabase
        .from('users')
        .update({
          subscription_tier: 'free',
          lemon_squeezy_subscription_id: null,
        })
        .eq('id', userId);

      console.log(`Revoked premium for user ${userId} due to ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
