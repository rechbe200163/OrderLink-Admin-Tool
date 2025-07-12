import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Permission } from '@/lib/types';

export function PermissionsTable({ permissions }: { permissions: Permission[] }) {
  const t = useTranslations('Dashboard.Ressource.Permissions');

  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='[&>div]:max-h-[50vh] min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-40'>{t('Attributes.resource')}</TableHead>
              <TableHead className='w-40'>{t('Attributes.action')}</TableHead>
              <TableHead className='w-40'>{t('Attributes.role')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length > 0 ? (
              permissions.map((permission) => (
                <TableRow key={permission.permissionId} className='hover:bg-muted'>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      {permission.resource}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      {permission.action}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/permissions/${permission.permissionId}/edit`}
                      className='hover:underline'
                    >
                      {permission.role}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className='text-center'>
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
