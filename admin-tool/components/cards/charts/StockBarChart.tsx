'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const chartConfig = {
  quantity: {
    label: 'Units',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type ProductsRecord = Record<string, number>;
type ProductRow = { name: string; quantity: number };
type StockType = 'high' | 'low';

interface ProductsBarChartProps {
  products: ProductsRecord;
  cardTitle: string;
  cardDescription: string;
  maxLabelLength?: number;
  limit?: number;
  type: StockType;
}

function shortenLabel(label: string, maxLen: number) {
  if (label.length <= maxLen) return label;
  return label.slice(0, Math.max(0, maxLen - 1)) + '…';
}

function calcYAxisWidth(data: ProductRow[], max = 240, min = 120) {
  const longest = data.reduce((acc, p) => Math.max(acc, p.name.length), 0);
  const px = Math.round(longest * 7 + 24);
  return Math.max(min, Math.min(max, px));
}

const chartColorsByType = {
  high: [
    'var(--chart-high-1)',
    'var(--chart-high-2)',
    'var(--chart-high-3)',
    'var(--chart-high-4)',
    'var(--chart-high-5)',
  ],
  low: [
    'var(--chart-low-1)',
    'var(--chart-low-2)',
    'var(--chart-low-3)',
    'var(--chart-low-4)',
    'var(--chart-low-5)',
  ],
} as const;

function getChartVar(index: number, type: StockType) {
  const arr = chartColorsByType[type];
  return arr[index % arr.length];
}

export function StockBarChart({
  products,
  cardTitle,
  cardDescription,
  maxLabelLength = 26,
  limit = 5,
  type,
}: ProductsBarChartProps) {
  const data: ProductRow[] = Object.entries(products)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  const sliced = data.slice(0, limit);
  const yAxisWidth = calcYAxisWidth(sliced);

  const status =
    type === 'high'
      ? {
          label: 'OK',
          className: 'bg-primary/10 text-primary border-primary/20',
        }
      : {
          label: 'Kritisch',
          className: 'bg-destructive/10 text-destructive border-destructive/20',
        };

  const maxValue = sliced.reduce((m, d) => Math.max(m, d.quantity), 0);
  const rightPad = Math.max(32, String(maxValue).length * 10 + 24); // Platz für "123456"

  return (
    <Card className='flex flex-col overflow-hidden'>
      {/* Header macht die Card „Teil der Story“ */}
      <CardHeader className='space-y-1 pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-0.5'>
            <CardTitle className='text-base'>{cardTitle}</CardTitle>
            <CardDescription className='text-sm'>
              {cardDescription}
            </CardDescription>
          </div>

          <div className='flex items-center gap-2'>
            <Badge variant='outline' className={status.className}>
              {status.label}
            </Badge>
            <Badge variant='secondary' className='hidden sm:inline-flex'>
              Top {limit}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='flex-1 pt-0'>
        <ChartContainer config={chartConfig} className='h-[320px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={sliced}
              layout='vertical'
              margin={{ top: 4, right: rightPad, left: 8, bottom: 4 }}
              barSize={40}
              barCategoryGap={12}
              barGap={0}
            >
              <CartesianGrid horizontal={false} opacity={0.25} />

              <XAxis type='number' tick={{ fontSize: 12 }} tickLine axisLine />

              <YAxis
                dataKey='name'
                type='category'
                width={yAxisWidth}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => shortenLabel(String(v), maxLabelLength)}
                hide
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='line' />}
              />

              <Bar dataKey='quantity' layout='vertical' radius={10}>
                <LabelList
                  dataKey='name'
                  position='insideLeft'
                  dx={12}
                  className='fill-foreground'
                  fontSize={12}
                />
                <LabelList
                  dataKey='quantity'
                  position='right'
                  dx={10}
                  className='fill-muted-foreground'
                  fontSize={12}
                />

                {sliced.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={getChartVar(index, type)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
