import { useId, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserTier, UserTierPricing } from '@/lib/types';

export default function RadioGroupComponentUserTiers() {
  const id = useId();
  const [userTier, setUserTier] = useState(UserTier.TEAM);

  const items = [
    {
      value: UserTier.CORE,
      label: UserTier.CORE.toLocaleUpperCase(),
      price: `€${UserTierPricing.CORE}/month`,
    },
    {
      value: UserTier.TEAM,
      label: UserTier.TEAM.toLocaleUpperCase(),
      price: `  €${UserTierPricing.TEAM}/month`,
    },
    {
      value: UserTier.PRO,
      label: UserTier.PRO.toLocaleUpperCase(),
      price: `€${UserTierPricing.PRO}/month`,
    },
    {
      value: UserTier.ENTERPRISE,
      label: UserTier.ENTERPRISE.toLocaleUpperCase(),
      price: `€${UserTierPricing.ENTERPRISE}/month`,
    },
  ];

  return (
    <fieldset className='space-y-4'>
      <div className='mb-2'>
        <h2 className='text-lg font-semibold text-foreground'>
          Teamgröße wählen
        </h2>
        <p className='text-sm text-muted-foreground'>
          Wähle, wie viele Nutzer deine OrderLink-Instanz nutzen sollen.
        </p>
      </div>
      <RadioGroup
        className='gap-0 -space-y-px rounded-md shadow-xs'
        defaultValue={UserTier.TEAM}
        onValueChange={(value) => setUserTier(value as UserTier)}
      >
        {items.map((item) => (
          <div
            key={`${id}-${item.value}`}
            className='border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <RadioGroupItem
                  id={`${id}-${item.value}`}
                  value={item.value}
                  className='after:absolute after:inset-0'
                  aria-describedby={`${`${id}-${item.value}`}-price`}
                />
                <Label
                  className='inline-flex items-start text-base font-medium'
                  htmlFor={`${id}-${item.value}`}
                >
                  {item.label}
                  {item.value === UserTier.TEAM && (
                    <Badge className='ms-2 -mt-1'>Beliebt</Badge>
                  )}
                </Label>
              </div>
              <div
                id={`${`${id}-${item.value}`}-price`}
                className='text-sm text-muted-foreground leading-[inherit]'
              >
                {item.price}
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
      <input type='hidden' name='userTier' value={userTier} />
    </fieldset>
  );
}
