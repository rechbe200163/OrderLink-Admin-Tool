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
import { Employees, EmployeesWithRole } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Users } from 'lucide-react';
import { EmptyState, TableEmptyState } from '@/components/ui/empty-state';
import { SortableTableHead } from '../customers/sort-table';

interface EmployeesTableProps {
  employees: EmployeesWithRole[];
  searchQuery?: string;
}

export function EmployeesTable({
  employees,
  searchQuery,
}: EmployeesTableProps) {
  const t = useTranslations('Dashboard.Ressource.Employees.Attributes');
  const tButtons = useTranslations('Dashboard.Ressource.Employees.buttons');
  const tEmptyState = useTranslations(
    'Dashboard.Ressource.Employees.EmptyState',
  );
  const isFiltered = !!searchQuery;

  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
        <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
          <TableRow className='hover:bg-muted'>
            <SortableTableHead
              label={t('email')}
              sortKey='email'
              className='w-40'
            />
            <SortableTableHead
              label={t('firstName')}
              sortKey='firstName'
              className='w-40'
            />
            <SortableTableHead
              label={t('lastName')}
              sortKey='lastName'
              className='w-40'
            />
            <TableHead className='w-40'>{t('role')}</TableHead>
            <TableHead className='w-20 text-right'>{t('actions')}</TableHead>
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
                    {employee.role.name || 'N/A'}
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
                        <Link href={`/employees/${employee.employeeId}/edit`}>
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
                icon={Users}
                title={
                  isFiltered ? tEmptyState('title') : tEmptyState('subtitle')
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
  );
}
