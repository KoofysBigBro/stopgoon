import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { setupLemonSqueezy } from '@/utils/billing';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { rateLimit } from '@/utils/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimit(`checkout:${ip}`, 5, 60000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': '60' } })
    }

    const body = await request.json().catch(() => ({}));
    const requestedPlan = typeof body?.plan === 'string' ? body.plan : 'monthly';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      console.error("Checkout creation error:", checkoutResult.error);
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    const checkoutUrl = checkoutResult.data?.data.attributes.url;

    if (!checkoutUrl) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
