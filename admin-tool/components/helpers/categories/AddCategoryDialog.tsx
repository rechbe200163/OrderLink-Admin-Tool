'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPinHouse } from 'lucide-react';
import { createCategory } from '@/lib/actions/categories.actions';
import { useTranslations } from 'next-intl';
import { GenericDialogForm } from '@/components/forms/generic';

export default function AddCategoryDialog() {
  const t = useTranslations('Dashboard.Ressource.Categories');

  return (
    <GenericDialogForm
      triggerButtonText={t('add')}
      triggerButtonIcon={<MapPinHouse className='h-4 w-4' />}
      dialogTitle={t('add')}
      dialogDescription={t('dialogDescription')}
      serverAction={createCategory}
      submitButtonText={t('buttons.add')}
      submitButtonPendingText={t('buttons.add')}
    >
      {(formState, isPending) => (
        <div className='space-y-2'>
          <Label htmlFor='name'>{t('Attributes.name')}</Label>
          <Input
            id='name'
            name='name'
            placeholder={t('Attributes.name')}
            required
            disabled={isPending}
          />
        </div>
      )}
    </GenericDialogForm>
  );
}
