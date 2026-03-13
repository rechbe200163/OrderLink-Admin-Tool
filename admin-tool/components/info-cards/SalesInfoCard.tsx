import React from 'react';

import { ArrowRightIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { dataAnalysisService } from '@/lib/api/concrete/data-analysis';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import AnimatedCounter from '../helpers/AnimatedCounter';
import { Badge } from '../ui/badge';
import { ErrorCard } from '../error-card';

export default async function SalesInfoCard() {
  const t = await getTranslations('Dashboard.InfoCards.monthlySales');

  const {ok, growth} = await dataAnalysisService.getOrderAmount(0, true, false, true, true);

  if (!ok) {
      return <ErrorCard />;
    }
  
  let currentMonthSales = 0;
  let percentageChange: number | null = null;

  try {
    const lastItem = growth[Object.keys(growth).at(-1)!];

    currentMonthSales = lastItem[1];
    percentageChange = lastItem[0];

  }
  catch (error)
  {
    return <ErrorCard/>
  }

  const getTrendIcon = () => {
    if (percentageChange > 0) return <TrendingUpIcon className='size-3' />;
    if (percentageChange < 0) return <TrendingDownIcon className='size-3' />;
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
        <CardDescription>{t('monthlySalesCount')}</CardDescription>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter value={currentMonthSales} />
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
          {renderComparison(currentMonthSales, percentageChange)}
        </div>
        <div className='text-muted-foreground'>
          {t('subtitle')} {''}
          {t('timeframe')}
        </div>
      </CardFooter>
    </Card>
  );
}
