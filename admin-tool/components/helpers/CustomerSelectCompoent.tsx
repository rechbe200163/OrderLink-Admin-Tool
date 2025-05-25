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
import { Check, ChevronDown, Plus } from 'lucide-react';
import { useId, useState, useEffect } from 'react';
import Link from 'next/link';
import { Customer } from '@prisma/client';
import { useTranslations } from 'next-intl';

export default function CustomerSelectComponent({
  customers,
  onCustomerSelect,
  defaultValue,
}: {
  customers: Customer[];
  onCustomerSelect: (customerReference: string) => void;
  defaultValue?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(defaultValue || '');

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

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
          className='w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0'
          align='start'
        >
          <Command>
            <CommandInput placeholder={t('findCustomer')} />
            <CommandList>
              <CommandEmpty>{t('noCustomerFound')}</CommandEmpty>
              <CommandGroup>
                {customers.map((customer) => (
                  <CommandItem
                    key={customer.customerReference}
                    value={String(customer.customerReference)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      onCustomerSelect(currentValue);
                      setOpen(false);
                    }}
                  >
                    {`${customer.firstName ?? ''} ${customer.lastName} (${
                      customer.email
                    })`}
                    {value === String(customer.customerReference) && (
                      <Check size={16} strokeWidth={2} className='ml-auto' />
                    )}
                  </CommandItem>
                ))}
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
