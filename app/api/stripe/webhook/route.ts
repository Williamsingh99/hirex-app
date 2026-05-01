import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  // Verify webhook signature
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.payment_status === 'paid') {
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription as string;

        if (userId) {
          // Create/Update subscription
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_subscription_id: subscriptionId,
              status: 'active',
              plan: session.metadata?.plan || 'pro',
              current_period_end: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error creating subscription:', error);
            return NextResponse.json(
              { error: 'Failed to create subscription' },
              { status: 500 }
            );
          }

          // Update profile plan
          await supabase
            .from('profiles')
            .update({ 
              plan: session.metadata?.plan || 'pro',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            plan: subscription.metadata?.plan || 'pro',
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating subscription:', error);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        // Downgrade to free plan
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        await supabase
          .from('profiles')
          .update({ 
            plan: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const userId = invoice.customer as string;

      if (userId) {
        // Renew subscription period
        const { error } = await supabase
          .from('subscriptions')
          .update({
            current_period_end: new Date(
              invoice.period_end * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', userId);

        if (error) {
          console.error('Error renewing subscription:', error);
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const userId = invoice.customer as string;

      if (userId) {
        // Mark subscription as past_due
        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', userId);

        console.log('Payment failed for user:', userId);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
