'use client';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React, { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { addCustomer } from '@/lib/actions/user.actions';
import CustomeToast from '../helpers/toasts/CustomeErrorToast';
import AddressSelectComponent from '@/components/helpers/AddressSelectComponent';
import { useTranslations } from 'next-intl';
import PhoneNumberInputComponent from '../PhoneNumberInputComponent';
import { BusinessSector } from '@/lib/types';
import LoadingIcon from '../loading-states/loading-icon';
import { useCustomerStore } from '@/lib/stores/useCustomerStore';

export default function GenericAddForm() {
  const [formState, action, isPending] = useActionState(addCustomer, {
    success: false,
    errors: {
      title: [''],
    },
  });

  const setFirstName = useCustomerStore((state) => state.setFirstName);
  const setLastName = useCustomerStore((state) => state.setLastName);
  const setEmail = useCustomerStore((state) => state.setEmail);
  const setCompanyNumber = useCustomerStore((state) => state.setCompanyNumber);
  const setAddressId = useCustomerStore((state) => state.setAddressId);
  const setBusinessSector = useCustomerStore(
    (state) => state.setBusinessSector
  );

  const firstName = useCustomerStore((state) => state.customer.firstName);
  const lastName = useCustomerStore((state) => state.customer.lastName);
  const email = useCustomerStore((state) => state.customer.email);
  const companyNumber = useCustomerStore(
    (state) => state.customer.companyNumber
  );
  const addressId = useCustomerStore((state) => state.customer.addressId);
  const businessSector = useCustomerStore(
    (state) => state.customer.businessSector
  );
  const reset = useCustomerStore((state) => state.reset);

  // Handle form submission feedback
  useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='User created successfully' />
      ));
    } else if (formState.errors?.title[0]) {
      toast.custom(() => (
        <CustomeToast variant='error' message='User created successfully' />
      ));
    }
    if (formState.success) {
      reset();
    }
  }, [formState, reset]);

  const t = useTranslations('Dashboard.Ressource.Customers');
  const tFilter = useTranslations('FilterAndSearch.Filter');

  return (
    <div>
      <h2 className='text-3xl font-bold tracking-tight mb-6 bg-background'>
        {t('header')}
      </h2>
      <Card className='shadow-md p-6'>
        <form action={action} className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Customer Details Section */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold mb-4'>
                {t('Details.customerDetails')}
              </h3>
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
                <div>
                  <Label htmlFor='firstName'>{t('Attributes.firstName')}</Label>
                  <Input
                    id='firstName'
                    name='firstName'
                    required
                    placeholder={t('Placeholder.firstName')}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    defaultValue={firstName || ''}
                  />
                </div>
                <div>
                  <Label htmlFor='lastName'>{t('Attributes.lastName')}</Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    placeholder={t('Placeholder.lastName')}
                    required
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    defaultValue={lastName || ''}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor='email'>{t('Attributes.email')}</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder={t('Placeholder.email')}
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  defaultValue={email || ''}
                />
              </div>
              <div>
                <PhoneNumberInputComponent />
              </div>
              <div>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='password'>{t('Attributes.password')}</Label>
                </div>
                <Input
                  id='password'
                  placeholder={t('Placeholder.password')}
                  disabled={true}
                  required
                />
                <span className='text-sm text-gray-500'>
                  {t('Placeholder.passwordInfo')}
                </span>
              </div>
              <div>
                <AddressSelectComponent
                  onAddressSelect={setAddressId}
                  defaultValue={addressId}
                />
                <input
                  id='addressId'
                  name='addressId'
                  type='hidden'
                  value={addressId}
                />
              </div>
            </div>
            {/* Business Customer Information Section */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold mb-4'>
                {t('Details.businessCustomerDetails')}
              </h3>
              {businessSector ? (
                <div>
                  <Label htmlFor='companyNumber'>
                    {t('Attributes.companyNumber')}
                  </Label>
                  <Input
                    id='companyNumber'
                    name='companyNumber'
                    placeholder={t('Placeholder.companyNumber')}
                    required
                    onChange={(e) => {
                      setCompanyNumber(e.target.value);
                    }}
                    defaultValue={companyNumber || ''}
                  />
                </div>
              ) : (
                <input type='hidden' name='companyNumber' value='' />
              )}
              <div>
                <Label htmlFor='businessSector'>
                  {t('Attributes.businessSector')}
                </Label>
                <Select
                  name='businessSector'
                  value={businessSector ? businessSector : 'N/A'}
                  onValueChange={(value) => {
                    if (value === 'N/A') setBusinessSector(null);
                    else setBusinessSector(value as BusinessSector);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('Placeholder.selectBusinessSector')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key='N/A' value={'N/A'}>
                      N/A
                    </SelectItem>
                    {Object.keys(BusinessSector).map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {tFilter(
                          `BusinessSectors.options.${sector.toLowerCase()}`
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <>
                <LoadingIcon />
              </>
            ) : (
              <>
                <PlusCircle />
                {t('buttons.add')}
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
