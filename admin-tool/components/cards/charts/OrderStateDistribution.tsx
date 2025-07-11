'use client';

import * as React from 'react';
import { Pie, PieChart, Label } from 'recharts';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { OrderState, OrderStateCount } from '@/lib/types';

const chartColorVars = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
  'var(--color-chart-6)',
];

const orderStates: OrderState[] = Object.values(OrderState) as OrderState[];

const stateColors: Record<OrderState, string> = orderStates.reduce(
  (acc, state, idx) => {
    acc[state] = chartColorVars[idx % chartColorVars.length];
    return acc;
  },
  {} as Record<OrderState, string>
);

export function OrderStateDistributionChart({
  data,
}: {
  data: OrderStateCount;
}) {
  const tOrderState = useTranslations(
    'FilterAndSearch.Filter.OrderState.options'
  );

  const chartConfig = {
    orders: { label: 'Bestellungen' },
    ...orderStates.reduce(
      (acc, state) => {
        acc[state] = {
          label: tOrderState(state.toLowerCase()) || state,
          color: stateColors[state],
        };
        return acc;
      },
      {} as Record<OrderState, { label: string; color: string }>
    ),
  } satisfies ChartConfig;

  const chartData = React.useMemo(() => {
    return data.map(({ orderState, _count }) => ({
      orderState,
      orders: _count,
      fill: stateColors[orderState],
    }));
  }, [data]);

  const totalOrders = data.reduce((sum, d) => sum + d._count, 0);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Bestellungen nach Status</CardTitle>
        <CardDescription>Übersicht der Bestellungen je Status.</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='orders'
              nameKey='orderState'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Bestellungen
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
