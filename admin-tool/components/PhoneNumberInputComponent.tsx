'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon, PhoneIcon } from 'lucide-react';
import React, { useId, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { parsePhoneNumber } from 'libphonenumber-js';
import { useCustomerStore } from '@/lib/stores/useCustomerStore';

interface PhoneNumberInputProps {
  defaultValue?: string;
}

export default function PhoneNumberInputComponent({
  defaultValue = '',
}: PhoneNumberInputProps) {
  const id = useId();
  const t = useTranslations('Components.PhoneInput');
  const setPhoneNumber = useCustomerStore((s) => s.setPhoneNumber);
  const storeNumber = useCustomerStore((s) => s.customer.phoneNumber);

  // WICHTIG: undefined statt '' verwenden
  const [value, setValue] = useState<string | undefined>(
    storeNumber || defaultValue || undefined
  );
  const [country, setCountry] = useState<RPNInput.Country>('US');

  // Initiales Normalisieren ohne Throw
  useEffect(() => {
    const initial = storeNumber ?? defaultValue ?? '';
    if (!initial) return;

    try {
      const parsed = parsePhoneNumber(initial);
      if (parsed) {
        setValue(parsed.number); // E.164
        if (parsed.country) setCountry(parsed.country as RPNInput.Country);
        return;
      }
    } catch {
      // still fallback – keine Exception werfen
    }
    // Fallback: Whitespace entfernen
    setValue(initial.replace(/\s+/g, '') || undefined);
  }, [defaultValue, storeNumber]);

  // In Store spiegeln
  useEffect(() => {
    setPhoneNumber(value ?? '');
  }, [value, setPhoneNumber]);

  // Props für defaultCountry nur geben, wenn kein Wert gesetzt
  const defaultCountryProp = value
    ? {}
    : ({ defaultCountry: country } as { defaultCountry: RPNInput.Country });

  return (
    <div className='not-first:*:mt-2' dir='ltr'>
      <Label htmlFor={id}>{t('label')}</Label>

      <RPNInput.default
        id={id}
        name='phoneNumber'
        placeholder={t('placeholder')}
        className='flex rounded-md shadow-2xs'
        international
        // Wichtig: eigenes Input, aber kein type erzwingen – lib setzt selbst
        inputComponent={PhoneInput}
        flagComponent={FlagComponent}
        countrySelectComponent={(props) => (
          <CountrySelect {...props} value={country} onChange={setCountry} />
        )}
        // value als string | undefined, niemals ''
        value={value}
        onChange={(v) => setValue(v ?? undefined)}
        {...defaultCountryProp}
      />
    </div>
  );
}

const PhoneInput = ({ className, ...props }: React.ComponentProps<'input'>) => {
  return (
    <Input
      data-slot='phone-input'
      // kein type='tel' erzwingen; manche Autofill-Skripte buggen dann weniger
      className={cn(
        '-ms-px rounded-s-none shadow-none focus-visible:z-10',
        className
      )}
      {...props}
    />
  );
};
PhoneInput.displayName = 'PhoneInput';

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const t = useTranslations('Components.PhoneInput');

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  return (
    <div className='border-input bg-background text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 hover:bg-accent hover:text-foreground has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 relative inline-flex items-center self-stretch rounded-s-md border py-2 ps-3 pe-2 transition-[color,box-shadow] outline-hidden focus-within:z-10 focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50'>
      <div className='inline-flex items-center gap-1' aria-hidden='true'>
        <FlagComponent country={value} countryName={value} aria-hidden='true' />
        <span className='text-muted-foreground/80'>
          <ChevronDownIcon size={16} aria-hidden='true' />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className='absolute inset-0 text-sm opacity-0'
        aria-label={t('selectCountry')}
      >
        <option key='default' value=''>
          {t('selectCountryPlaceholder')}
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label}{' '}
              {option.value &&
                `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className='w-5 overflow-hidden rounded-sm'>
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <PhoneIcon size={16} aria-hidden='true' />
      )}
    </span>
  );
};
