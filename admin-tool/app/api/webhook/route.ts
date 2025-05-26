import { siteConfigService } from '@/lib/services/SiteConfigService';
import { stripe } from '@/lib/stripeClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
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
      const session = event.data.object;

      const siteConfigId = session.metadata?.siteConfigId;
      if (!siteConfigId) {
        console.error('No siteConfigId found in metadata');
        break;
      }

      if (session.payment_status === 'paid') {
        await siteConfigService.updateUserPremiumState(true, siteConfigId);
        //revalidateTag('premium-status');
        //revalidateTag('subscriptions');
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const session = event.data.object;

      const siteConfigId = session.metadata?.siteConfigId;
      if (!siteConfigId) {
        console.error('No siteConfigId found in metadata');
        break;
      }

      await siteConfigService.updateUserPremiumState(false, siteConfigId);
      //revalidateTag('premium-status');
      //revalidateTag('subscriptions');
      break;
    }

    case 'invoice.payment_failed': {
      const session = event.data.object;
      let siteConfig_id: string = '';
      if (session.metadata) {
        siteConfig_id = session.metadata.siteConfig_id;
      } else {
        console.error('Metadata is null');
      }

      // You might want to send an email notification here
      break;
    }

    case 'account.updated': {
      await siteConfigService.updateSiteConfigStripeConfigured();
      break;
    }

    // case 'customer.subscription.updated': { //TODO Handle events like paused, resumed, etc.
    //
    //   break;
    // }

    default:
      console.warn(`Unhandled event type ${event.type}`);
      break;
  }

  return NextResponse.json({ received: true });
}
