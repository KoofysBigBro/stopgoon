import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';
import { logApiError } from '@/utils/api-error';

type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
    custom_data?: {
      user_id?: string;
      plan?: string;
    };
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      customer_id?: string;
      updated_at?: string;
      created_at?: string;
    };
  };
};

function getEventKey(payload: LemonWebhookPayload): string {
  const eventName = payload.meta?.event_name || 'unknown_event';
  const resourceId = payload.data?.id || 'unknown_resource';
  const updatedAt = payload.data?.attributes?.updated_at || payload.data?.attributes?.created_at || 'no_timestamp';
  return `${eventName}:${resourceId}:${updatedAt}`;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('X-Signature') || '';
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (!signature || digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(rawBody) as LemonWebhookPayload;
    const eventName = data?.meta?.event_name;
    const obj = data.data?.attributes;
    const userId = data.meta?.custom_data?.user_id;

    if (typeof eventName !== 'string') {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    if (!obj) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const eventKey = getEventKey(data);
    const resourceId = data.data?.id || null;

    const { data: inserted, error: insertError } = await supabase
      .from('lemonsqueezy_webhook_events')
      .insert({
        event_key: eventKey,
        event_name: eventName,
        resource_id: resourceId,
        user_id: userId || null,
        payload: data,
      })
      .select('event_key')
      .maybeSingle();

    if (insertError) {
      logApiError('/api/webhook/lemonsqueezy', insertError, { stage: 'insert_webhook_event', eventName, eventKey, resourceId });
      return NextResponse.json({ error: 'Failed to persist webhook event' }, { status: 500 });
    }

    if (!inserted) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const status = obj.status;
      const selectedPlan = data.meta?.custom_data?.plan;

      const { error } = await supabase
        .from('users')
        .update({
          subscription_tier: status === 'active' ? 'premium' : 'free',
          lemon_squeezy_customer_id: obj.customer_id,
          lemon_squeezy_subscription_id: data.data?.id,
        })
        .eq('id', userId);

      if (error) {
        logApiError('/api/webhook/lemonsqueezy', error, { stage: 'update_subscription_active', userId, eventName, eventKey });
        return NextResponse.json({ error: 'Failed to update user subscription' }, { status: 500 });
      }

      if (status === 'active') {
        const { error: funnelError } = await supabase.from('upgrade_funnel_events').insert({
          user_id: userId,
          event_name: 'upgrade_checkout_completed',
          metadata: {
            plan: typeof selectedPlan === 'string' ? selectedPlan : 'unknown',
            source: 'lemonsqueezy_webhook',
            lemon_event: eventName,
          },
        });

        if (funnelError) {
          logApiError('/api/webhook/lemonsqueezy', funnelError, {
            stage: 'insert_checkout_completed_event',
            userId,
            eventName,
            eventKey,
          });
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`Updated user ${userId} premium status to ${status === 'active'}`);
      }
    }
    else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      const { error } = await supabase
        .from('users')
        .update({
          subscription_tier: 'free',
          lemon_squeezy_subscription_id: null,
        })
        .eq('id', userId);

      if (error) {
        logApiError('/api/webhook/lemonsqueezy', error, { stage: 'update_subscription_cancelled', userId, eventName, eventKey });
        return NextResponse.json({ error: 'Failed to update user subscription' }, { status: 500 });
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`Revoked premium for user ${userId} due to ${eventName}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logApiError('/api/webhook/lemonsqueezy', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
