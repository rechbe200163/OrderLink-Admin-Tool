'use client';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ActionsSelectComponent from './ActionsSelectComponent';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import CustomeToast from '../toasts/CustomeErrorToast';
import { createPermission } from '@/lib/actions/permission.actions';
import { useTranslations } from 'next-intl';
import { Resources } from '@/lib/types';
import router from 'next/router';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { GenericLoading } from '@/components/loading-states/loading';

export default function CreatePermission({ roles }: { roles: string[] }) {
  const [formState, action, isPending] = useActionState(createPermission, {
    success: false,
    errors: { title: [''] },
  });

  const t = useTranslations('Dashboard.Ressource.Permissions');
  const tFilter = useTranslations('FilterAndSearch.Filter');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Permission created successfully'
        />
      ));
      if (formState.data) {
        router.push(`/settings/${formState.data}/edit`);
      }
    }
  }, [formState]);

  useEffect(() => {
    if (formState.errors?.title?.length) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred: ${
            formState.errors?.title?.join(', ') ?? ''
          }`}
        />
      ));
    }
  }, [formState.errors]);

  return (
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight mb-6'>{t('add')}</h2>
        <div>
          <Label htmlFor='role'>{t('Attributes.role')}</Label>
          <Select name='role'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={t('Attributes.role')} />
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
        <div>
          <ActionsSelectComponent
            onActionSelect={(action) => {
              setSelectedActions((prev) =>
                prev.includes(action)
                  ? prev.filter((a) => a !== action)
                  : [...prev, action]
              );
            }}
            defaultValue={selectedActions}
          />
          {selectedActions.map((action) => (
            <input key={action} type='hidden' name='actions' value={action} />
          ))}
        </div>
        <div>
          <Label htmlFor='resource'>{t('Attributes.resource')}</Label>
          <Select name='resource'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={t('Attributes.resource')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(Resources).map((res) => (
                  <SelectItem key={res} value={res}>
                    {res}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='allowed'>{t('Attributes.allowed')}</Label>
          <Checkbox
            id='allowed'
            name='allowed'
            className='mr-2'
            defaultChecked
          />
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <LoadingIcon />
              <GenericLoading text={t('buttons.addLoading')} />
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
