import { useId, useState } from 'react';
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
  const [packages, setPackages] = useState<string[]>([]);

  const items = [
    {
      value: Package.CUSTOM_ROLES,
      label: Package.CUSTOM_ROLES.toLocaleUpperCase(),
      Icon: Key,
      description: 'Flexible Rollen & Berechtigungen für dein Team',
    },
    {
      value: Package.NAVIGATION,
      label: Package.NAVIGATION.toLocaleUpperCase(),
      Icon: Route,
      description: 'Liefer­routen einfach planen und zuweisen',
    },
    {
      value: Package.STATISTICS,
      label: Package.STATISTICS.toLocaleUpperCase(),
      Icon: ChartArea,
      description: 'Kennzahlen visualisieren und Leistung verfolgen',
    },
  ];

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-foreground'>
          Funktionen auswählen
        </h2>
        <p className='text-sm text-muted-foreground'>
          Wähle die Module, die du in deinem OrderLink-Paket aktivieren
          möchtest.
        </p>
      </div>

      <ToggleGroup
        type='multiple'
        variant='outline'
        className='grid grid-cols-1 sm:grid-cols-2 gap-4'
        aria-label='Packages'
        onValueChange={(value) => setPackages(value as string[])}
      >
        {items.map((item) => (
          <ToggleGroupItem
            key={`${id}-${item.value}`}
            value={item.value}
            className='group relative flex flex-col items-start gap-3 p-5 h-auto min-h-[120px] border-2 border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:shadow-md rounded-md'
          >
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-muted group-hover:bg-accent group-data-[state=on]:bg-primary/10 transition-colors duration-200'>
                <item.Icon
                  className='text-muted-foreground group-hover:text-accent-foreground group-data-[state=on]:text-primary transition-colors duration-200'
                  size={20}
                  aria-hidden='true'
                />
              </div>
              <div className='opacity-0 group-data-[state=on]:opacity-100 transition-opacity duration-200'>
                <div className='w-2 h-2 rounded-full bg-primary' />
              </div>
            </div>
            <div className='flex items-start flex-col gap-1 w-full'>
              <Label className='text-base font-medium text-foreground group-hover:text-foreground group-data-[state=on]:text-foreground transition-colors duration-200 cursor-pointer'>
                {item.label}
              </Label>
              <p className='text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors duration-200'>
                {item.description}
              </p>
            </div>
            <span className='sr-only'>{item.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {packages.map((pkg) => (
        <input
          key={`${id}-hidden-${pkg}`}
          type='hidden'
          name='packages'
          value={pkg}
        />
      ))}

      <div className='mt-6 text-center'>
        <p className='text-xs text-muted-foreground'>
          Du kannst mehrere Module gleichzeitig aktivieren.
        </p>
      </div>
    </div>
  );
}
