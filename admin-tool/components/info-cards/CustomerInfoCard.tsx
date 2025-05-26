import React from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRightIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { customerApiService } from '@/lib/api/concrete/customers';
import { getTranslations } from 'next-intl/server';
import { Badge } from '../ui/badge';
import AnimatedCounter from '../helpers/AnimatedCounter';
export default async function CustomerInfoCard() {
  const t = await getTranslations('Dashboard.InfoCards.customer');

  const { currentMonthSignUps, percentageChange } =
    await customerApiService.getCustomerStats();

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
        <CardDescription>Monatliche Neuanmeldungen</CardDescription>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter value={currentMonthSignUps} />
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
