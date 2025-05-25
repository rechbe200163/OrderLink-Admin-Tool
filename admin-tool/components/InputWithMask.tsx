'use client';

import { Input } from '@/components/ui/input';
import { useId } from 'react';
import { withMask } from 'use-mask-input';

export default function GenericInputMaskComponent({
  placeholder,
  mask,
}: {
  placeholder: string;
  mask: string;
}) {
  const id = useId();
  return (
    <Input
      id={id}
      placeholder={placeholder}
      type='text'
      name='maskInput'
      ref={withMask(mask, {
        placeholder: '',
        showMaskOnHover: false,
      })}
      className='col-span-3 p-2 border rounded-lg'
    />
  );
}
