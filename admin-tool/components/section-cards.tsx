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
    <div className='px-4 lg:px-6'>
      <section className='space-y-6'>
        <h2 className='text-lg font-semibold'>Umsatz & Bestellungen</h2>

        {/* 3 Cards horizontal */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Suspense fallback={<InfoCardSkeleton />}>
            <RevenueInfoCard />
          </Suspense>
          <Suspense fallback={<InfoCardSkeleton />}>
            <AvarageOderValueCard />
          </Suspense>
          <Suspense fallback={<InfoCardSkeleton />}>
            <SalesInfoCard />
          </Suspense>
        </div>

        <h2 className='text-lg font-semibold'>Kunden</h2>

        {/* 1 Card – bleibt 1 Spalte */}
        <div className='grid grid-cols-1 gap-4'>
          <Suspense fallback={<InfoCardSkeleton />}>
            <CustomerInfoCard />
          </Suspense>
        </div>

        <h2 className='text-lg font-semibold'>Prognosen</h2>

        {/* 2 Cards horizontal */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Suspense fallback={<InfoCardSkeleton />}>
            <CustomerPredictionInfoCard />
          </Suspense>
          <Suspense fallback={<InfoCardSkeleton />}>
            <OrderPredictionInfoCard />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
