'use client';

import { LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
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

interface LineChartUserComponentProps {
  growth: Record<string, number>;
  predictions?: Record<string, number>;
  title: string;
  dateFormatter?: 'day-month' | 'month-year';
  from?: string;
  to?: string;
}

export function LineChartUserComponent({
  growth,
  predictions,
  title,
  dateFormatter,
  from = 'von',
  to = 'bis',
}: LineChartUserComponentProps) {

  const growthDates = Object.keys(growth);
  const predictionDates = predictions ? Object.keys(predictions) : [];

  const allDates = [...growthDates, ...predictionDates];

  const data = allDates.map((date) => ({
    date,
    growth: growth[date] ?? null,
    prediction: predictions?.[date] ?? null,
  }));

  const startDate = allDates[0];
  const endDate = allDates.at(-1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            {from} {startDate} {to} {endDate}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={{}}>
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />

            <Line
              type="monotone"
              dataKey="growth"
              stroke="#8884d8"
              isAnimationActive
            />

            {predictions && (
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#82ca9d"
                isAnimationActive
                strokeDasharray="5 5"
              />
            )}

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (dateFormatter === 'day-month') {
                  return new Date(value).toLocaleDateString('de-AT', {
                    day: '2-digit',
                    month: 'short',
                  });
                }

                return new Date(value).toLocaleDateString('de-AT', {
                  month: 'short',
                  year: '2-digit',
                });
              }}
            />

            <YAxis />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter />
    </Card>
  );
}