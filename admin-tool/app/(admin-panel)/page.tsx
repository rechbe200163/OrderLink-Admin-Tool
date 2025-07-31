import { SectionCards } from '@/components/section-cards';
import QuickStats from '@/components/helpers/charts/QuickStats';
import { redirect } from 'next/navigation';
import { isModuleEnabled } from '@/lib/modules';
import { MODULE_NAME } from '@/lib/types';

export default async function Page() {
  const isStatisticsEnabled = await isModuleEnabled(MODULE_NAME.STATISTICS);
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main w-full max-w-none'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />
          {isStatisticsEnabled ? (
            <QuickStats />
          ) : (
            <div className='bg-background rounded-lg shadow-md p-4'>
              <p className='text-gray-500'>Statistics module is not enabled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
