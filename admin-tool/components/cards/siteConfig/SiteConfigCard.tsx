'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { updateSiteConfig } from '@/lib/actions/siteConfig.actions';
import React from 'react';
import CustomeToast from '@/components/helpers/toasts/CustomeErrorToast';
import { toast } from 'sonner';
import AddressSelectComponent from '@/components/helpers/AddressSelectComponent';
import GenericInputMaskComponent from '@/components/InputWithMask';
import { useRouter } from 'next/navigation';
import { SiteConfigDto } from '@/lib/types';

export default function SiteConfigCard({
  siteConfig,
}: {
  siteConfig: SiteConfigDto;
}) {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = React.useState<string>(
    siteConfig.address.addressId || ''
  );

  const [formState, action, isPending] = useActionState(
    updateSiteConfig.bind(null, siteConfig.siteConfigId, siteConfig),
    {
      success: false,
      errors: {
        title: [],
      },
    }
  );

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Site configuration updated successfully!'
        />
      ));
      if (formState.data) {
        router.push(`/settings/${formState.data}/edit`);
      }
    }
  }, [formState, router]);

  React.useEffect(() => {
    if (formState.errors?.title?.length) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred: ${
            formState.errors?.title?.join(', ') ?? ''
          }`}
        />
      ));
    }
  }, [formState.errors]);

  return (
    <Card className='w-full max-w-2xl mx-auto p-6 shadow-lg rounded-2xl'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold flex justify-between items-center'>
          {siteConfig.companyName}
          <div className='flex items-center gap-3'>
            {siteConfig.isPremium && <Badge variant='success'>Premium</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className='space-y-6'>
          <div className='grid gap-5'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='companyName'
                className='text-right text-sm font-medium'
              >
                Company Name
              </Label>
              <Input
                id='companyName'
                name='companyName'
                defaultValue={siteConfig.companyName}
                className='col-span-3 p-2 border rounded-lg'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right text-sm font-medium'>
                Email
              </Label>
              <Input
                id='email'
                name='email'
                defaultValue={siteConfig.email}
                className='col-span-3 p-2 border rounded-lg'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='phoneNumber'
                className='text-right text-sm font-medium'
              >
                Phone
              </Label>
              <Input
                id='phoneNumber'
                name='phoneNumber'
                defaultValue={siteConfig.phoneNumber}
                className='col-span-3 p-2 border rounded-lg'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='iban' className='text-right text-sm font-medium'>
                IBAN
              </Label>
              <GenericInputMaskComponent
                placeholder={siteConfig.iban || 'AT12 1234 1234 1234 1234'}
                mask='AA99 9999 9999 9999 9999'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='companyNumber'
                className='text-right text-sm font-medium'
              >
                Company Number
              </Label>
              <Input
                id='companyNumber'
                name='companyNumber'
                defaultValue={siteConfig.companyNumber}
                className='col-span-3 p-2 border rounded-lg'
              />
            </div>
            <AddressSelectComponent
              onAddressSelect={setSelectedAddress}
              defaultValue={selectedAddress}
            />
            <input
              type='hidden'
              id='addressId'
              name='addressId'
              value={selectedAddress}
            />
          </div>
          <Separator />
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isPending}
              className='px-6 py-2 rounded-lg'
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
