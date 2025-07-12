'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Permission, Role } from '@/lib/types';
import { capitalizeFirstLetter, humanizeEnum } from '@/lib/utils';

export function PermissionsTable({
  permissions,
}: {
  permissions: Permission[];
}) {
  const t = useTranslations('Dashboard.Ressource.Permissions');
  const tRole = useTranslations('FilterAndSearch.Filter.Roles.options');

  function getRoleLabel(role: Role): string {
    switch (role) {
      case 'ADMIN':
        return tRole('admin');
      case 'EMPLOYEE':
        return tRole('employee');
      case 'SUPPPLIER':
        return tRole('supplier');
      default:
        return capitalizeFirstLetter(role);
    }
  }

  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='max-h-[50vh] overflow-auto min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-40'>{t('Attributes.role')}</TableHead>
              <TableHead className='w-40'>{t('Attributes.action')}</TableHead>
              <TableHead className='w-40'>{t('Attributes.resource')}</TableHead>
              <TableHead className='w-20 text-right'>
                {t('Attributes.status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length > 0 ? (
              permissions.map((permission) => (
                <TableRow
                  key={permission.permissionId}
                  className='hover:bg-muted/50 transition-colors'
                >
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      <Badge variant='secondary'>
                        {getRoleLabel(permission.role as Role)}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      <Badge variant='secondary'>
                        {humanizeEnum(permission.action)}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      <Badge variant='secondary'>
                        {humanizeEnum(permission.resource)}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='w-20 text-right'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      <Badge
                        variant={permission.deleted ? 'destructive' : 'success'}
                      >
                        {permission.deleted
                          ? t('Status.inactive')
                          : t('Status.active')}
                      </Badge>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-4'>
                  {t('Attributes.notFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
