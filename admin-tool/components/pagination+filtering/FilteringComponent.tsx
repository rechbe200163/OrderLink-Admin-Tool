'use client';
import { Label } from '@/components/ui/label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useId } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';

function StatusDot({ color }: { color: string }) {
  return (
    <svg
      width='8'
      height='8'
      fill='currentColor'
      viewBox='0 0 8 8'
      xmlns='http://www.w3.org/2000/svg'
      className='shrink-0'
      aria-hidden='true'
    >
      <circle cx='4' cy='4' r='4' className={`text-${color}-500`} />
    </svg>
  );
}

interface FilteringComponentProps {
  values: { label: string; value: string; color?: string }[];
  filterName: string; // This prop will indicate which filter is being applied (e.g., 'filter' or 'category')
  title: string;
}

export default function FilteringComponent({
  values,
  filterName,
  title,
}: FilteringComponentProps) {
  const id = useId();
  const t = useTranslations('FilterAndSearch');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Get the current filter parameter from the URL based on filterName (e.g., 'filter' or 'category')
  const currentFilter = searchParams.get(filterName) || '';
  const selectedValues = currentFilter ? currentFilter.split(',') : [];

  // Handle changes to selected filter values
  const handleFilterChange = (checked: boolean, value: string) => {
    const params = new URLSearchParams(searchParams.toString()); // Keep existing query params

    // Add or remove the filter value based on whether it's checked or unchecked
    if (checked) {
      selectedValues.push(value);
    } else {
      const index = selectedValues.indexOf(value);
      if (index > -1) {
        selectedValues.splice(index, 1);
      }
    }

    // Update the query parameter for the filter
    if (selectedValues.length > 0) {
      params.set(filterName, selectedValues.join(','));
    } else {
      params.delete(filterName);
    }

    replace(`${pathname}?${params.toString()}`); // Update the URL with the new search params
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>
          <Filter
            className='-ms-1 me-2 opacity-60'
            size={16}
            strokeWidth={2}
            aria-hidden='true'
          />
          {title}
          {selectedValues.length > 0 && (
            <span className='-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70'>
              {selectedValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='min-w-36 p-3' align='start'>
        <div className='space-y-3'>
          <div className='text-xs font-medium text-muted-foreground'>
            {t('Filter.title')}
          </div>
          <div className='space-y-3'>
            {values.map((value, i) => (
              <div key={value.value} className='flex items-center gap-2'>
                <Checkbox
                  id={`${id}-${i}`}
                  checked={selectedValues.includes(value.value)} // Check if this filter value is selected
                  onCheckedChange={(checked: boolean) =>
                    handleFilterChange(checked, value.value)
                  }
                />
                <Label
                  htmlFor={`${id}-${i}`}
                  className='flex grow justify-stretch gap-2 font-normal items-center'
                >
                  {/* Render the colored dot */}

                  <StatusDot color={value.color || ''} />
                  <span
                    className={`text-${value.color}-500 inline-block`}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                    }}
                  />
                  {value.label}
                  <span className='ms-2 text-xs text-muted-foreground'>
                    {/* Optionally show count */}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
