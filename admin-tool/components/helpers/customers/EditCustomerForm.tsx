'use client';
import React, { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import AddressSelectComponent from '@/components/helpers/AddressSelectComponent';
import { Loader2, PlusCircle } from 'lucide-react';
import { BusinessSector, CustomerWithAddressId } from '@/lib/types';
import { updateCustomer } from '@/lib/actions/user.actions';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';
import PhoneNumberInputComponent from '@/components/PhoneNumberInputComponent';
import { useTranslations } from 'next-intl';
import { Spinner } from '@/components/ui/kibo-ui/spinner';

export default function EditCustomerForm({
  customer,
}: {
  customer: CustomerWithAddressId;
}) {
  const [selectedAddress, setSelectedAddress] = React.useState<string>(
    customer.addressId!
  );
  const [selectedBusinessSector, setSelectedBusinessSector] =
    React.useState<string>(customer.businessSector ?? 'N/A');
  const [formState, action, isPending] = useActionState(
    updateCustomer.bind(null, customer.customerReference!, customer),
    {
      success: false,
      errors: {
        title: [''],
      },
    }
  );

  const t = useTranslations('Dashboard.Ressource.Customers');
  const tFilter = useTranslations('FilterAndSearch.Filter');

  // Handle form submission feedback
  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message={t('toast.success')} />
      ));
    } else if (formState.errors?.title[0]) {
      toast.custom(() => (
        <CustomeToast variant='error' message={t('toast.error')} />
      ));
    }
  }, [formState, t]);

  return (
    <div>
      <h2 className='text-3xl font-bold tracking-tight mb-6 bg-background'>
        {t('headerUpdate')}: {customer.firstName} {customer.lastName}
      </h2>
      <Card className='shadow-md p-6 bg-background'>
        <form action={action} className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Kundendetails */}
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
                    placeholder={t('Placeholder.firstName')}
                    defaultValue={customer.firstName!}
                  />
                </div>
                <div>
                  <Label htmlFor='lastName'>{t('Attributes.lastName')}</Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    placeholder={t('Placeholder.lastName')}
                    required
                    defaultValue={customer.lastName}
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
                  defaultValue={customer.email}
                />
              </div>
              <div>
                <PhoneNumberInputComponent
                  defaultValue={customer.phoneNumber.trim()}
                />
              </div>
              <div>
                <AddressSelectComponent
                  onAddressSelect={setSelectedAddress}
                  defaultValue={customer.addressId}
                />
                <input
                  id='addressId'
                  name='addressId'
                  type='hidden'
                  value={selectedAddress}
                />
              </div>
            </div>

            {/* Geschäftskundendetails */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold mb-4'>
                {t('Details.businessCustomerDetails')}
              </h3>
              {selectedBusinessSector !== 'N/A' ? (
                <div>
                  <Label htmlFor='companyNumber'>
                    {t('Attributes.companyNumber')}
                  </Label>
                  <Input
                    id='companyNumber'
                    name='companyNumber'
                    placeholder={t('Placeholder.companyNumber')}
                    defaultValue={customer.companyNumber ?? ''}
                    required
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
                  value={selectedBusinessSector}
                  onValueChange={(value) => {
                    setSelectedBusinessSector(value);
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
                    {Object.keys(BusinessSector).map((businessSector) => (
                      <SelectItem key={businessSector} value={businessSector}>
                        {tFilter(
                          `BusinessSectors.options.${businessSector.toLowerCase()}`
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
                <Spinner />
                {t('buttons.addLoading')}
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
