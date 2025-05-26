import React from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUpIcon, TrendingDownIcon, ArrowRightIcon } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

export type StatsCardProps = {
  title: string;
  value: number;
  percentageChange: number;
  description?: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  percentageChange,
  description = 'Visitors for the last 6 months',
}) => {
  const getTrendIcon = () => {
    if (percentageChange > 0) return <TrendingUpIcon className='size-3' />;
    if (percentageChange < 0) return <TrendingDownIcon className='size-3' />;
    return <ArrowRightIcon className='size-3' />;
  };

  const getFormattedValue = (value: number) => {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <CardDescription>{title}</CardDescription>
        <CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
          <AnimatedCounter value={value} />
        </CardTitle>
        <div className='absolute right-4 top-4'>
          <Badge variant='outline' className='flex gap-1 rounded-lg text-xs'>
            {getTrendIcon()}
            {percentageChange > 0 ? '+' : ''}
            {percentageChange}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>
          Trending {percentageChange >= 0 ? 'up' : 'down'} this month
          <TrendingUpIcon className='size-4' />
        </div>
        <div className='text-muted-foreground'>{description}</div>
      </CardFooter>
    </Card>
  );
};

export default StatsCard;
