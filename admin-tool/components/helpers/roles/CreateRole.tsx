'use client';
import { useActionState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { createRole } from '@/lib/actions/role.actions';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';
import GenericInputMaskComponent from '@/components/InputWithMask';

export default function CreateRole() {
  const [formState, action, isPending] = useActionState(createRole, {
    success: false,
    errors: { title: [''] },
  });

  const t = useTranslations('Dashboard.Ressource.Roles');

  useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='Role created successfully' />
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
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight mb-6'>{t('add')}</h2>
        <div>
          <Label htmlFor='name'>{t('Attributes.name')}</Label>
          <GenericInputMaskComponent
            name='name'
            onlyUppercase
            placeholder={t('Attributes.name')}
          />
        </div>
        <div>
          <Label htmlFor='description'>{t('Attributes.description')}</Label>
          <Input
            id='description'
            name='description'
            placeholder={t('Attributes.description')}
          />
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <LoadingIcon /> {t('buttons.add')}
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
}
