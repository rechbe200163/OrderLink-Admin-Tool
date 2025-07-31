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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Package } from '@/lib/types';

export default function GroupComponent() {
  const id = useId();

  const items = [
    { value: Package.CUSTOM_ROLES, label: Package.CUSTOM_ROLES, Icon: Key },
    { value: Package.NAVIGATION, label: Package.NAVIGATION, Icon: Route },
    { value: Package.STATISTICS, label: Package.STATISTICS, Icon: ChartArea },
  ];

  return (
    <RadioGroup className='grid-cols-2' defaultValue='1'>
      {items.map((item) => (
        <div
          key={`${id}-${item.value}`}
          className='border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none'
        >
          <div className='flex justify-between gap-2'>
            <RadioGroupItem
              id={`${id}-${item.value}`}
              value={item.value}
              className='order-1 after:absolute after:inset-0'
            />
            <item.Icon className='opacity-60' size={16} aria-hidden='true' />
          </div>
          <Label htmlFor={`${id}-${item.value}`}>{item.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
