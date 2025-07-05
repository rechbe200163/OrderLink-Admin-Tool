'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import { useId, useState, useEffect, useCallback, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function DateRangeSelectComponent() {
  const id = useId();
  const [date, setDate] = useState<DateRange | undefined>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  // Update the URL with the selected date range
  const updateUrlWithDates = useCallback(() => {
    const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
    if (date?.from) {
      params.set('startDate', formatDate(date.from));
    } else {
      params.delete('startDate');
    }

    if (date?.to) {
      params.set('endDate', formatDate(date.to));
    } else {
      params.delete('endDate');
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [date, params, pathname, router]);

  useEffect(() => {
    updateUrlWithDates();
  }, [date, updateUrlWithDates]);

  // Clear date range and remove query params
  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent popover from opening
    setDate(undefined);
    params.delete('startDate');
    params.delete('endDate');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className='not-first:*:mt-2'>
        {/* <Label htmlFor={id}>Date range picker</Label> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant={'outline-solid'}
              className={cn(
                'group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-hidden focus-visible:outline-[3px]',
                !date && 'text-muted-foreground'
              )}
            >
              <span
                className={cn('truncate', !date && 'text-muted-foreground')}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} -{' '}
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  'Pick a date range'
                )}
              </span>
              <div className='flex items-center gap-2'>
                {date && (
                  <span
                    onClick={clearDates}
                    className='text-muted-foreground/80 hover:text-foreground cursor-pointer'
                    role='button'
                    aria-label='Clear date range'
                  >
                    <XIcon size={16} />
                  </span>
                )}
                <CalendarIcon
                  size={16}
                  className='text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors'
                  aria-hidden='true'
                />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-2' align='start'>
            <Calendar
              mode='range'
              lang=''
              selected={date}
              onSelect={setDate}
              numberOfMonths={2} // Optional: Show 2 months side by side
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
