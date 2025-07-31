import { useId } from 'react';
import {
  Brush,
  ChartArea,
  Eraser,
  Key,
  Route,
  Scissors,
  SwatchBook,
} from 'lucide-react';

import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Package } from '@/lib/types';

export default function GroupComponent() {
  const id = useId();

  const items = [
    { value: Package.CUSTOM_ROLES, label: Package.CUSTOM_ROLES, Icon: Key },
    { value: Package.NAVIGATION, label: Package.NAVIGATION, Icon: Route },
    { value: Package.STATISTICS, label: Package.STATISTICS, Icon: ChartArea },
  ];

  return (
    <ToggleGroup
      type='multiple'
      variant='outline'
      className='grid grid-cols-2 gap-2'
      aria-label='Packages'
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={`${id}-${item.value}`}
          value={item.value}
          className='flex flex-col items-start gap-4 p-4'
        >
          <div className='flex w-full justify-between gap-2'>
            <span className='sr-only'>{item.label}</span>
            <item.Icon className='opacity-60' size={16} aria-hidden='true' />
          </div>
          <Label>{item.label}</Label>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
