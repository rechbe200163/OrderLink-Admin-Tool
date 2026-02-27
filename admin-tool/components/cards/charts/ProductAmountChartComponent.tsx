'use client';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  quantity: {
    label: 'Units Sold',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const BAR_COLORS = [
  'var(--bar-1)',
  'var(--bar-2)',
  'var(--bar-3)',
  'var(--bar-4)',
  'var(--bar-5)',
];

type ProductsRecord = Record<string, number>;

type ProductRow = {
  name: string;
  quantity: number;
};

interface ProductsBarChartProps {
  products: ProductsRecord; // <-- Record<string, number>
  cardTitle: string;
  cardDescription: string;
  maxLabelLength?: number;
  /**
   * optional: limit to top N (API macht das evtl eh schon)
   */
  limit?: number;
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

export function ProductsBarChart({
  products,
  cardTitle: title,
  cardDescription: description,
  maxLabelLength = 26,
  limit,
}: ProductsBarChartProps) {
  // Record -> Array
  const data: ProductRow[] = Object.entries(products)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  const chartData = typeof limit === 'number' ? data.slice(0, limit) : data;

  const yAxisWidth = calcYAxisWidth(chartData);

  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <CardTitle className='text-base'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className='flex-1'>
        <ChartContainer config={chartConfig} className='h-[300px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout='vertical'
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey='name'
                type='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => shortenLabel(value, maxLabelLength)}
                hide
              />
              <XAxis dataKey='quantity' type='number' />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='line' />}
              />
              <LabelList
                position='inside'
                offset={-10}
                className='fill-foreground'
                fontSize={12}
                dataKey={'name'}
                content={renderBarLabel}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
