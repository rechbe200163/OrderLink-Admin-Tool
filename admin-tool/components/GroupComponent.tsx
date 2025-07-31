import { useId } from 'react';
import { AreaChartIcon as ChartArea, Key, Route } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Package } from '@/lib/types';

export default function GroupComponent() {
  const id = useId();

  const items = [
    {
      value: Package.CUSTOM_ROLES,
      label: Package.CUSTOM_ROLES,
      Icon: Key,
      description: 'Manage user permissions',
    },
    {
      value: Package.NAVIGATION,
      label: Package.NAVIGATION,
      Icon: Route,
      description: 'Configure app routing',
    },
    {
      value: Package.STATISTICS,
      label: Package.STATISTICS,
      Icon: ChartArea,
      description: 'View analytics data',
    },
  ];

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-semibold tracking-tight'>
        Wähle deine Module
      </h2>
      <p className='text-base text-muted-foreground'>
        Du kannst mehrere Module kombinieren, je nach Bedarf.
      </p>

      <ToggleGroup
        type='multiple'
        variant='outline'
        className='grid grid-cols-1 sm:grid-cols-3 gap-4'
        aria-label='OrderLink Module'
      >
        {items.map((item) => (
          <ToggleGroupItem
            key={`${id}-${item.value}`}
            value={item.value}
            className='group flex flex-col justify-between border-2 p-5 h-auto min-h-[120px] rounded-lg text-left hover:border-primary/50 data-[state=on]:border-primary data-[state=on]:bg-accent'
          >
            <div className='flex items-center gap-3 mb-2'>
              <item.Icon
                size={20}
                className='text-muted-foreground group-data-[state=on]:text-primary'
              />
              <Label className='text-base font-medium group-data-[state=on]:text-foreground'>
                {item.label}
              </Label>
            </div>
            <p className='text-sm text-muted-foreground'>{item.description}</p>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <p className='text-xs text-center text-muted-foreground pt-4'>
        Module sind jederzeit erweiterbar.
      </p>
    </div>
  );
}
