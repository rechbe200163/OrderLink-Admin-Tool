import { Suspense } from 'react';
import SalesInfoCard from './info-cards/SalesInfoCard';
import RevenueInfoCard from './info-cards/RevenueInfoCard';
import CustomerInfoCard from './info-cards/CustomerInfoCard';
import InfoCardSkeleton from './skeletons/InfoCardSkeleton';
import AvarageOderValueCard from './info-cards/AvarageOrdervalue';
import CustomerPredictionInfoCard from './info-cards/CustomerPredictionInfoCard';
import OrderPredictionInfoCard from './info-cards/OrderPredictionInfoCard';

export function SectionCards() {
  return (
    <div className='data-[slot=card]:*:shadow-2xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 data-[slot=card]:*:bg-linear-to-t data-[slot=card]:*:from-primary/5 data-[slot=card]:*:to-card dark:data-[slot=card]:*:bg-card lg:px-6'>
      <Suspense fallback={<InfoCardSkeleton />}>
        <RevenueInfoCard />
      </Suspense>
      <Suspense fallback={<InfoCardSkeleton />}>
        <CustomerInfoCard />
      </Suspense>
      <Suspense fallback={<InfoCardSkeleton />}>
        <SalesInfoCard />
      </Suspense>
      <Suspense fallback={<InfoCardSkeleton />}>
        <AvarageOderValueCard />
      </Suspense>
      <Suspense fallback={<InfoCardSkeleton />}>
        <CustomerPredictionInfoCard />
      </Suspense>
      <Suspense fallback={<SectionCardSekeleton />}>
        <OrderPredictionInfoCard />
      </Suspense>
    </div>
  );
}
