import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.0',
});

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.client_reference_id;

    if (userId) {
      const supabase = await createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('id', userId);

      if (error) {
        console.error('Error updating plan to pro:', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
