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
type RangeValue<T extends DateValue> = {
  start: T;
  end: T;
};

import { cn } from '@/lib/utils';
import { RangeCalendar } from '@/components/ui/calendar-rac';
import { DateInput, dateInputStyle } from '@/components/ui/datefield-rac';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Component() {
  const [date, setDate] = useState<RangeValue<CalendarDate> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  // Converts CalendarDate → JS Date
  const toJSDate = (calendarDate: CalendarDate): Date =>
    new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);

  // Update the URL with the selected date range
  const updateUrlWithDates = useCallback(() => {
    const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

    if (date?.start) {
      params.set('startDate', formatDate(toJSDate(date.start)));
    } else {
      params.delete('startDate');
    }

    if (date?.end) {
      params.set('endDate', formatDate(toJSDate(date.end)));
    } else {
      params.delete('endDate');
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [date, params, pathname, router]);

  useEffect(() => {
    updateUrlWithDates();
  }, [date, updateUrlWithDates]);

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
        <Button className='text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]'>
          <CalendarIcon size={16} />
        </Button>
      </div>

      <Popover
        className='bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-md border shadow-lg outline-hidden'
        offset={4}
      >
        <Dialog className='max-h-[inherit] overflow-auto p-2'>
          <RangeCalendar
            value={date}
            onChange={(value) => {
              // Only accept CalendarDate, not CalendarDateTime
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
