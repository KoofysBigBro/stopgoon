import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

// Initialize Stripe (requires STRIPE_SECRET_KEY in env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_key', {
  apiVersion: '2026-04-22.dahlia', // using the latest API version required by the Stripe SDK
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    // Ensure user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // In a real app, you would fetch the user's stripe_customer_id from the database here.
    // For this boilerplate, we'll create a new checkout session directly.

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Reclaim Premium',
              description: 'Unlock advanced analytics, AI reflections, and all themes.',
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/settings?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating stripe session:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
