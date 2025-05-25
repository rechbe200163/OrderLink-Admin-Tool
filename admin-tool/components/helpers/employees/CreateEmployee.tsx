'use client';
import { Customer, Order, Product } from '@prisma/client';
import React, { useActionState, useId } from 'react';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';

import { Button } from '@/components/ui/button';
import { Loader2, MailIcon, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import OrderSelectComponent from '../OrderSelectComponent';
import { createRoute } from '@/lib/actions/route.actions';
import { Role } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createEmployee } from '@/lib/actions/employee.actions';
import { useTranslations } from 'next-intl';

const CreateEmployees = () => {
  const [formState, action, isPending] = useActionState(createEmployee, {
    success: false,
    errors: {
      title: [''],
    },
  });

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
          message={`An error occurred: ${
            formState.errors?.title?.join(', ') ?? ''
          }`}
        />
      ));
    }
  }, [formState]);

  const id = useId();
  const t = useTranslations('Dashboard.Ressource.Employees');
  const tFilter = useTranslations('FilterAndSearch.Filter');
  return (
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight mb-6'>
          {t('CreateEmployee.header')}
        </h2>
        <div className='*:not-first:mt-2'>
          <Label htmlFor={id}>{t('Attributes.email')}</Label>
          <div className='relative'>
            <Input
              id={id}
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
        <div className='relative'>
          <Label htmlFor={id}>{t('Attributes.firstName')}</Label>
          <Input
            id={id}
            name='firstName'
            placeholder={t('Placeholder.firstName')}
          />
        </div>
        <div className='relative'>
          <Label htmlFor={id}>{t('Attributes.lastName')}</Label>
          <Input
            id={id}
            name='lastName'
            placeholder={t('Placeholder.lastName')}
          />
        </div>
        <div>
          <Label htmlFor='role'>{t('Attributes.role')}</Label>
          <Select name='role'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={t('Placeholder.selectRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(Role).map((role) => (
                  <SelectItem key={role} value={role}>
                    {tFilter(`Roles.options.${role.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <Loader2 className='animate-spin h-5 w-5' />{' '}
              {t('buttons.addLoading')}
            </>
          ) : (
            <>
              <PlusCircle /> {t('buttons.add')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default CreateEmployees;
