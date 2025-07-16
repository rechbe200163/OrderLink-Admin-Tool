'use client';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import CustomeToast from '../toasts/CustomeErrorToast';
import { updatePermission } from '@/lib/actions/permission.actions';
import { useTranslations } from 'next-intl';
import { Actions, Resources, ROLE_NAMES, Permission } from '@/lib/types';

export default function EditPermission({ permission }: { permission: Permission }) {
  const [formState, action, isPending] = useActionState(
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
          <Select name='role' defaultValue={permission.role}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={t('Attributes.role')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ROLE_NAMES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {tFilter(`Roles.options.${role.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='action'>{t('Attributes.action')}</Label>
          <Select name='action' defaultValue={permission.action}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={t('Attributes.action')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(Actions).map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='resource'>{t('Attributes.resource')}</Label>
          <Select name='resource' defaultValue={permission.resource}>
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
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <Loader2 className='animate-spin h-5 w-5' /> {t('buttons.updateLoading')}
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
