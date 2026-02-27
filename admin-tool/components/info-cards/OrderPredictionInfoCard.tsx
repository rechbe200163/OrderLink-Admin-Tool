import React from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import AnimatedCounter from '../helpers/AnimatedCounter';
import { dataAnalysisService } from '@/lib/api/concrete/data-analysis';
export default async function OrderPredictionInfoCard() {
  const t = await getTranslations('Dashboard.InfoCards.monthlySales');

  const { predictions, typeofgraph } = await dataAnalysisService.getOrdersGrowthPrediction(
    false,
    false,
    true,
    false
  );
  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <CardDescription>{t('monthlySalesForecast')}</CardDescription>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter value={Object.values(predictions)[0] ?? 0} />
        </CardTitle>
        <div className='absolute right-4 top-4'>
        </div>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 text-sm'>
        <div className='text-muted-foreground'>
          {t('predictedSalesGrowth')} {''}
          {t('predictedtimeframe')}
        </div>
      </CardFooter>
    </Card>
  );
}