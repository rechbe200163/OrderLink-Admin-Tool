import { Suspense } from 'react';
import RevenueInfoCard from './info-cards/RevenueInfoCard';
import CustomerInfoCard from './info-cards/CustomerInfoCard';
import SalesInfoCard from './info-cards/SalesInfoCard';
import SectionCardSekeleton from './skeletons/SectionCardSekeleton';
import AvarageOderValueCard from './info-cards/AvarageOrdervalue';

export function SectionCards() {
  return (
    <div className='*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6'>
      <Suspense fallback={<SectionCardSekeleton />}>
        <RevenueInfoCard />
      </Suspense>
      <Suspense fallback={<SectionCardSekeleton />}>
        <CustomerInfoCard />
      </Suspense>
      <Suspense fallback={<SectionCardSekeleton />}>
        <SalesInfoCard />
      </Suspense>
      <Suspense fallback={<SectionCardSekeleton />}>
        <AvarageOderValueCard />
      </Suspense>
    </div>
  );
}
