import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { setupLemonSqueezy } from '@/utils/billing';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { rateLimit } from '@/utils/rate-limit';
import { getClientIp } from '@/utils/request';
import { logApiError } from '@/utils/api-error';

const ALLOWED_PLANS = new Set(['monthly', 'quarterly', 'yearly']);

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const { allowed } = rateLimit(`checkout:${ip}`, 5, 60000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': '60' } })
    }

    const body = await request.json().catch(() => ({}));
    const requestedPlan = typeof body?.plan === 'string' ? body.plan : '';
    if (!ALLOWED_PLANS.has(requestedPlan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userLimit = rateLimit(`checkout:user:${user.id}`, 3, 60000);
    if (!userLimit.allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': '60' } });
    }

    const email = user.email;
    const userId = user.id;

    setupLemonSqueezy();

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

    const variantByPlan: Record<string, string | undefined> = {
      monthly: process.env.LEMONSQUEEZY_VARIANT_ID_MONTHLY || process.env.LEMONSQUEEZY_VARIANT_ID,
      quarterly: process.env.LEMONSQUEEZY_VARIANT_ID_QUARTERLY,
      yearly: process.env.LEMONSQUEEZY_VARIANT_ID_YEARLY,
    };

    const variantId = variantByPlan[requestedPlan] || variantByPlan.monthly;

    if (!variantId) {
      return NextResponse.json({ error: 'Missing variant configuration for selected plan' }, { status: 500 });
    }

    // Create a Lemon Squeezy checkout
    const checkoutResult = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: email,
        custom: {
          user_id: userId,
          plan: requestedPlan,
        }
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/settings?upgrade=success`,
        receiptButtonText: 'Return to Dashboard',
        receiptThankYouNote: 'Thank you for investing in your recovery.'
      }
    });

    if (checkoutResult.error) {
      logApiError('/api/checkout', checkoutResult.error, { stage: 'createCheckout', userId, requestedPlan });
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    const checkoutUrl = checkoutResult.data?.data.attributes.url;

    if (!checkoutUrl) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    logApiError('/api/checkout', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
