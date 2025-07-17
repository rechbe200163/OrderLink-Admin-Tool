'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useId, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { OrdersWithCustomer } from '@/lib/types';
import { PagingMeta } from '@/lib/dtos';

export default function OrderSelectComponent({
  onOrderSelect,
  defaultValues = [],
}: {
  onOrderSelect: (orderIds: string[]) => void;
  defaultValues?: string[];
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);
  const [page, setPage] = useState<number>(1);
  const [orders, setOrders] = useState<OrdersWithCustomer[]>([]);
  const [meta, setMeta] = useState<PagingMeta | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (defaultValues) {
      setSelectedValues(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.append('query', search);

    fetch(`/api/orders/paging?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data);
        setMeta(data.meta);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [page, search]);

  const toggleSelect = (orderId: string) => {
    const newValues = selectedValues.includes(orderId)
      ? selectedValues.filter((id) => id !== orderId)
      : [...selectedValues, orderId];
    setSelectedValues(newValues);
    onOrderSelect(newValues);
  };

  const t = useTranslations('SelectComponents.Order');

  return (
    <div className=''>
      <Label htmlFor={id}>{t('selectedOrders')}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between bg-background px-3 font-normal outline-offset-0 focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20'
          >
            <span
              className={cn(
                'truncate',
                selectedValues.length === 0 && 'text-muted-foreground'
              )}
            >
              {selectedValues.length > 0
                ? `${selectedValues.length} order(s) selected`
                : 'Select orders'}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className='shrink-0 text-muted-foreground/80'
              aria-hidden='true'
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-full min-w-(--radix-popper-anchor-width) border-input p-0'
          align='start'
        >
          <Command>
            <CommandInput
              placeholder={t('findOrder')}
              onValueChange={setSearch}
            />
            <CommandList className='max-h-[300px] overflow-y-auto'>
              <CommandEmpty>{t('noOrderFound')}</CommandEmpty>
              <CommandGroup>
                {orders.map((order) => {
                  const label = `Order #${order.customerReference} - ${new Date(order.orderDate).toLocaleDateString()}`;
                  return (
                    <CommandItem
                      key={order.orderId}
                      value={label}
                      onSelect={() => toggleSelect(order.orderId)}
                      className='flex flex-col items-start'
                    >
                      <span>
                        {label}
                        {selectedValues.includes(order.orderId) && (
                          <Check size={16} strokeWidth={2} className='ml-2 inline' />
                        )}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {order.customer.address
                          ? `${order.customer.address.streetName}, ${order.customer.address.postCode} ${order.customer.address.city}`
                          : ''}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className='sticky bottom-0 bg-background'>
                  <Link
                    href='/orders/add'
                    className='flex w-full items-center justify-start p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
                  >
                    <Plus
                      size={16}
                      strokeWidth={2}
                      className='mr-2 opacity-60'
                      aria-hidden='true'
                    />
                    {t('addNewOrder')}
                  </Link>
                </div>
              </CommandGroup>
              <div className='flex items-center justify-between p-2'>
                <button
                  className='disabled:opacity-50'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta?.isFirstPage}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className='text-sm'>{meta?.currentPage ?? page}</span>
                <button
                  className='disabled:opacity-50'
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta?.isLastPage}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
