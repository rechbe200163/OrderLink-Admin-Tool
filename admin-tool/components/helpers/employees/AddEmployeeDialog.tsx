'use client';

import { useTranslations } from 'next-intl';
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
import { MailIcon, PlusCircle } from 'lucide-react';
import { useId } from 'react';
import { createEmployee } from '@/lib/actions/employee.actions';
import { GenericForm } from '@/components/forms/generic';
import { Role } from '@/lib/types';
import { FormState } from '@/lib/form.types';

const AddEmployeeDialog = ({ roles }: { roles: Role[] }) => {
  const id = useId();
  const t = useTranslations('Dashboard.Ressource.Employees');
  const tFilter = useTranslations('FilterAndSearch.Filter');

  return (
    <GenericForm
      serverAction={createEmployee}
      submitButtonText={t('buttons.add')}
      submitButtonPendingText={t('buttons.add')}
    >
      {(formState: FormState, isPending: boolean) => (
        <>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor={`${id}-firstName`}>
                {t('Attributes.firstName')}
              </Label>
              <Input
                id={`${id}-firstName`}
                name='firstName'
                placeholder={t('Placeholder.firstName')}
                required
                disabled={isPending}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor={`${id}-lastName`}>
                {t('Attributes.lastName')}
              </Label>
              <Input
                id={`${id}-lastName`}
                name='lastName'
                placeholder={t('Placeholder.lastName')}
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor={`${id}-email`}>{t('Attributes.email')}</Label>
            <div className='relative'>
              <Input
                id={`${id}-email`}
                className='peer pe-9'
                placeholder={t('Placeholder.email')}
                type='email'
                name='email'
                required
                disabled={isPending}
              />
              <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50'>
                <MailIcon size={16} aria-hidden='true' />
              </div>
            </div>
          </div>
          <div className='space-y-2'>
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
          <div className='space-y-2'>
            <Label htmlFor='roleId'>{t('Attributes.role')}</Label>
            <Select name='roleId' disabled={isPending}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('Placeholder.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role: Role) => (
                    <SelectItem key={role.roleId} value={role.roleId}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </GenericForm>
  );
};

export default AddEmployeeDialog;
