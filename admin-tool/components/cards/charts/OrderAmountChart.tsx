'use client';

import * as React from 'react';
import { AreaChart, CartesianGrid, XAxis, Area, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { OrderAmountResponse } from '@/lib/types';

type OrderAmountPoint = {
  date: string; // ISO yyyy-mm-dd
  growth: number;
  cumulative_growth: number;
};

const chartConfig = {
  growth: {
    label: 'Bestellungswachstum',
    color: 'hsl(var(--chart-2))',
  },
  cumulative_growth: {
    label: 'Kumulatives Bestellungswachstum',
    color: 'hsl(var(--chart-1))',
  },
};

function toSeries(data: OrderAmountResponse): OrderAmountPoint[] {
  const dateSet = new Set<string>([
    ...Object.keys(data.growth ?? {}),
    ...Object.keys(data.cumulative_growth ?? {}),
  ]);

  return Array.from(dateSet)
    .sort((a, b) => a.localeCompare(b)) // ISO-Date sortiert korrekt lexikografisch
    .map((date) => ({
      date,
      growth: data.growth?.[date] ?? 0,
      cumulative_growth: data.cumulative_growth?.[date] ?? 0,
    }));
}

function safeDate(dateStr: string): Date {
  // dateStr ist "YYYY-MM-DD" → als lokale Zeit interpretieren (nicht UTC-shiften)
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function OrderAmountChart({
  chartData,
}: {
  chartData: OrderAmountResponse;
}) {
  const series = React.useMemo(() => toSeries(chartData), [chartData]);

  const start = series[0]?.date;
  const end = series[series.length - 1]?.date;

  const startDate = start ? safeDate(start) : null;
  const endDate = end ? safeDate(end) : null;

  if (!series.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bestellanzahl</CardTitle>
          <CardDescription>Keine Daten vorhanden</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bestellanzahl</CardTitle>
        <CardDescription className='flex items-center gap-2 justify-between'>
          Monatliches und kumulatives Bestellungswachstum
          <div className='flex items-center gap-2 leading-none text-muted-foreground'>
            Von{' '}
            {startDate?.toLocaleDateString('de-AT', {
              month: 'long',
              year: 'numeric',
            })}{' '}
            bis{' '}
            {endDate?.toLocaleDateString('de-AT', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={series} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                safeDate(String(value)).toLocaleDateString('de-AT', {
                  month: 'short',
                })
              }
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
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

      <CardFooter>{/* optional Footer-Inhalte */}</CardFooter>
    </Card>
  );
}
