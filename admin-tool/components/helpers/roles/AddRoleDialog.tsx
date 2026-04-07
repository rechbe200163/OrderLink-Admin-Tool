'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { createRole } from '@/lib/actions/role.actions';
import { useTranslations } from 'next-intl';
import GenericInputMaskComponent from '@/components/InputWithMask';
import { GenericForm } from '@/components/forms/generic';

export default function AddRoleDialog() {
  const t = useTranslations('Dashboard.Ressource.Roles');

  return (
    <GenericForm
      serverAction={createRole}
      submitButtonText={t('buttons.add')}
      submitButtonPendingText={t('buttons.add')}
    >
      {(formState, isPending) => (
        <>
          <div className='space-y-2'>
            <Label htmlFor='name'>{t('Attributes.name')}</Label>
            <GenericInputMaskComponent
              name='name'
              onlyUppercase
              placeholder={t('Attributes.name')}
              disabled={isPending}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>{t('Attributes.description')}</Label>
            <Input
              id='description'
              name='description'
              placeholder={t('Attributes.description')}
              disabled={isPending}
            />
          </div>
        </>
      )}
    </GenericForm>
  );
}
