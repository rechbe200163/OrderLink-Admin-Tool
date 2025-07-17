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
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { useId, useState, useEffect } from 'react';
import { Actions } from '@/lib/types';
import { useTranslations } from 'next-intl';

export default function ActionsSelectComponent({
  onActionSelect,
  defaultValue = [],
}: {
  onActionSelect: (action: string) => void;
  defaultValue?: string[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  useEffect(() => {
    setSelectedValues(defaultValue);
  }, [defaultValue]);

  const t = useTranslations('SelectComponents.Actions');

  const handleSelect = (action: string) => {
    if (selectedValues.includes(action)) {
      setSelectedValues(selectedValues.filter((a) => a !== action));
    } else {
      setSelectedValues([...selectedValues, action]);
    }
    onActionSelect(action);
  };

  return (
    <div className='space-y-2 min-w-full'>
      <Label htmlFor={id}>{t('selectActions')}</Label>
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
                ? selectedValues.join(', ')
                : t('selectActions')}
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
            <CommandInput placeholder={t('findAction')} />
            <CommandList className='max-h-[300px] overflow-y-auto'>
              <CommandEmpty>{t('noActionFound')}</CommandEmpty>
              <CommandGroup>
                {Object.values(Actions).map((action) => {
                  const label = action;
                  return (
                    <CommandItem
                      key={action}
                      value={label}
                      onSelect={() => handleSelect(action)}
                    >
                      {label}
                      {selectedValues.includes(action) && (
                        <Check size={16} strokeWidth={2} className='ml-auto' />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

