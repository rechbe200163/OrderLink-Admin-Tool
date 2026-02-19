import React from 'react';
import { formatPrice } from '@/lib/utils';
import { ArrowRightIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { statisticsApiService } from '@/lib/api/concrete/statistics';
import { getTranslations } from 'next-intl/server';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import AnimatedCounter from '../helpers/AnimatedCounter';
import { Badge } from '../ui/badge';
export default async function AvarageOderValueCard() {
  const t = await getTranslations('Dashboard.InfoCards.avarageOrderValue');
  const tCurrency = await getTranslations('Dashboard.InfoCards');

  const { currentMonthAIV, lastMonthAIV, percentageChange } =
    await statisticsApiService.getAvarageOrderValueStats();

  const getTrendIcon = () => {
    if (percentageChange > 0) return <TrendingUpIcon className='size-3' />;
    if (percentageChange < 0) return <TrendingDownIcon className='size-3' />;
    return <ArrowRightIcon className='size-3' />;
  };

  function renderComparison(current: number, lastMonthAIV: number | null) {
    if (lastMonthAIV == null) return t('noDataLastMonth');

    const change = current - lastMonthAIV;
    const changePercentage =
      lastMonthAIV !== 0 ? (change / lastMonthAIV) * 100 : 0;

    if (changePercentage > 0) {
      return (
        <>
          {t('moreThanLastMonth')} <TrendingUpIcon className='size-4' /> (
          {formatPrice(change)})
        </>
      );
    }

    if (changePercentage < 0) {
      return (
        <>
          {t('lessThanLastMonth')} <TrendingDownIcon className='size-4' /> (
          {formatPrice(change)})
        </>
      );
    }

    return t('sameAsLastMonth');
  }

  console.log(
    'AvarageOderValueCard',
    currentMonthAIV,
    lastMonthAIV,
    percentageChange
  );
  function convertCentsToEuros(currentMonthAIV: number): number {
    return Number((currentMonthAIV / 100).toFixed(2));
  }
  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <CardDescription>{t('averageValue')}</CardDescription>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter
            value={convertCentsToEuros(currentMonthAIV)}
            decimals={2}
            prefix={tCurrency('currency')}
          />{' '}
        </CardTitle>
        <div className='absolute right-4 top-4'>
          <Badge variant='outline' className='flex gap-1 rounded-lg text-xs'>
            {getTrendIcon()}
            {percentageChange == null ? 0 : percentageChange > 0 ? '+' : ''}
            {percentageChange}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>
          {renderComparison(currentMonthAIV, lastMonthAIV)}
        </div>
        <div className='text-muted-foreground'>
          {t('subtitle')} {''}
          {t('timeframe')}
        </div>
      </CardFooter>
    </Card>
  );
}
