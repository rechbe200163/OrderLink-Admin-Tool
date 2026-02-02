'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import LocationSelector from '@/components/ui/location-input';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { withMask } from 'use-mask-input';
import { createAddress } from '@/lib/actions/address.actions';
import { MapPinHouse } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAddressStore } from '@/lib/stores/useAddressStore';
import { GenericDialogForm } from '@/components/forms/generic';

const formSchema = z.object({
  name_5020537749: z.tuple([z.string(), z.string().optional()]),
});

export default function AddAddressDialog() {
  const t = useTranslations('Dashboard.Ressource.Address');

  const setCountry = useAddressStore((s) => s.setCountry);
  const setStateStore = useAddressStore((s) => s.setState);
  const setCity = useAddressStore((s) => s.setCity);
  const setPostCode = useAddressStore((s) => s.setPostCode);
  const setStreetName = useAddressStore((s) => s.setStreetName);
  const setStreetNumber = useAddressStore((s) => s.setStreetNumber);

  const country = useAddressStore((s) => s.address.country);
  const stateStore = useAddressStore((s) => s.address.state);
  const city = useAddressStore((s) => s.address.city);
  const postCode = useAddressStore((s) => s.address.postCode);
  const streetName = useAddressStore((s) => s.address.streetName);
  const streetNumber = useAddressStore((s) => s.address.streetNumber);

  const [_countryName, setCountryName] = useState<string>(country);
  const [stateName, setStateName] = useState<string>(stateStore);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Hydrate the store on mount to prevent SSR hydration issues
  useEffect(() => {
    useAddressStore.persist.rehydrate();
  }, []);

  return (
    <GenericDialogForm
      triggerButtonText={t('add')}
      triggerButtonIcon={<MapPinHouse className='h-4 w-4' />}
      dialogTitle={t('add')}
      dialogDescription={t('dialogDescription')}
      serverAction={createAddress}
      submitButtonText={t('buttons.add')}
      submitButtonPendingText={t('buttons.add')}
      formClassName='space-y-4 max-h-[60vh] overflow-y-auto'
    >
      {(formState, isPending) => (
        <Form {...form}>
          <div className='space-y-4'>
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

            <div className='space-y-2'>
              <Label htmlFor='city'>
                {t('Attributes.city')}
                <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='city'
                name='city'
                placeholder={t('Placeholder.city')}
                required
                defaultValue={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='postCode'>
                {t('Attributes.postCode')}
                <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='postCode'
                name='postCode'
                placeholder={t('Placeholder.postCode')}
                required
                defaultValue={postCode}
                onChange={(e) => setPostCode(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='streetName'>
                {t('Attributes.streetName')}
                <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='streetName'
                name='streetName'
                placeholder={t('Placeholder.streetName')}
                required
                defaultValue={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='streetNumber'>
                {t('Attributes.streetNumber')}
                <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='streetNumber'
                name='streetNumber'
                placeholder={t('Placeholder.streetNumber')}
                ref={withMask('99999', {
                  placeholder: '',
                  showMaskOnHover: false,
                })}
                required
                defaultValue={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
        </Form>
      )}
    </GenericDialogForm>
  );
}
