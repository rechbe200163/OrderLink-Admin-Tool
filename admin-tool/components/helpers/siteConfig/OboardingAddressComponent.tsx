'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { createSiteConfig } from '@/lib/actions/siteConfig.actions';
import CustomeToast from '@/components/helpers/toasts/CustomeErrorToast';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AddressSelectComponent from '@/components/helpers/AddressSelectComponent';
import GenericInputMaskComponent from '@/components/InputWithMask';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import LocationSelector from '@/components/ui/location-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { withMask } from 'use-mask-input';

const steps = [
  { id: 1, title: 'Basic Info', key: '2.1' },
  { id: 2, title: 'Financial Details', key: '2.2' },
  { id: 3, title: 'Address Selection', key: '2.3' },
];
const formSchema = z.object({
  name_5020537749: z.tuple([z.string(), z.string().optional()]),
});

export default function OboardingAddressComponent() {
  const [_countryName, setCountryName] = useState<string>('');
  const [stateName, setStateName] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name='name_5020537749'
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className='text-primary-foreground'>
                Select Country
              </FormLabel>
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
              <FormDescription className='text-primary-foreground'>
                If your country has states, it will be appear after selecting
                country
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Label
            htmlFor='city'
            className='
          text-primary-foreground
          '
          >
            City
          </Label>
          <Input id='city' name='city' placeholder='Stubenberg' required />
        </div>

        <div>
          <Label htmlFor='postCode' className='text-primary-foreground'>
            Post Code
          </Label>
          <Input id='postCode' name='postCode' placeholder='8223' required />
        </div>
        <div>
          <Label htmlFor='streetName' className='text-primary-foreground'>
            Street Name
          </Label>
          <Input
            id='streetName'
            name='streetName'
            placeholder='Hauptstraße'
            required
          />
        </div>
        <div>
          <Label htmlFor='streetNumber' className='text-primary-foreground'>
            Street Number
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
      </form>
    </Form>
  );
}
