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
import { Category } from '@prisma/client';
import { ButtonLinkComponent } from '@/components/ButtonLinkComponent';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SelectCategoryComponent({
  categories,
  onCategorySelect, // Callback function passed from parent
  defaultValues = [],
}: {
  categories: Category[];
  onCategorySelect: (categoryIds: string[]) => void; // Callback type definition
  defaultValues?: string[];
}) {
  const t = useTranslations('SelectComponents.category');
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [values, setValues] = useState<string[]>(defaultValues);

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  const selectedCategories = categories.filter((category) =>
    values.includes(category.categoryId)
  );

  const handleSelect = (categoryId: string) => {
    const newValues = values.includes(categoryId)
      ? values.filter((id) => id !== categoryId)
      : [...values, categoryId];
    setValues(newValues);
    onCategorySelect(newValues); // Update parent on selection
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{t('selectedCategories')}</Label>
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
                values.length === 0 && 'text-muted-foreground'
              )}
            >
              {selectedCategories.length > 0
                ? selectedCategories.map((category) => category.name).join(', ')
                : 'Select Categories'}
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
            <CommandInput placeholder={t('findCategory')} />
            <CommandList>
              <CommandEmpty>{t('noCategoryFound')}</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.categoryId}
                    value={category.categoryId}
                    onSelect={() => handleSelect(category.categoryId)}
                  >
                    {`${category.name}`}
                    {values.includes(category.categoryId) && (
                      <Check size={16} strokeWidth={2} className='ml-auto' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Link
                  href='/categories/add'
                  className='flex w-full items-center justify-start p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
                >
                  <Plus
                    size={16}
                    strokeWidth={2}
                    className='mr-2 opacity-60'
                    aria-hidden='true'
                  />
                  {t('addNewCategory')}
                </Link>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
