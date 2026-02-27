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

interface ProductsMostlyBoughtProps {
  products: Record<string, number>;
  cardTitle?: string;
  cardDescription?: string;
}

const renderBarLabel = (props : any) => {
  const { x, y, width, height, value } = props;

  if (!width || width < 20) return null;

  const padding = 8;
  const availableWidth = width - padding;

  // grobe Schätzung: 7px pro Zeichen
  const approxCharWidth = 7;
  const maxChars = Math.floor(availableWidth / approxCharWidth);

  let displayText = value;

  if (value.length > maxChars) {
    displayText = value.slice(0, maxChars - 3) + "...";
  }

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={12}
    >
      {displayText}
    </text>
  );
};


export function ProductsMostlyBought({
  products,
  cardTitle,
  cardDescription
}: ProductsMostlyBoughtProps) {
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
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
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
