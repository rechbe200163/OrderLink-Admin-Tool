// import SubscriptionDetails from '@/components/SubscriptionDetails';
// import { Button } from '@/components/ui/button';
// import { getSiteConfig } from '@/lib/depricated-data/data.siteconfig';
// import { getSubscriptions } from '@/lib/depricated-data/data.subscription';
// import { Subscription } from '@/lib/types';
// import { stripeService } from '@/lib/services/StripeService';
// import Link from 'next/link';

// export default async function SubscriptionPage() {
//   const siteConfig = await getSiteConfig();

//   const subscriptionsResponse = siteConfig?.stripeCustomerId
//     ? await getSubscriptions(siteConfig.stripeCustomerId)
//     : { data: [] };

//   const subscriptions: Subscription[] = subscriptionsResponse.data.map(
//     (sub) => ({
//       id: sub.id,
//       status: sub.status,
//       current_period_start: sub.current_period_start,
//       current_period_end: sub.current_period_end,
//       currency: sub.currency,
//       plan: {
//         amount: sub.items.data[0].price.unit_amount ?? 0,
//         interval: sub.items.data[0].price.recurring?.interval ?? 'unknown',
//         interval_count: sub.items.data[0].price.recurring?.interval_count ?? 1,
//       },
//     })
//   );

//   const configreStripeUrl = await stripeService.createAccountLink(
//     siteConfig?.stripeAccountId ?? ''
//   );

//   if (!siteConfig) {
//     return <div>Site config not found.</div>;
//   }

//   return (
//     <div className='container mx-auto p-4'>
//       <h1 className='text-2xl font-bold mb-4'>Your Subscription</h1>
//       {subscriptionsResponse.data.length <= 0 ? (
//         <div>No subscriptions available.</div>
//       ) : (
//         subscriptions.map((subscription) => (
//           <SubscriptionDetails
//             siteconfigId={siteConfig?.siteConfigId}
//             key={subscription.id}
//             subscription={subscription}
//           />
//         ))
//       )}
//       {!configreStripeUrl ? (
//         <div className='text-center p-4'>No subscription found.</div>
//       ) : (
//         <div className='flex justify-center'>
//           <Button asChild>
//             {siteConfig?.stripeConfigured ? (
//               <div>Stripe configured successfully.</div>
//             ) : (
//               <Link href={configreStripeUrl.url}>Configure Stripe</Link>
//             )}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
