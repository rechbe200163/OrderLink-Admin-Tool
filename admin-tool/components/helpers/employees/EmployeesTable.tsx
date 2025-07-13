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
import { capitalizeFirstLetter } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Employees } from '@/lib/types';

export function EmployeesTable({ employees }: { employees: Employees[] }) {
  const t = useTranslations('Dashboard.Ressource.Employees');

  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='[&>div]:max-h-[50vh] min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-40'>{t('Attributes.email')}</TableHead>
              <TableHead className='w-40'>
                {t('Attributes.firstName')}
              </TableHead>
              <TableHead className='w-40'>{t('Attributes.lastName')}</TableHead>
              <TableHead className='w-40'>{t('Attributes.role')}</TableHead>
              <TableHead className='w-20 text-right'>
                {t('Attributes.status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow
                  key={employee.employeeId}
                  className='hover:bg-muted/50 transition-colors'
                >
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/employees/${employee.employeeId}/edit`}
                      className='hover:underline'
                    >
                      {employee.email || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/employees/${employee.employeeId}/edit`}
                      className='hover:underline'
                    >
                      {employee.firstName || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/employees/${employee.employeeId}/edit`}
                      className='hover:underline'
                    >
                      {employee.lastName || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/employees/${employee.employeeId}/edit`}
                      className='hover:underline'
                    >
                      {employee.role}
                    </Link>
                  </TableCell>
                  <TableCell className='w-20 text-right'>
                    <Link
                      href={`/employees/${employee.employeeId}/edit`}
                      className='hover:underline'
                    >
                      <Badge
                        variant={employee.deleted ? 'destructive' : 'success'}
                      >
                        {employee.deleted
                          ? t('Status.inactive')
                          : t('Status.active')}
                      </Badge>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-4'>
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
