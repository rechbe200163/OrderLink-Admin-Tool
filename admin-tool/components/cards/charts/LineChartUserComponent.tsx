'use client';

import * as React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatDateTime } from '@/lib/utils';
import { FormMessage } from '@/components/ui/form';
import { useTranslations } from 'next-intl';

interface LineChartUserComponentProps {
  growth: Record<string, number>;
  predictions?: Record<string, number>;
  title: string;
  dateFormatter?: 'day-month' | 'month-year';
  from?: string;
  to?: string;
}

const chartConfig = {
  growth: {
    label: 'Verlauf',
    color: 'var(--chart-1)',
  },
  prediction: {
    label: 'Prognose',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function LineChartUserComponent({
  growth,
  predictions,
  title,
  dateFormatter = 'day-month',
  from = 'von',
  to = 'bis',
}: LineChartUserComponentProps) {
  const t = useTranslations('Dashboard.Charts.CustomerGrowth');
  const growthDates = Object.keys(growth);
  const predictionDates = predictions ? Object.keys(predictions) : [];

  const allDates = Array.from(
    new Set([...growthDates, ...predictionDates]),
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const firstPredictionDate = predictionDates.length
    ? [...predictionDates].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      )[0]
    : undefined;

  const data = allDates.map((date) => ({
    date,
    growth: growth[date] ?? null,
    prediction: predictions?.[date] ?? null,
    isPredictionStart: date === firstPredictionDate,
  }));

  const startDate = allDates[0];
  const endDate = allDates.at(-1);

  return (
    <Card>
      <CardHeader className='space-y-2'>
        <CardTitle>{title}</CardTitle>

        <CardDescription className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-muted-foreground'>
            {from} {startDate ? formatDateTime(startDate) : '—'} {to}{' '}
            {endDate ? formatDateTime(endDate) : '—'}
          </div>

          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <span
                className='h-2.5 w-2.5 rounded-full'
                style={{ backgroundColor: 'var(--chart-1)' }}
              />
              {t('trend')}
            </div>

            {predictions && Object.keys(predictions).length > 0 && (
              <div className='flex items-center gap-2'>
                <span
                  className='h-2.5 w-2.5 rounded-full'
                  style={{ backgroundColor: 'var(--chart-2)' }}
                />
                {t('predicted')}
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className='h-75 w-full'>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatDateTime}
            />

            <YAxis tickLine={false} axisLine={false} tickMargin={8} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='line'
                  labelFormatter={(label) => formatDateTime(String(label))}
                />
              }
            />

            {firstPredictionDate && (
              <ReferenceLine
                x={firstPredictionDate}
                stroke='var(--border)'
                strokeDasharray='10 10'
              />
            )}

            <Line
              dataKey='growth'
              type='monotone'
              stroke='var(--color-growth)'
              strokeWidth={2.5}
              dot={true}
              activeDot={{ r: 5 }}
              connectNulls
            />

            {predictions && Object.keys(predictions).length > 0 && (
              <Line
                dataKey='prediction'
                type='monotone'
                stroke='var(--color-prediction)'
                strokeWidth={2.5}
                strokeDasharray='6 6'
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='text-xs text-muted-foreground'>
        {predictions && Object.keys(predictions).length > 0
          ? 'Die gestrichelte Linie zeigt die Prognose ab dem Forecast-Beginn.'
          : 'Es werden nur historische Werte angezeigt.'}
      </CardFooter>
    </Card>
  );
}
