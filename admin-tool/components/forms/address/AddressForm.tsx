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
import { MapPinHouse } from 'lucide-react';
import React from 'react';
import CustomeToast from '../../helpers/toasts/CustomeErrorToast';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { GenericLoading } from '@/components/loading-states/loading';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { useAddressStore } from '@/lib/stores/useAddressStore';

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

  const setCountry = useAddressStore((s) => s.setCountry);
  const setStateStore = useAddressStore((s) => s.setState);
  const setCity = useAddressStore((s) => s.setCity);
  const setPostCode = useAddressStore((s) => s.setPostCode);
  const setStreetName = useAddressStore((s) => s.setStreetName);
  const setStreetNumber = useAddressStore((s) => s.setStreetNumber);
  const reset = useAddressStore((s) => s.reset);

  const country = useAddressStore((s) => s.address.country);
  const stateStore = useAddressStore((s) => s.address.state);
  const city = useAddressStore((s) => s.address.city);
  const postCode = useAddressStore((s) => s.address.postCode);
  const streetName = useAddressStore((s) => s.address.streetName);
  const streetNumber = useAddressStore((s) => s.address.streetNumber);

  const [_countryName, setCountryName] = useState<string>(country);
  const [stateName, setStateName] = useState<string>(stateStore);

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Address created successfully'
        />
      ));
      reset();
    }
  }, [formState.success, reset]);

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
                      const name = country?.name || '';
                      setCountryName(name);
                      setCountry(name);
                      form.setValue(field.name, [name, stateName || '']);
                    }}
                    onStateChange={(state) => {
                      const name = state?.name || '';
                      setStateName(name);
                      setStateStore(name);
                      form.setValue(field.name, [
                        form.getValues(field.name)[0] || '',
                        name,
                      ]);
                    }}
                    defaultCountry={country}
                    defaultState={stateStore}
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
            <Input
              id='city'
              name='city'
              placeholder='Stubenberg'
              required
              defaultValue={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor='postCode'>
              {t('Attributes.postCode')}
              <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='postCode'
              name='postCode'
              placeholder='8223'
              required
              defaultValue={postCode}
              onChange={(e) => setPostCode(e.target.value)}
            />
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
              defaultValue={streetName}
              onChange={(e) => setStreetName(e.target.value)}
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
              defaultValue={streetNumber}
              onChange={(e) => setStreetNumber(e.target.value)}
            />
          </div>

          <Button type='submit'>
            {isPending ? (
              <>
                <LoadingIcon />
                {t('buttons.add')}
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
