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
import { Employees } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, MoreVertical } from 'lucide-react';

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
              <TableHead className='w-20 text-right'>Aktionen</TableHead>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                          <Link href={`/employees/${employee.employeeId}/edit`}>
                            Bearbeiten
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/employees/${employee.employeeId}/edit`}>
                            Historie
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
