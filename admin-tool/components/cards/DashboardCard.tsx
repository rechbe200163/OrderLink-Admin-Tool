import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRightIcon, TrendingDown, TrendingUp } from 'lucide-react';
import AnimatedCounter from '../helpers/AnimatedCounter';

export function DashboardCard({
  title,
  value,
  change,
  icon,
  link,
}: {
  title: string;
  value: string | number;
  change?: {
    value: number;
    timeframe: string;
  };
  icon?: React.ReactNode;
  link?: string;
}) {
  const getChangeIcon = (changeValue: number) => {
    if (changeValue > 0) return <TrendingUp className='h-4 w-4' />;
    if (changeValue < 0) return <TrendingDown className='h-4 w-4' />;
    return <ArrowRightIcon className='h-4 w-4' />;
  };

  const getChangeColor = (changeValue: number) => {
    if (changeValue > 0) return 'text-green-600';
    if (changeValue < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className='@container/card'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='flex flex-col space-y-1'>
          <div className='flex items-baseline justify-between'>
            <span className='text-2xl font-bold'>
              <AnimatedCounter value={Number(value)} />
            </span>
            {change && (
              <span
                className={`flex items-center text-sm ${getChangeColor(
                  change.value
                )}`}
              >
                {getChangeIcon(change.value)}
                <span className='ml-1'>{Math.abs(change.value)}%</span>
              </span>
            )}
          </div>
          {change && (
            <span className='hidden text-xs text-muted-foreground md:inline-block'>
              {change.timeframe}
            </span>
          )}
          {link && (
            <Link
              href={link}
              className='text-xs text-muted-foreground hover:underline'
            >
              View all
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
