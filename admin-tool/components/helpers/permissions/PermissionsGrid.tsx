'use client';
import { Permission, Actions } from '@/lib/types';
import { CheckCircle2Icon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { humanizeEnum, capitalizeFirstLetter } from '@/lib/utils';

export default function PermissionsGrid({ permissions, role }: { permissions: Permission[]; role: string }) {
  const t = useTranslations('Dashboard.Ressource.Permissions');
  const tRole = useTranslations('FilterAndSearch.Filter.Roles.options');

  function getRoleLabel(r: string): string {
    switch (r) {
      case 'ADMIN':
        return tRole('admin');
      case 'EMPLOYEE':
        return tRole('employee');
      case 'SUPPLIER':
        return tRole('supplier');
      default:
        return capitalizeFirstLetter(r);
    }
  }

  const resources = Array.from(new Set(permissions.map((p) => p.resource)));
  const actions = [Actions.CREATE, Actions.READ, Actions.UPDATE, Actions.DELETE];

  return (
    <div className='space-y-2'>
      <h3 className='text-lg font-semibold'>{getRoleLabel(role)}</h3>
      <div className='max-h-[50vh] overflow-auto'>
        <table className='min-w-full border-collapse text-sm [&_td]:border-border [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
          <thead className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <tr>
              <th className='px-2 py-1 text-left'>{t('Attributes.resource')}</th>
              {actions.map((action) => (
                <th key={action} className='px-2 py-1'>
                  {humanizeEnum(action)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource} className='hover:bg-muted/20'>
                <td className='px-2 py-1 font-medium'>
                  {humanizeEnum(resource)}
                </td>
                {actions.map((action) => {
                  const permission = permissions.find(
                    (p) => p.action === action && p.resource === resource
                  );
                  const allowed = permission && !permission.deleted;
                  return (
                    <td key={action} className='px-2 py-1 text-center'>
                      {allowed ? (
                        <CheckCircle2Icon className='inline-block text-green-500' />
                      ) : (
                        <XIcon className='inline-block text-destructive' />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
