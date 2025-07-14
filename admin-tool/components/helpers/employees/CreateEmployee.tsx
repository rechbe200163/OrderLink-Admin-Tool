'use client';

import React, { useActionState, useId } from 'react';
import { toast } from 'sonner';

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
import { Button } from '@/components/ui/button';
import { Loader2, MailIcon, PlusCircle } from 'lucide-react';

import CustomeToast from '../toasts/CustomeErrorToast';
import { createEmployee } from '@/lib/actions/employee.actions';
import { useTranslations } from 'next-intl';

const CreateEmployees = ({ roles }: { roles: string[] }) => {
  const [formState, action, isPending] = useActionState(createEmployee, {
    success: false,
    errors: {
      title: [''],
    },
  });

  const id = useId();
  const t = useTranslations('Dashboard.Ressource.Employees');
  const tFilter = useTranslations('FilterAndSearch.Filter');

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Employee created successfully!'
        />
      ));
    } else if (formState.errors?.title[0]) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred: ${formState.errors?.title.join(', ')}`}
        />
      ));
    }
  }, [formState]);

  return (
    <div>
      <h2 className='text-3xl font-bold tracking-tight mb-6 bg-background'>
        {t('CreateEmployee.header')}
      </h2>
      <Card className='shadow-md p-6'>
        <form action={action} className='space-y-6'>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold mb-4'>
              {t('Details.employeeDetails')}
            </h3>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
              <div>
                <Label htmlFor={`${id}-firstName`}>
                  {t('Attributes.firstName')}
                </Label>
                <Input
                  id={`${id}-firstName`}
                  name='firstName'
                  placeholder={t('Placeholder.firstName')}
                />
              </div>
              <div>
                <Label htmlFor={`${id}-lastName`}>
                  {t('Attributes.lastName')}
                </Label>
                <Input
                  id={`${id}-lastName`}
                  name='lastName'
                  placeholder={t('Placeholder.lastName')}
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`${id}-email`}>{t('Attributes.email')}</Label>
              <div className='relative'>
                <Input
                  id={`${id}-email`}
                  className='peer pe-9'
                  placeholder={t('Placeholder.email')}
                  type='email'
                  name='email'
                />
                <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50'>
                  <MailIcon size={16} aria-hidden='true' />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor='password'>{t('Attributes.password')}</Label>
              <Input
                id='password'
                placeholder={t('Placeholder.password')}
                disabled
                required
              />
              <span className='text-sm text-gray-500'>
                {t('Placeholder.passwordInfo')}
              </span>
            </div>
            <div>
              <Label htmlFor='role'>{t('Attributes.role')}</Label>
              <Select name='role'>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder={t('Placeholder.selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {tFilter(`Roles.options.${role.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='animate-spin h-5 w-5' />
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
};

export default CreateEmployees;
