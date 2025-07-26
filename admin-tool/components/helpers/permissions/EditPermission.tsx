'use client';
import { useActionState } from 'react';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SelectNative } from '@/components/ui/select-native';
import { Save } from 'lucide-react';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { updatePermission } from '@/lib/actions/permission.actions';
import { Actions, Resources, ROLE_NAMES, Permission } from '@/lib/types';
import { GenericLoading } from '@/components/loading-states/loading';

export default function EditPermission({
  permission,
}: {
  permission: Permission;
}) {
  const [_formState, action, isPending] = useActionState(
    updatePermission.bind(null, permission.permissionId, permission),
    { success: false, errors: { title: [''] } }
  );

  const t = useTranslations('Dashboard.Ressource.Permissions');
  const tFilter = useTranslations('FilterAndSearch.Filter');

  return (
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-6'>
        <div>
          <Label htmlFor='role'>{t('Attributes.role')}</Label>
          <SelectNative
            name='role'
            defaultValue={permission.role}
            className='h-9 ps-3 pe-8 w-[180px]'
          >
            {ROLE_NAMES.map((role) => (
              <option key={role} value={role}>
                {tFilter(`Roles.options.${role.toLowerCase()}`)}
              </option>
            ))}
          </SelectNative>
        </div>
        <div>
          <Label htmlFor='action'>{t('Attributes.action')}</Label>
          <SelectNative
            name='action'
            defaultValue={permission.action}
            className='h-9 ps-3 pe-8 w-[180px]'
          >
            {Object.values(Actions).map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </SelectNative>
        </div>
        <div>
          <Label htmlFor='resource'>{t('Attributes.resource')}</Label>
          <SelectNative
            name='resource'
            defaultValue={permission.resource}
            className='h-9 ps-3 pe-8 w-[180px]'
          >
            {Object.values(Resources).map((res) => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </SelectNative>
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <LoadingIcon />
              <GenericLoading text={t('buttons.updateLoading')} />
            </>
          ) : (
            <>
              <Save /> {t('buttons.update')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
