'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { Actions, Permission, Ressources, Role } from '@/lib/types';
import { capitalizeFirstLetter, humanizeEnum } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export function PermissionsGrid({ permissions }: { permissions: Permission[] }) {
  const t = useTranslations('Dashboard.Ressource.Permissions');
  const tRole = useTranslations('FilterAndSearch.Filter.Roles.options');

  function getRoleLabel(role: Role): string {
    switch (role) {
      case 'ADMIN':
        return tRole('admin');
      case 'EMPLOYEE':
        return tRole('employee');
      case 'SUPPLIER':
        return tRole('supplier');
      default:
        return capitalizeFirstLetter(role);
    }
  }

  const permissionsByRole = permissions.reduce<Record<string, Permission[]>>( (
    acc,
    permission
  ) => {
    if (!acc[permission.role]) acc[permission.role] = [];
    acc[permission.role].push(permission);
    return acc;
  }, {});

  const actions = Object.values(Actions);
  const resources = Object.values(Ressources);

  return (
    <div className='space-y-8'>
      {Object.entries(permissionsByRole).map(([role, perms]) => (
        <div key={role} className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
          <h3 className='font-semibold mb-2'>{getRoleLabel(role as Role)}</h3>
          <div className='max-h-[50vh] overflow-auto min-w-full'>
            <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
              <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
                <TableRow className='hover:bg-muted'>
                  <TableHead className='w-40'>{t('Attributes.resource')}</TableHead>
                  {actions.map((action) => (
                    <TableHead key={action} className='w-20 text-center'>
                      {humanizeEnum(action)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((res) => (
                  <TableRow key={res} className='hover:bg-muted/50 transition-colors'>
                    <TableCell className='font-medium'>{humanizeEnum(res)}</TableCell>
                    {actions.map((action) => {
                      const hasPermission = perms.some(
                        (p) =>
                          p.resource === res &&
                          p.action === action &&
                          !p.deleted
                      );
                      return (
                        <TableCell
                          key={action}
                          className='text-center'
                        >
                          {hasPermission ? (
                            <Check className='h-4 w-4 text-green-500 mx-auto' />
                          ) : (
                            <X className='h-4 w-4 text-red-500 mx-auto' />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}
