'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { createRole } from '@/lib/actions/role.actions';
import { useTranslations } from 'next-intl';
import GenericInputMaskComponent from '@/components/InputWithMask';
import { GenericDialogForm } from '@/components/forms/generic';

export default function AddRoleDialog() {
  const t = useTranslations('Dashboard.Ressource.Roles');

  return (
    <GenericDialogForm
      triggerButtonText={t('add')}
      triggerButtonIcon={<PlusCircle className='h-4 w-4' />}
      dialogTitle={t('add')}
      dialogDescription={t('dialogDescription')}
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
    </GenericDialogForm>
  );
}
