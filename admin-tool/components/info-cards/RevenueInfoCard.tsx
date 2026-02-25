import React from 'react';

import { statisticsApiService } from '@/lib/api/concrete/statistics';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRightIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import AnimatedCounter from '../helpers/AnimatedCounter';
import { Badge } from '../ui/badge';
export default async function RevenueInfoCard() {
  const t = await getTranslations('Dashboard.InfoCards.revenue');
  const tCurrency = await getTranslations('Dashboard.InfoCards');
  const { currentMonthRevenue, percentageChange } =
    await statisticsApiService.getRevenueStats();

  console.log('RevenueInfoCard', currentMonthRevenue, percentageChange);

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

  function convertCentsToEuros(currentMonthRevenue: number): number {
    return Number((currentMonthRevenue / 100).toFixed(2));
  }

  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <CardDescription>{t('subtitle')}</CardDescription>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter
            value={convertCentsToEuros(currentMonthRevenue)}
            decimals={2}
            prefix={tCurrency('currency')}
          />
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
          {renderComparison(currentMonthRevenue, percentageChange)}
        </div>
        <div className='text-muted-foreground'>
          {t('subtitle')} {''}
          {t('timeframe')}
        </div>
      </CardFooter>
    </Card>
  );
}
