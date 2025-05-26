'use client';

import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', actual: 186 },
  { month: 'February', actual: 305 },
  { month: 'March', actual: 237 },
  { month: 'April', actual: 273 },
  { month: 'May', actual: 209 },
  { month: 'June', actual: 214, forecast: 214 },
  { month: 'July', forecast: 250 },
  { month: 'August', forecast: 270 },
  { month: 'September', forecast: 290 },
  { month: 'October', forecast: 310 },
  { month: 'November', forecast: 330 },
  { month: 'December', forecast: 350 },
];

const chartConfig = {
  actual: {
    label: 'Actual',
    color: 'hsl(var(--chart-1))',
  },
  forecast: {
    label: 'Forecast',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function SkeletonProductAmountChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Amount Trend and Forecast</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type='monotone'
              dataKey='actual'
              stroke='var(--color-actual)'
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
            <Line
              type='monotone'
              dataKey='forecast'
              stroke='var(--color-forecast)'
              strokeWidth={2}
              strokeDasharray='5 5'
              dot={false}
              activeDot={{ r: 8 }}
            />
            <ReferenceLine
              x='June'
              stroke='hsl(var(--foreground))'
              strokeDasharray='3 3'
            />
            <Legend />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Forecast trending up by 35.5% <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing actual visitors and forecast for the next 3 months
        </div>
      </CardFooter>
    </Card>
  );
}
