'use client';
import { Label } from '@/components/ui/label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useId, useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ENDPOINTS, type EndpointKey } from '@/lib/api/endpoints';
import { type PagingMeta } from '@/lib/dtos';

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
  values?: { label: string; value: string; color?: string }[];
  filterName: string; // This prop will indicate which filter is being applied (e.g., 'filter' or 'category')
  title: string;
  endpoint?: EndpointKey; // optional API endpoint for dynamic values
}

export default function FilteringComponent({
  values: propValues,
  filterName,
  title,
  endpoint,
}: FilteringComponentProps) {
  const id = useId();
  const t = useTranslations('FilterAndSearch');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!endpoint || !open) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    fetch(`/api/${ENDPOINTS[endpoint]}/paging?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setFetchedValues(
          data.data.map((item: any) => ({
            label: item.name ?? item.label,
            value: item.name ?? item.value,
          }))
        );
        setMeta(data.meta as PagingMeta);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [endpoint, open, page]);

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchedValues, setFetchedValues] = useState<{ label: string; value: string; color?: string }[]>([]);
  const [meta, setMeta] = useState<PagingMeta | null>(null);

  const values = endpoint ? fetchedValues : propValues || [];

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
    params.delete('page'); // reset paging when filter changes

    replace(`${pathname}?${params.toString()}`); // Update the URL with the new search params
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
              <div key={`${value.value}-${i}`} className='flex items-center gap-2'>
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
            {endpoint && (
              <div className='flex items-center justify-between pt-2'>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta?.isFirstPage}
                  className='disabled:opacity-50'
                  aria-label='Previous page'
                >
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>
                <span className='text-sm'>{meta?.currentPage ?? page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta?.isLastPage}
                  className='disabled:opacity-50'
                  aria-label='Next page'
                >
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
