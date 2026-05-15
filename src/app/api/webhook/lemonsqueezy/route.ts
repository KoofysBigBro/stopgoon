import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('X-Signature') || '';
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('LEMONSQUEEZY_WEBHOOK_SECRET not set — skipping signature verification in dev');
      } else {
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
      }
    }

    if (secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signatureBuffer = Buffer.from(signature, 'utf8');

      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const data = JSON.parse(rawBody);
    const eventName = data.meta.event_name;
    const obj = data.data.attributes;
    const userId = data.meta.custom_data?.user_id;

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    const supabase = await createClient();

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const status = obj.status;

      await supabase
        .from('users')
        .update({
          subscription_tier: status === 'active' ? 'premium' : 'free',
          lemon_squeezy_customer_id: obj.customer_id,
          lemon_squeezy_subscription_id: data.data.id,
        })
        .eq('id', userId);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Updated user ${userId} premium status to ${status === 'active'}`);
      }
    }
    else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      await supabase
        .from('users')
        .update({
          subscription_tier: 'free',
          lemon_squeezy_subscription_id: null,
        })
        .eq('id', userId);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Revoked premium for user ${userId} due to ${eventName}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Webhook processing error:', error);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
