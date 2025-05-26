import React from 'react';

import { DashboardCard } from '../cards/DashboardCard';
import {
  ArrowRightIcon,
  Sigma,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { statisticsApiService } from '@/lib/api/concrete/statistics';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import AnimatedCounter from '../helpers/AnimatedCounter';
import { Badge } from '../ui/badge';

export default async function SalesInfoCard() {
  const t = await getTranslations('Dashboard.InfoCards.monthlySales');

  const { currentMonthSales, percentageChange } =
    await statisticsApiService.getSalesStats();

  const getTrendIcon = () => {
    if (percentageChange > 0) return <TrendingUpIcon className='size-3' />;
    if (percentageChange < 0) return <TrendingDownIcon className='size-3' />;
    return <ArrowRightIcon className='size-3' />;
  };

  function renderComparison(current: number, percentageChange: number | null) {
    if (percentageChange == null) return 'Keine Daten für letzten Monat';

    if (percentageChange > 0) {
      return (
        <>
          Mehr als letzten Monat <TrendingUpIcon className='size-4' />
        </>
      );
    }

    if (percentageChange < 0) {
      return (
        <>
          Weniger als letzten Monat <TrendingDownIcon className='size-4' />{' '}
        </>
      );
    }

    return 'Gleich wie letzten Monat';
  }
  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <CardDescription>Verkaufs-Info-Karte</CardDescription>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter value={currentMonthSales} />
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
