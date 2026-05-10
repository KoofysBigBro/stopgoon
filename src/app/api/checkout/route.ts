import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { setupLemonSqueezy } from '@/utils/billing';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user?.email || 'offline-dev@example.com';
    const userId = user?.id || 'offline-dev-user-id';

    setupLemonSqueezy();

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;

    // Create a Lemon Squeezy checkout
    const checkoutResult = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: email,
        custom: {
          user_id: userId // Pass the user's Supabase ID so the webhook can identify them
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
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
