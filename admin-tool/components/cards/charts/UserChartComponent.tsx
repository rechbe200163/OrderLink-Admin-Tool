'use client';
import { AreaChart, CartesianGrid, XAxis, Area } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CustomerGrowth } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  growth: {
    label: 'Kundenwachstum ',
    color: 'hsl(var(--chart-2))',
  },
  cumulative_growth: {
    label: 'Kumulatives Kundenwachstum ',
    color: 'hsl(var(--chart-1))',
  },
};

export function CustomerGrowthCharts({
  chartData,
}: {
  chartData: CustomerGrowth;
}) {
  // get date range from chartData
  const dateRange = chartData.map((item) => item.date);
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[dateRange.length - 1]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kundenwachstumsdiagramm</CardTitle>
        <CardDescription className='flex items-center gap-2 justify-between'>
          Monatliches und kumulatives Kundenwachstum{' '}
          <div className='flex items-center gap-2 leading-none text-muted-foreground'>
            Von{' '}
            {startDate.toLocaleDateString('de-AT', {
              month: 'long',
              year: 'numeric',
            })}{' '}
            bis{' '}
            {endDate.toLocaleDateString('de-AT', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('de-AT', {
                  month: 'short',
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dashed' />}
            />
            <Area
              dataKey='growth'
              type='natural'
              fill='var(--color-growth)'
              fillOpacity={0.4}
              stroke='var(--color-growth)'
              stackId='a'
            />
            <Area
              dataKey='cumulative_growth'
              type='natural'
              fill='var(--color-cumulative_growth)'
              fillOpacity={0.4}
              stroke='var(--color-cumulative_growth)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
