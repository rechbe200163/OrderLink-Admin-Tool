'use client';

import { Permission, Actions, Resources } from '@/lib/types';
import { CheckIcon, XIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { humanizeEnum, capitalizeFirstLetter } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function PermissionsGrid({
  permissions,
}: {
  permissions: Permission[];
}) {
  const roles = Array.from(new Set(permissions.map((p) => p.role)));
  const tRole = useTranslations('FilterAndSearch.Filter.Roles.options');

  const allActions = [
    Actions.CREATE,
    Actions.READ,
    Actions.UPDATE,
    Actions.DELETE,
  ];
  const allResources = Object.values(Resources); // Zeigt *alle* Ressourcen, unabhängig von Permissions

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

  function hasPermission(role: string, resource: Resources, action: Actions) {
    return permissions.some(
      (p) =>
        p.role === role &&
        p.resource === resource &&
        p.action === action &&
        p.allowed
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className='*:border-border border-y-0 hover:bg-transparent [&>:not(:last-child)]:border-r'>
          <TableCell>Action</TableCell>
          {allResources.flatMap((resource) =>
            roles.map((role) => (
              <TableHead key={`${resource}-${role}`} className='text-center'>
                {humanizeEnum(resource)}
                <br />
                <span className='text-xs text-muted-foreground'>
                  {getRoleLabel(role)}
                </span>
              </TableHead>
            ))
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {allActions.map((action) => (
          <TableRow
            key={action}
            className='*:border-border [&>:not(:last-child)]:border-r'
          >
            <TableHead className='text-foreground font-medium'>
              {humanizeEnum(action)}
            </TableHead>
            {allResources.flatMap((resource) =>
              roles.map((role) => (
                <TableCell
                  key={`${action}-${resource}-${role}`}
                  className='text-center'
                >
                  {hasPermission(role, resource, action) ? (
                    <CheckIcon
                      className='inline-flex stroke-emerald-600'
                      size={16}
                      aria-hidden='true'
                    />
                  ) : (
                    <XIcon
                      className='inline-flex stroke-red-600'
                      size={16}
                      aria-hidden='true'
                    />
                  )}
                </TableCell>
              ))
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
