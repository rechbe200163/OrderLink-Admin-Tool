'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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

const chartData = [
  { sector: 'Agriculture', count: 40, fill: 'hsl(var(--chart-1))' },
  { sector: 'Construction', count: 30, fill: 'hsl(var(--chart-2))' },
  { sector: 'Education', count: 20, fill: 'hsl(var(--chart-3))' },
  { sector: 'Finance', count: 25, fill: 'hsl(var(--chart-4))' },
  { sector: 'Health', count: 35, fill: 'hsl(var(--chart-5))' },
  { sector: 'IT', count: 50, fill: 'hsl(var(--chart-6))' },
];

const chartConfig = {
  Agriculture: {
    label: 'Agriculture',
    color: 'hsl(var(--chart-1))',
  },
  Construction: {
    label: 'Construction',
    color: 'hsl(var(--chart-2))',
  },
  Education: {
    label: 'Education',
    color: 'hsl(var(--chart-3))',
  },
  Finance: {
    label: 'Finance',
    color: 'hsl(var(--chart-4))',
  },
  Health: {
    label: 'Health',
    color: 'hsl(var(--chart-5))',
  },
  IT: {
    label: 'IT',
    color: 'hsl(var(--chart-6))',
  },
} satisfies ChartConfig;

export function SkeletonCustomerSectorValue() {
  const totalBusinesses = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Pie Chart - Business Sectors</CardTitle>
        <CardDescription>Sector Distribution</CardDescription>
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
              dataKey='count'
              nameKey='sector'
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
                          {totalBusinesses.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Customers
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing business sector distribution
        </div>
      </CardFooter>
    </Card>
  );
}
