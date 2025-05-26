'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

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
import { BusinessSector } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { CustomerByBranch } from '@/lib/types';

const chartColorVars = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const businessSectors: BusinessSector[] = [
  'IT',
  'AGRICULTURE',
  'FINANCE',
  'RETAIL',
  'MANUFACTURING',
  'EDUCATION',
  'HOSPITALITY',
  'CONSTRUCTION',
  'TRANSPORTATION',
  'HEALTH',
  'TOURISM',
  'TECHNOLOGY',
  'OTHER',
];

const sectorColors: Record<BusinessSector, string> = businessSectors.reduce(
  (acc, sector, idx) => {
    acc[sector] = chartColorVars[idx % chartColorVars.length];
    return acc;
  },
  {} as Record<BusinessSector, string>
);

export function CustomerBusinessTypeDistrubution({
  data,
}: {
  data: CustomerByBranch;
}) {
  const tFilter = useTranslations('FilterAndSearch.Filter.BusinessSectors');

  const chartConfig = {
    customers: {
      label: 'Kunden',
    },
    ...businessSectors.reduce((acc, sector) => {
      acc[sector] = {
        label: tFilter(`options.${sector.toLocaleLowerCase()}`) || sector,
        color: sectorColors[sector],
      };
      return acc;
    }, {} as Record<BusinessSector, { label: string; color: string }>),
  } satisfies ChartConfig;

  const chartData = React.useMemo(() => {
    if (!data?.sectors) return [];

    return Object.entries(data.sectors)
      .filter(([, count]) => count > 0)
      .map(([sector, count]) => ({
        sector,
        customers: count,
        fill: sectorColors[sector as BusinessSector],
      }));
  }, [data]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Kundenverteilung nach Branche</CardTitle>
        <CardDescription>
          Diese Grafik zeigt die Verteilung der Kunden nach Branche.
        </CardDescription>
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
              dataKey='customers'
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
                          {data.totalCustomers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Kunden
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
    </Card>
  );
}
