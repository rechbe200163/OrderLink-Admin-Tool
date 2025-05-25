import { siteConfigService } from '@/lib/services/SiteConfigService';
import { stripe } from '@/lib/stripeClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  console.log('Stripe signature:', sig);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    const rawBody = await req.text(); // Get raw request body
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook Error:' + err },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('Checkout session completed');
      const session = event.data.object;

      console.log('Session metadata:', session.metadata);

      const siteConfigId = session.metadata?.siteConfigId;
      if (!siteConfigId) {
        console.error('No siteConfigId found in metadata');
        break;
      }

      if (session.payment_status === 'paid') {
        await siteConfigService.updateUserPremiumState(true, siteConfigId);
        //revalidateTag('premium-status');
        //revalidateTag('subscriptions');
        console.log(`Premium status updated for siteConfigId: ${siteConfigId}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      console.log('Subscription deleted');
      const session = event.data.object;

      console.log('Session metadata:', session.metadata);

      const siteConfigId = session.metadata?.siteConfigId;
      if (!siteConfigId) {
        console.error('No siteConfigId found in metadata');
        break;
      }

      await siteConfigService.updateUserPremiumState(false, siteConfigId);
      //revalidateTag('premium-status');
      //revalidateTag('subscriptions');
      console.log('Cache tag revalidated after subscription deletion');
      break;
    }

    case 'invoice.payment_failed': {
      const session = event.data.object;
      let siteConfig_id: string = '';
      console.log(session.metadata);
      if (session.metadata) {
        siteConfig_id = session.metadata.siteConfig_id;
      } else {
        console.error('Metadata is null');
      }

      console.log(`Payment failed for user ${siteConfig_id}`);
      // You might want to send an email notification here
      break;
    }

    case 'account.updated': {
      console.log('Account updated');
      await siteConfigService.updateSiteConfigStripeConfigured();
      break;
    }

    // case 'customer.subscription.updated': { //TODO Handle events like paused, resumed, etc.
    //
    //   break;
    // }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
