'use client';

import { CalendarIcon } from 'lucide-react';
import {
  Button,
  DateRangePicker,
  Dialog,
  Group,
  Popover,
} from 'react-aria-components';
import { format } from 'date-fns';
import { CalendarDate, DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import { cn } from '@/lib/utils';
import { RangeCalendar } from '@/components/ui/calendar-rac';
import { DateInput, dateInputStyle } from '@/components/ui/datefield-rac';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Component() {
  const [date, setDate] = useState<RangeValue<CalendarDate> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toJSDate = (d: CalendarDate) => new Date(d.year, d.month - 1, d.day);

  // current query as string (stable for comparisons)
  const currentQuery = searchParams.toString();

  const nextQuery = useMemo(() => {
    const params = new URLSearchParams(currentQuery);
    const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

    if (date?.start) params.set('startDate', fmt(toJSDate(date.start)));
    else params.delete('startDate');

    if (date?.end) params.set('endDate', fmt(toJSDate(date.end)));
    else params.delete('endDate');

    return params.toString();
  }, [date, currentQuery]);

  useEffect(() => {
    // WICHTIG: nur navigieren wenn sich was ändert
    if (nextQuery === currentQuery) return;

    const url = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.replace(url); // replace statt push -> kein history-spam
  }, [nextQuery, currentQuery, pathname, router]);

  return (
    <DateRangePicker
      className='*:not-first:mt-2'
      value={date}
      onChange={setDate}
    >
      <div className='flex'>
        <Group className={cn(dateInputStyle, 'pe-9')}>
          <DateInput slot='start' unstyled />
          <span aria-hidden='true' className='text-muted-foreground/70 px-2'>
            -
          </span>
          <DateInput slot='end' unstyled />
        </Group>
        <Button className='text-muted-foreground/80 hover:text-foreground z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md outline-none'>
          <CalendarIcon size={16} />
        </Button>
      </div>

      <Popover
        className='bg-background z-50 rounded-md border shadow-lg outline-hidden'
        offset={4}
      >
        <Dialog className='max-h-[inherit] overflow-auto p-2'>
          <RangeCalendar
            value={date}
            onChange={(value) => {
              if (
                value &&
                value.start instanceof CalendarDate &&
                value.end instanceof CalendarDate
              ) {
                setDate(value as RangeValue<CalendarDate>);
              }
            }}
          />
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
}
