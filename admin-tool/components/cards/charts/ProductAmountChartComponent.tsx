'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

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
import { ProductsAmount } from '@/lib/api/external/concrete/ProductsAmount';
type ChartItem = {
  name: string;
  value: number;
};
const chartConfig = {
  value: {
    label: 'Anzahl',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig;

export function ProductsBarChart({ products }: { products: ProductsAmount }) {
  // Convert object to array
  const chartData: ChartItem[] = Object.entries(products).map(
    ([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0,
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produkte</CardTitle>
        <CardDescription>Produkte nach Anzahl im Lager</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='name'
              tickLine={false}
              tickMargin={1}
              axisLine
              angle={-90}
              textAnchor='end'
              height={70}
            />
            <YAxis
              tickLine={false}
              tickMargin={5}
              width={40}
              domain={[0, 'dataMax + 5']}
              tickFormatter={(value) => {
                if (value > 1000) {
                  return `${Math.floor(value / 1000)}k`;
                }
                return value;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='value' fill='var(--color-value)' radius={8}>
              <LabelList
                position='top'
                offset={12}
                className='fill-foreground '
                fontSize={14}
                accumulate='sum'
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
