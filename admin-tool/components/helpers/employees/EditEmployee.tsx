'use client';
import { Employees, Role } from '@prisma/client';
import React, { useActionState, useId } from 'react';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';

import { Button } from '@/components/ui/button';
import { Loader2, MailIcon, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateEmployee } from '@/lib/actions/employee.actions';
import { useTranslations } from 'next-intl';
import router from 'next/router';

interface EditEmployeesProps {
  employee: Employees;
}

const EditEmployee = ({ employee }: EditEmployeesProps) => {
  const t = useTranslations('Dashboard.Ressource.Employees');
  const tRoles = useTranslations('FilterAndSearch.Filter.Roles');
  const [formState, action, isPending] = useActionState(
    updateEmployee.bind(null, employee.employeeId),
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
          message={`${t('Toast.error')}: ${
            formState.errors?.title?.join(', ') ?? ''
          }`}
        />
      ));
    }
  }, [formState, t]);

  const id = useId();
  return (
    <Card className='shadow-md p-6 min-w-full bg-background'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight mb-6'>
          {t('headerUpdate')} {employee.firstName} {employee.lastName}
        </h2>

        <div className='*:not-first:mt-2'>
          <Label htmlFor='email'>{t('Attributes.email')}</Label>
          <div className='relative'>
            <Input
              id='email'
              className='peer pe-9'
              placeholder={t('Placeholder.email')}
              type='email'
              name='email'
              defaultValue={employee.email}
            />
            <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50'>
              <MailIcon size={16} aria-hidden='true' />
            </div>
          </div>
        </div>

        <div className='relative'>
          <Label htmlFor='firstName'>{t('Attributes.firstName')}</Label>
          <Input
            id='firstName'
            name='firstName'
            placeholder={t('Placeholder.firstName')}
            defaultValue={employee.firstName}
          />
        </div>

        <div className='relative'>
          <Label htmlFor='lastName'>{t('Attributes.lastName')}</Label>
          <Input
            id='lastName'
            name='lastName'
            placeholder={t('Placeholder.lastName')}
            defaultValue={employee.lastName}
          />
        </div>

        <div>
          <Label htmlFor='role'>{t('Attributes.role')}</Label>
          <Select name='role' defaultValue={employee.role}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={t('Placeholder.selectRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(Role).map((role) => (
                  <SelectItem key={role} value={role}>
                    {tRoles(`options.${role.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <Loader2 className='animate-spin h-5 w-5' />
              {t('buttons.updateLoading')}
            </>
          ) : (
            <>
              <PlusCircle />
              {t('buttons.update')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default EditEmployee;
