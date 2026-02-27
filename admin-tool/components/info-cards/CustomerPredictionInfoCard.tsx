import React from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { Badge } from '../ui/badge';
import AnimatedCounter from '../helpers/AnimatedCounter';
import { dataAnalysisService } from '@/lib/api/concrete/data-analysis';
import { History } from 'lucide-react';
export default async function CustomerPredictionInfoCard() {
  const t = await getTranslations('Dashboard.InfoCards.customer');

  const { predictions, typeofgraph } =
    await dataAnalysisService.getCustomerGrowthPrediction(
      false,
      false,
      true,
      false,
    );
  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <div className='flex items-start justify-between gap-2'>
          <CardDescription>{t('monthlyCustomerForecast')}</CardDescription>

          <Badge
            variant='secondary'
            className='flex items-center gap-1 text-xs font-normal'
          >
            <History className='h-3 w-3' />
            Basierend auf vergangenen Daten
          </Badge>
        </div>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter value={Object.values(predictions)[0] ?? 0} />
        </CardTitle>
        <div className='absolute right-4 top-4'></div>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 text-sm'>
        <div className='text-muted-foreground'>
          {t('predictedCustomerGrowth')} {''}
          {t('predictedtimeframe')}
        </div>
      </CardFooter>
    </Card>
  );
}
