'use client';
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

export function ProductsMostlyBougthBarChart({
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

  const sliced = typeof limit === 'number' ? data.slice(0, limit) : data;

  const yAxisWidth = calcYAxisWidth(sliced);

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
              data={sliced}
              layout='vertical'
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
              barSize={43}
            >
              <CartesianGrid horizontal={false} />

              <XAxis
                type='number'
                tick={{ fontSize: 12 }}
                tickLine={true}
                axisLine={true}
              />

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

              <Bar dataKey='quantity' layout='vertical' radius={4}>
                <LabelList
                  dataKey='name'
                  position='insideLeft'
                  offset={8}
                  className='fill-foreground'
                  fontSize={12}
                />
                <LabelList
                  dataKey='quantity'
                  position='right'
                  offset={8}
                  className='fill-foreground'
                  fontSize={12}
                />
                {sliced.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
