import { SectionCards } from '@/components/section-cards';

import QuickStats from '@/components/helpers/charts/QuickStats';

export default function Page() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main w-full max-w-none'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />
        </div>
        <QuickStats />
      </div>
    </div>
  );
}
