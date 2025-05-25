'use client';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Loader2Icon, MapPinHouse } from 'lucide-react';
import React from 'react';
import CustomeToast from '../../helpers/toasts/CustomeErrorToast';
import { createCategory } from '@/lib/actions/categories.actions';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function CategoryForm() {
  const t = useTranslations('Dashboard.Ressource.Categories');

  const [formState, action, isPending] = useActionState(
    createCategory.bind(null),
    {
      success: false,
      errors: {
        title: [],
      },
    }
  );

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Category created successfully'
        />
      ));
    }
  }, [formState.success]);

  React.useEffect(() => {
    if (
      formState.errors &&
      Object.keys(formState.errors).length > 0 &&
      formState.errors.title.length > 0
    ) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred ${formState.errors?.title}`}
        />
      ));
    }
  }, [formState.errors]);

  return (
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-8 max-w-3xl mx-auto py-2'>
        <div>
          <Label htmlFor='name'>{t('Attributes.name')}</Label>
          <Input
            id='name'
            name='name'
            placeholder={t('Attributes.name')}
            required
          />
        </div>

        <Button type='submit'>
          {isPending ? (
            <>
              <Loader2Icon className='animate-spin' />
              {t('buttons.addLoading')}
            </>
          ) : (
            <>
              <MapPinHouse />
              {t('buttons.add')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
