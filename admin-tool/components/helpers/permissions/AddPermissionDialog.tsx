'use client';

import { useState } from 'react';
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
import { PlusCircle } from 'lucide-react';
import { createPermission } from '@/lib/actions/permission.actions';
import { useTranslations } from 'next-intl';
import { Resources } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { GenericDialogForm } from '@/components/forms/generic';

export default function AddPermissionDialog({ roles }: { roles: string[] }) {
  const t = useTranslations('Dashboard.Ressource.Permissions');
  const tFilter = useTranslations('FilterAndSearch.Filter');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  return (
    <GenericDialogForm
      triggerButtonText={t('add')}
      triggerButtonIcon={<PlusCircle className='h-4 w-4' />}
      dialogTitle={t('add')}
      dialogDescription={t('dialogDescription')}
      serverAction={createPermission}
      submitButtonText={t('buttons.add')}
      submitButtonPendingText={t('buttons.add')}
    >
      {(formState, isPending) => (
        <>
          <div className='space-y-2'>
            <Label htmlFor='role'>{t('Attributes.role')}</Label>
            <Select name='role' disabled={isPending}>
              <SelectTrigger className='w-full'>
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
          <div className='space-y-2'>
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
          <div className='space-y-2'>
            <Label htmlFor='resource'>{t('Attributes.resource')}</Label>
            <Select name='resource' disabled={isPending}>
              <SelectTrigger className='w-full'>
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
          <div className='space-y-2'>
            <Label htmlFor='allowed'>{t('Attributes.allowed')}</Label>
            <Checkbox
              id='allowed'
              name='allowed'
              className='mr-2'
              defaultChecked
              disabled={isPending}
            />
          </div>
        </>
      )}
    </GenericDialogForm>
  );
}
