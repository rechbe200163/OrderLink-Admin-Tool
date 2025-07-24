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
import { updateAddress } from '@/lib/actions/address.actions';
import { MapPinHouse } from 'lucide-react';
import React from 'react';
import CustomeToast from '../../helpers/toasts/CustomeErrorToast';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Address } from '@/lib/types';
import { GenericLoading } from '@/components/loading-states/loading';
import LoadingIcon from '@/components/loading-states/loading-icon';

const formSchema = z.object({
  name_5020537749: z.tuple([z.string(), z.string().optional()]),
});

export default function EditAddressForm({ address }: { address: Address }) {
  const t = useTranslations('Dashboard.Ressource.Address');

  const router = useRouter();

  const [formState, action, isPending] = useActionState(
    updateAddress.bind(null, address.addressId, address),
    {
      success: false,
      errors: {
        title: [],
      },
    }
  );

  const [_countryName, setCountryName] = useState<string>(address.country);
  const [stateName, setStateName] = useState<string>(address.state);

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Address created successfully'
        />
      ));
      if (formState.data) {
        router.push(`/addresses/${formState.data}/edit`);
      }
    }
  }, [formState, router]);

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
                    defaultCountry={address.country}
                    defaultState={address.state}
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
            <Label htmlFor='city'>{t('Attributes.city')}</Label>
            <Input
              id='city'
              name='city'
              placeholder='Stubenberg'
              required
              defaultValue={address.city}
            />
          </div>

          <div>
            <Label htmlFor='postCode'>{t('Attributes.postCode')}</Label>
            <Input
              id='postCode'
              name='postCode'
              placeholder='8223'
              required
              defaultValue={address.postCode}
            />
          </div>
          <div>
            <Label htmlFor='streetName'>{t('Attributes.streetName')}</Label>
            <Input
              id='streetName'
              name='streetName'
              placeholder='Hauptstraße'
              required
              defaultValue={address.streetName}
            />
          </div>
          <div>
            <Label htmlFor='streetNumber'>{t('Attributes.streetNumber')}</Label>
            <Input
              id='streetNumber'
              name='streetNumber'
              placeholder=''
              ref={withMask('99999', {
                placeholder: '',
                showMaskOnHover: false,
              })}
              required
              defaultValue={address.streetNumber}
            />
          </div>
          <Button type='submit'>
            {isPending ? (
              <>
                <LoadingIcon />
                <GenericLoading text={t('buttons.updateLoading')} />
              </>
            ) : (
              <>
                <MapPinHouse />
                {t('buttons.update')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
