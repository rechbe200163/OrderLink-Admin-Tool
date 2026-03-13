import React from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRightIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Badge } from '../ui/badge';
import AnimatedCounter from '../helpers/AnimatedCounter';
import { dataAnalysisService } from '@/lib/api/concrete/data-analysis';
import { ErrorCard } from '../error-card';

export default async function CustomerInfoCard() {
  const t = await getTranslations('Dashboard.InfoCards.customer');

  const {ok, growth} = await dataAnalysisService.getCustomerSignUpsPercentage(0, true, false, true, true);

  if (!ok) {
    return <ErrorCard />;
  }

  let currentMonthSignUps = 0;
  let percentageChange: number | null = null;

  try {
    const lastItem = growth[Object.keys(growth).at(-1)!];

    currentMonthSignUps = lastItem[1];
    percentageChange = lastItem[0];

  }
  catch (error)
  {
    return <ErrorCard/>
  }

  const getTrendIcon = () => {
    if (percentageChange !== null && percentageChange > 0) return <TrendingUpIcon className='size-3' />;
    if (percentageChange !== null && percentageChange < 0) return <TrendingDownIcon className='size-3' />;
    return <ArrowRightIcon className='size-3' />;
  };

  function renderComparison(current: number, percentageChange: number | null) {
    if (percentageChange == null) return t('noDataLastMonth');

    if (percentageChange > 0) {
      return (
        <>
          {t('moreThanLastMonth')} <TrendingUpIcon className='size-4' />
        </>
      );
    }

    if (percentageChange < 0) {
      return (
        <>
          {t('lessThanLastMonth')} <TrendingDownIcon className='size-4' />{' '}
        </>
      );
    }

    return t('sameAsLastMonth');
  }
  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <CardDescription>{t('monthlyRegistrations')}</CardDescription>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter value={currentMonthSignUps} />
        </CardTitle>
        <div className='absolute right-4 top-4'>
          <Badge variant='outline' className='flex gap-1 rounded-lg text-xs'>
            {getTrendIcon()}
            {percentageChange == null ? 0 : percentageChange > 0 ? '+' : ''}
            {percentageChange?.toFixed(0) || 0}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>
          {renderComparison(currentMonthSignUps, percentageChange)}
        </div>
        <div className='text-muted-foreground'>
          {t('subtitle')} {''}
          {t('timeframe')}
        </div>
      </CardFooter>
    </Card>
  );
}
