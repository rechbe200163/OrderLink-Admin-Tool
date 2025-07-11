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
import { Product } from '@/lib/types';
import { useTranslations } from 'next-intl';

export default function ProductSelectComponent({
  products,
  onProductSelect,
  defaultValue = [],
}: {
  products: Product[];
  onProductSelect: (productId: string) => void;
  defaultValue?: string[];
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  // Update selected values when defaultValue changes
  useEffect(() => {
    if (defaultValue.length > 0) {
      setSelectedValues(defaultValue);
    }
  }, [defaultValue]);

  const handleSelect = (productId: string) => {
    if (selectedValues.includes(productId)) {
      setSelectedValues(selectedValues.filter((id) => id !== productId));
      onProductSelect(productId); // You can pass the updated value to the parent if needed
    } else {
      setSelectedValues([...selectedValues, productId]);
      onProductSelect(productId); // You can pass the updated value to the parent if needed
    }
  };

  const t = useTranslations('SelectComponents.Product');
  return (
    <div className='space-y-2 min-w-full'>
      <Label htmlFor={id}>{t('selectProducts')}</Label>
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
                ? selectedValues
                    .map((id) => {
                      const product = products.find((p) => p.productId === id);
                      return product
                        ? `${product.name} - $${(product.price / 100).toFixed(
                            2
                          )}`
                        : '';
                    })
                    .join(', ')
                : 'Select product'}
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
            <CommandInput placeholder={t('findProduct')} />
            <CommandList className='max-h-[300px] overflow-y-auto'>
              <CommandEmpty>{t('noProductFound')}</CommandEmpty>
              <CommandGroup>
                {products.map((product) => (
                  <CommandItem
                    key={product.productId}
                    value={product.productId}
                    onSelect={() => handleSelect(product.productId)}
                  >
                    {`${product.name} - $${(product.price / 100).toFixed(2)}`}
                    {selectedValues.includes(product.productId) && (
                      <Check size={16} strokeWidth={2} className='ml-auto' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </CommandList>
            {/* Sticky Add New Product Link */}
            <div className='sticky bottom-0 bg-background'>
              <CommandGroup>
                <Link
                  href='/products/add'
                  className='flex w-full items-center justify-start p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
                >
                  <Plus
                    size={16}
                    strokeWidth={2}
                    className='mr-2 opacity-60'
                    aria-hidden='true'
                  />
                  {t('addNewProduct')}
                </Link>
              </CommandGroup>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
