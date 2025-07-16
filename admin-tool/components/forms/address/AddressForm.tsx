'use client';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import LocationSelector from '@/components/ui/location-input';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { withMask } from 'use-mask-input';
import { createAddress } from '@/lib/actions/address.actions';
import { Loader2Icon, MapPinHouse } from 'lucide-react';
import React from 'react';
import CustomeToast from '../../helpers/toasts/CustomeErrorToast';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  name_5020537749: z.tuple([z.string(), z.string().optional()]),
});

export default function AddressForm() {
  const t = useTranslations('Dashboard.Ressource.Address');

  const [formState, action, isPending] = useActionState(createAddress, {
    success: false,
    errors: {
      title: [],
    },
  });

  const [_countryName, setCountryName] = useState<string>('');
  const [stateName, setStateName] = useState<string>('');

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Address created successfully'
        />
      ));
    }
  }, [formState.success]);

  React.useEffect(() => {
    if (
      formState.errors &&
      Object.keys(formState.errors).length > 0 &&
      formState.errors.title.length > 0
    ) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred ${formState.errors?.title}`}
        />
      ));
    }
  }, [formState.errors]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Card className='shadow-md p-6 min-w-full'>
      <Form {...form}>
        <form action={action} className='space-y-8 max-w-3xl mx-auto py-2'>
          <FormField
            control={form.control}
            name='name_5020537749'
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>{t('Attributes.country')}</FormLabel>
                <FormControl>
                  <LocationSelector
                    onCountryChange={(country) => {
                      setCountryName(country?.name || '');
                      form.setValue(field.name, [
                        country?.name || '',
                        stateName || '',
                      ]);
                    }}
                    onStateChange={(state) => {
                      setStateName(state?.name || '');
                      form.setValue(field.name, [
                        form.getValues(field.name)[0] || '',
                        state?.name || '',
                      ]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label htmlFor='city'>
              {t('Attributes.city')}
              <span className='text-red-500'>*</span>
            </Label>
            <Input id='city' name='city' placeholder='Stubenberg' required />
          </div>

          <div>
            <Label htmlFor='postCode'>
              {t('Attributes.postCode')}
              <span className='text-red-500'>*</span>
            </Label>
            <Input id='postCode' name='postCode' placeholder='8223' required />
          </div>
          <div>
            <Label htmlFor='streetName'>
              {t('Attributes.streetName')}
              <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='streetName'
              name='streetName'
              placeholder='Hauptstraße'
              required
            />
          </div>
          <div>
            <Label htmlFor='streetNumber'>
              {t('Attributes.streetNumber')}
              <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='streetNumber'
              name='streetNumber'
              placeholder='123'
              ref={withMask('99999', {
                placeholder: '',
                showMaskOnHover: false,
              })}
              required
            />
          </div>

          <Button type='submit'>
            {isPending ? (
              <>
                <Loader2Icon />
                {t('buttons.addLoading')}
              </>
            ) : (
              <>
                <MapPinHouse />
                {t('buttons.add')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
