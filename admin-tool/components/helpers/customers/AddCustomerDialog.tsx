'use client';

import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { addCustomer } from '@/lib/actions/user.actions';
import AddressSelectComponent from '@/components/helpers/AddressSelectComponent';
import { useTranslations } from 'next-intl';
import PhoneNumberInputComponent from '@/components/PhoneNumberInputComponent';
import { BusinessSector } from '@/lib/types';
import { useCustomerStore } from '@/lib/stores/useCustomerStore';
import { GenericDialogForm } from '@/components/forms/generic';

export default function AddCustomerDialog() {
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

  const t = useTranslations('Dashboard.Ressource.Customers');
  const tFilter = useTranslations('FilterAndSearch.Filter');

  // Hydrate the store on mount to prevent SSR hydration issues
  useEffect(() => {
    useCustomerStore.persist.rehydrate();
  }, []);

  return (
    <GenericDialogForm
      triggerButtonText={t('add')}
      triggerButtonIcon={<PlusCircle className='h-4 w-4' />}
      dialogTitle={t('header')}
      dialogDescription={t('dialogDescription')}
      serverAction={addCustomer}
      submitButtonText={t('buttons.add')}
      submitButtonPendingText={t('buttons.add')}
      formClassName='space-y-4 max-h-[60vh] overflow-y-auto'
    >
      {(formState, isPending) => (
        <>
          {/* Customer Details Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>{t('Details.customerDetails')}</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>{t('Attributes.firstName')}</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  required
                  placeholder={t('Placeholder.firstName')}
                  onChange={(e) => setFirstName(e.target.value)}
                  defaultValue={firstName || ''}
                  disabled={isPending}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>{t('Attributes.lastName')}</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  placeholder={t('Placeholder.lastName')}
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  defaultValue={lastName || ''}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>{t('Attributes.email')}</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder={t('Placeholder.email')}
                required
                onChange={(e) => setEmail(e.target.value)}
                defaultValue={email || ''}
                disabled={isPending}
              />
            </div>
            <div className='space-y-2'>
              <PhoneNumberInputComponent />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>{t('Attributes.password')}</Label>
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
            <div className='space-y-2'>
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
          <div className='space-y-4 pt-4 border-t'>
            <h3 className='text-lg font-semibold'>
              {t('Details.businessCustomerDetails')}
            </h3>
            <div className='space-y-2'>
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
                disabled={isPending}
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
            {businessSector ? (
              <div className='space-y-2'>
                <Label htmlFor='companyNumber'>
                  {t('Attributes.companyNumber')}
                </Label>
                <Input
                  id='companyNumber'
                  name='companyNumber'
                  placeholder={t('Placeholder.companyNumber')}
                  required
                  onChange={(e) => setCompanyNumber(e.target.value)}
                  defaultValue={companyNumber || ''}
                  disabled={isPending}
                />
              </div>
            ) : (
              <input type='hidden' name='companyNumber' value='' />
            )}
          </div>
        </>
      )}
    </GenericDialogForm>
  );
}
