import { stripe } from '@/lib/stripeClient';
import { NextResponse, NextRequest } from 'next/server';
import { siteConfigService } from '@/lib/services/SiteConfigService';
import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    let customer;
    const siteConfig = await siteConfigApiService.getSiteConfigWithAddress();

    // Return error if no siteConfig found

    if (!siteConfig) {
      return NextResponse.json(
        { error: 'Site configuration not found' },
        { status: 500 }
      );
    }

    // Check if stripeCustomerId exists, otherwise create a new customer
    if (!siteConfig.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: siteConfig.email,
        address: {
          line1: siteConfig.address?.streetName,
          line2: siteConfig.address?.streetNumber,
          city: siteConfig.address?.city,
          state: siteConfig.address?.state,
          postal_code: siteConfig.address?.postCode,
          country: siteConfig.address?.country,
        },
      });

      // Update the siteConfig with the new Stripe Customer ID
      await siteConfigService.setStripeCustomerForSiteConfig(
        customer.id,
        siteConfig.siteConfigId
      );
    } else {
      // Retrieve existing customer
      customer = await stripe.customers.retrieve(siteConfig.stripeCustomerId);
    }

    try {
      // Create Checkout Session from body params
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1Qmu4qG8VZtHOb57cKVJ6x40', // Replace with your actual Price ID
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer: customer.id,
        success_url: `http://${req.headers.get('host')}`,
        cancel_url: `http://${req.headers.get('host')}`,
        automatic_tax: { enabled: true },
        customer_update: {
          address: 'auto', // Automatically update the address entered during checkout
        },
        metadata: {
          siteConfigId: siteConfig.siteConfigId, // Add siteConfigId to metadata
        },
      });

      // Redirect to Stripe Checkout session URL
      if (session.url) {
        return NextResponse.redirect(session.url, 303);
      } else {
        return NextResponse.json(
          { error: 'Session URL is null' },
          { status: 500 }
        );
      }
    } catch (err) {
      // Handle errors if any occur during the Checkout Session creation
      if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405, headers: { Allow: 'POST' } }
    );
  }
}
