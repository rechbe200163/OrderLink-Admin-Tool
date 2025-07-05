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
import { Address } from '@prisma/client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AddressSelectComponent({
  addresses,
  onAddressSelect, // Callback function passed from parent
  defaultValue,
}: {
  addresses: Address[];
  onAddressSelect: (addressId: string) => void; // Callback type definition
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

  const selectedAddress = addresses.find(
    (address) => address.addressId === value
  );

  const t = useTranslations('SelectComponents.Address');
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{t('selectAddress')}</Label>
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
              {selectedAddress
                ? `${selectedAddress.streetNumber} ${selectedAddress.streetName}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postCode}, ${selectedAddress.country}`
                : t('selectAddress')}
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
            <CommandInput placeholder={t('findAddress')} />
            <CommandList>
              <CommandEmpty>{t('noAddressFound')}</CommandEmpty>
              <CommandGroup>
                {addresses.map((address) => (
                  <CommandItem
                    key={address.addressId}
                    value={address.addressId}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      onAddressSelect(currentValue); // Update parent on selection
                      setOpen(false);
                    }}
                  >
                    {`${address.streetNumber} ${address.streetName}, ${address.city}, ${address.state} ${address.postCode}, ${address.country}`}
                    {value === address.addressId && (
                      <Check size={16} strokeWidth={2} className='ml-auto' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className='sticky bottom-0 bg-background'>
                  <Link
                    href='/addresses/add'
                    className='flex w-full items-center justify-start p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
                  >
                    <Plus
                      size={16}
                      strokeWidth={2}
                      className='mr-2 opacity-60'
                      aria-hidden='true'
                    />
                    {t('addNewAddress')}
                  </Link>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
