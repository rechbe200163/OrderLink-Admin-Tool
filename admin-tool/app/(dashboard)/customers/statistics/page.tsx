import { LineChartUserComponent } from '@/components/cards/charts/LineChartUserComponent';
import { dataAnalysisService } from '@/lib/api/concrete/data-analysis';
import { getTranslations } from 'next-intl/server';
import { CustomerPredictionGrowth } from '@/lib/types';

export default async function CustomerStatisticsPage() {
  const t = await getTranslations('Dashboard.Charts.CustomerGrowth');

  let monthPredictions: CustomerPredictionGrowth | null;
  let dayPredictions: CustomerPredictionGrowth | null;

  try {
    monthPredictions = await dataAnalysisService.getCustomerGrowthPredictionMonth();

    dayPredictions = await dataAnalysisService.getCustomerGrowthPrediction();
  } catch (error) {
    console.error('Error fetching customer growth data:', error);
    monthPredictions = null;
    dayPredictions = null;
  }

  const monthSignUps = await dataAnalysisService.getCustomerSignUps(0, true, false, true, false);

  const last30daysSignUps = await dataAnalysisService.getCustomerSignUps(30, false, false, true, false);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main w-full max-w-none px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-6'>
          <header className='space-y-1'>
            <h1 className='text-xl font-semibold tracking-tight'>
              {t('title')}
            </h1>
            <p className='text-sm text-muted-foreground'>{t('description')}</p>
          </header>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <LineChartUserComponent
              growth={last30daysSignUps.growth}
              {...(dayPredictions ? { predictions: dayPredictions.predictions } : {})}
              title={t('dailyTimeFrame') + ' ' + t('subtitle')}
              dateFormatter='day-month'
              from={t('from')}
              to={t('to')}
            />
            <LineChartUserComponent
              growth={monthSignUps.growth}
              {...(monthPredictions ? { predictions: monthPredictions.predictions } : {})}
              title={t('monthlyTimeFrame') + ' ' + t('subtitle')}
              dateFormatter='month-year'
              from={t('from')}
              to={t('to')}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
