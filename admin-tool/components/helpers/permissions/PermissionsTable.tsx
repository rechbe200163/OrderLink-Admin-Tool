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
import { Permission } from '@/lib/types';
import { capitalizeFirstLetter, humanizeEnum } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Shield } from 'lucide-react';
import { EmptyState, TableEmptyState } from '@/components/ui/empty-state';

interface PermissionsTableProps {
  permissions: Permission[];
  searchQuery?: string;
}

export function PermissionsTable({
  permissions,
  searchQuery,
}: PermissionsTableProps) {
  const t = useTranslations('Dashboard.Ressource.Permissions.Attributes');
  const tButtons = useTranslations('Dashboard.Ressource.Permissions.buttons');
  const tStatus = useTranslations('Dashboard.Ressource.Permissions.Status');
  const tEmptyState = useTranslations('Dashboard.Ressource.Permissions.EmptyState');
  const tRole = useTranslations('FilterAndSearch.Filter.Roles.options');
  const isFiltered = !!searchQuery;

  function getRoleLabel(role: string): string {
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

  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='max-h-[50vh] overflow-auto min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-40'>{t('role')}</TableHead>
              <TableHead className='w-40'>{t('action')}</TableHead>
              <TableHead className='w-40'>{t('resource')}</TableHead>
              <TableHead className='w-20 text-right'>
                {t('status')}
              </TableHead>
              <TableHead className='w-20 text-right'>{t('actions')}</TableHead>
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
                      {getRoleLabel(permission.roleName)}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      {humanizeEnum(permission.action)}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      {humanizeEnum(permission.resource)}
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
                          ? tStatus('inactive')
                          : tStatus('active')}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='w-20 text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/permissions/${permission.permissionId}/edit`}
                          >
                            {tButtons('editButton')}
                          </Link>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem disabled>
                          Löschen
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmptyState colSpan={5}>
                <EmptyState
                  icon={Shield}
                  title={
                    isFiltered
                      ? tEmptyState('title')
                      : tEmptyState('subtitle')
                  }
                  description={tEmptyState('description')}
                  isFiltered={isFiltered}
                  filterMessage={
                    searchQuery ? `Suche: "${searchQuery}"` : undefined
                  }
                />
              </TableEmptyState>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
