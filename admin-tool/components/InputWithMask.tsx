'use client';

import { Input } from '@/components/ui/input';
import { useId, useRef } from 'react';
import { useEffect } from 'react';

type Props = {
  placeholder: string;
  mask?: string;
  onlyUppercase?: boolean;
  name?: string;
  disabled?: boolean;
};

export default function GenericInputMaskComponent({
  placeholder,
  mask,
  onlyUppercase = false,
  name = 'maskInput',
  disabled = false,
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mask && inputRef.current) {
      // Masking is length-bound — don't use if onlyUppercase without length constraint is needed
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const masked = require('use-mask-input').withMask(mask, {
        placeholder: '',
        showMaskOnHover: false,
      });
      masked(inputRef.current);
    }
  }, [mask]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onlyUppercase && !mask) {
      e.target.value = e.target.value.replace(/[^A-Z]/g, '').toUpperCase();
    }
  };

  return (
    <Input
      id={id}
      ref={inputRef}
      placeholder={placeholder}
      type='text'
      name={name}
      disabled={disabled}
      onChange={handleInput}
      className='col-span-3 p-2 border rounded-lg'
    />
  );
}
