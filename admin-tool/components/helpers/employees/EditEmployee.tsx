'use client';

import React, { useActionState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import router from 'next/router';

import { updateEmployee } from '@/lib/actions/employee.actions';
import { type Employees, ROLE_NAMES } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { MailIcon, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingIcon from '@/components/loading-states/loading-icon';
import CustomeToast from '../toasts/CustomeErrorToast';

interface EditEmployeesProps {
  employee: Employees;
}

const EditEmployee = ({ employee }: EditEmployeesProps) => {
  const t = useTranslations('Dashboard.Ressource.Employees');
  const tRoles = useTranslations('FilterAndSearch.Filter.Roles');

  const [formState, action, isPending] = useActionState(
    updateEmployee.bind(null, employee.employeeId, employee),
    {
      success: false,
      errors: {
        title: [''],
      },
    }
  );

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message={t('Toast.success')} />
      ));
      if (formState.data) {
        router.push(`/employees/${formState.data}/edit`);
      }
    } else if (formState.errors?.title[0]) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`${t('Toast.error')}: ${formState.errors?.title?.join(', ')}`}
        />
      ));
    }
  }, [formState, t]);

  return (
    <Card className='shadow-md p-6 bg-background'>
      <form action={action} className='space-y-6'>
        <div className='space-y-6'>
          {' '}
          {/* Adjusted spacing for consistency */}
          <h3 className='text-xl font-semibold mb-4 text-foreground'>
            {t('Details.employeeDetails')}
          </h3>
          <div>
            <Label htmlFor='email'>{t('Attributes.email')}</Label>
            <div className='relative mt-1'>
              {' '}
              {/* Added mt-1 for label-input spacing */}
              <Input
                id='email'
                name='email'
                className='peer pe-9'
                type='email'
                placeholder={t('Placeholder.email')}
                defaultValue={employee.email}
              />
              <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50'>
                <MailIcon size={16} aria-hidden='true' />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
            <div>
              <Label htmlFor='firstName'>{t('Attributes.firstName')}</Label>
              <Input
                id='firstName'
                name='firstName'
                placeholder={t('Placeholder.firstName')}
                defaultValue={employee.firstName}
                className='mt-1' // Added mt-1
              />
            </div>
            <div>
              <Label htmlFor='lastName'>{t('Attributes.lastName')}</Label>
              <Input
                id='lastName'
                name='lastName'
                placeholder={t('Placeholder.lastName')}
                defaultValue={employee.lastName}
                className='mt-1' // Added mt-1
              />
            </div>
          </div>
          <div>
            <Label htmlFor='role'>{t('Attributes.role')}</Label>
            <Select name='role' defaultValue={employee.roleName}>
              <SelectTrigger className='w-full mt-1'>
                {' '}
                {/* Changed w-[180px] to w-full and added mt-1 */}
                <SelectValue placeholder={t('Placeholder.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ROLE_NAMES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {tRoles(`options.${role.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type='submit' disabled={isPending} className='w-full mt-8'>
          {' '}
          {/* Added w-full and mt-8 */}
          {isPending ? (
            <>
              <LoadingIcon />
              {t('buttons.updateLoading')}
            </>
          ) : (
            <>
              <PlusCircle className='mr-2' />
              {t('buttons.update')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default EditEmployee;
