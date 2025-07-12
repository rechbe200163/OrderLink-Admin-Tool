'use client';
import React, { useActionState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle } from 'lucide-react';
import CustomeToast from '../toasts/CustomeErrorToast';
import { createPermission } from '@/lib/actions/permissions.actions';
import { Actions, Ressources, Role } from '@/lib/types';
import { useTranslations } from 'next-intl';

export default function CreatePermission() {
  const t = useTranslations('Dashboard.Ressource.Permissions');
  const [formState, action, isPending] = useActionState(createPermission, {
    success: false,
    errors: { title: [''] },
  });

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='Permission created successfully' />
      ));
    }
  }, [formState.success]);

  return (
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-6'>
        <div>
          <Label htmlFor='resource'>{t('Attributes.resource')}</Label>
          <Select name='resource'>
            <SelectTrigger>
              <SelectValue placeholder={t('Attributes.resource')} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Ressources).map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='action'>{t('Attributes.action')}</Label>
          <Select name='action'>
            <SelectTrigger>
              <SelectValue placeholder={t('Attributes.action')} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Actions).map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='role'>{t('Attributes.role')}</Label>
          <Select name='role'>
            <SelectTrigger>
              <SelectValue placeholder={t('Attributes.role')} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Role)
                .filter((r) => r !== 'CUSTOMER')
                .map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <Loader2 className='animate-spin h-5 w-5' /> {t('buttons.addLoading')}
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
