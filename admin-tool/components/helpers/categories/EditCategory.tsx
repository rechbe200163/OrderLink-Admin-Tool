'use client';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Loader2Icon, MapPinHouse } from 'lucide-react';
import React from 'react';
import CustomeToast from '../toasts/CustomeErrorToast';
import { updateCategory } from '@/lib/actions/categories.actions';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Category } from '@/lib/types';

export default function EditCategory({ category }: { category: Category }) {
  const t = useTranslations('Dashboard.Ressource.Categories');
  const router = useRouter();
  const [formState, action, isPending] = useActionState(
    updateCategory.bind(null, category.categoryId),
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
      if (formState.data) {
        router.push(`/categories/${formState.data}/edit`);
      }
    }
  }, [formState, router]);

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
          <Label htmlFor='streetNumber'>{t('Attributes.name')}</Label>
          <Input
            id='name'
            name='name'
            placeholder={t('Attributes.name')}
            required
            defaultValue={category.name}
          />
        </div>

        <Button type='submit'>
          {isPending ? (
            <>
              <Loader2Icon className='animate-spin' />
              {t('buttons.updateLoading')}
            </>
          ) : (
            <>
              <MapPinHouse />
              {t('buttons.update')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
