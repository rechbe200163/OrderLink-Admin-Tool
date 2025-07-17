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
import { Check, ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useId, useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Customer } from '@/lib/types';
import { PagingMeta } from '@/lib/dtos';

export default function CustomerSelectComponent({
  onCustomerSelect,
  defaultValue,
}: {
  onCustomerSelect: (customerReference: string) => void;
  defaultValue?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(defaultValue || '');
  const [page, setPage] = useState<number>(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<PagingMeta | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: '10',
    });
    if (search) params.append('query', search);

    fetch(`/api/customers/paging?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.data);
        setMeta(data.meta);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [page, search]);

  const selectedCustomer = customers.find(
    (customer) => String(customer.customerReference) === value
  );
  const t = useTranslations('SelectComponents.Customer');
  return (
    <div className='space-y-2 min-w-full'>
      <Label htmlFor={id}>{t('selectCustomer')}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between bg-background px-3 font-normal outline-offset-0 focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20'
          >
            <span className={cn('truncate', !value && 'text-muted-foreground')}>
              {selectedCustomer
                ? `${selectedCustomer.firstName ?? ''} ${
                    selectedCustomer.lastName
                  } (${selectedCustomer.email})`
                : t('selectCustomer')}
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
              placeholder={t('findCustomer')}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{t('noCustomerFound')}</CommandEmpty>
              <CommandGroup>
                {customers.map((customer) => {
                  const label = `${customer.firstName ?? ''} ${customer.lastName} (${customer.email})`;
                  return (
                    <CommandItem
                      key={customer.customerReference}
                      value={label}
                      onSelect={() => {
                        setValue(String(customer.customerReference));
                        onCustomerSelect(String(customer.customerReference));
                        setOpen(false);
                      }}
                    >
                      {label}
                      {value === String(customer.customerReference) && (
                        <Check size={16} strokeWidth={2} className='ml-auto' />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Link
                  href='/customer/add'
                  className='flex w-full items-center justify-start p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
                >
                  <Plus
                    size={16}
                    strokeWidth={2}
                    className='mr-2 opacity-60'
                    aria-hidden='true'
                  />
                  {t('addNewCustomer')}
                </Link>
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
