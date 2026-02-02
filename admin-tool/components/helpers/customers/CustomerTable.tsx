import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import CopyToClipboard from '../CopyOrderId';
import UserAvatarComponent from './UserAvatarComponent';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Customer } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, UserCircle } from 'lucide-react';
import { EmptyState, TableEmptyState } from '@/components/ui/empty-state';

interface CustomerTableProps {
  customers: Customer[];
  searchQuery?: string;
  businessSectorFilter?: string;
}

export function CustomerTable({
  customers,
  searchQuery,
  businessSectorFilter,
}: CustomerTableProps) {
  const t = useTranslations('Dashboard.Ressource.Customers.Attributes');
  const tButtons = useTranslations('Dashboard.Ressource.Customers.buttons');
  const tStatus = useTranslations('Dashboard.Ressource.Customers.Status');
  const tEmptyState = useTranslations('Dashboard.Ressource.Customers.EmptyState');
  const isFiltered = !!(searchQuery || businessSectorFilter);
  
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
        <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
          <TableRow className='hover:bg-muted'>
            <TableHead className='w-20'>{t('avatar')}</TableHead>
            <TableHead className='w-40'>{t('name')}</TableHead>
            <TableHead className='w-60'>{t('email')}</TableHead>
            <TableHead className='w-40'>{t('phone')}</TableHead>
            <TableHead className='w-60'>
              {t('customerReference')}
            </TableHead>
            <TableHead className='w-40 text-right'>
              {t('businessSector')}
            </TableHead>
            <TableHead className='w-40 text-right'>
              {t('status')}
            </TableHead>
            <TableHead className='w-20 text-right'>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow
                key={customer.customerReference}
                className='hover:bg-muted'
              >
                <TableCell className='w-20 font-medium'>
                  <UserAvatarComponent avatarPath={customer.avatarPath!} />
                </TableCell>
                <TableCell className='w-40 font-medium'>
                  <Link
                    href={`/customers/${customer.customerReference}/edit`}
                    className='hover:underline'
                  >
                    {customer.firstName} {customer.lastName}
                  </Link>
                </TableCell>
                <TableCell className='w-60'>
                  <Link
                    href={`/customers/${customer.customerReference}/edit`}
                    className='hover:underline'
                  >
                    {customer.email}
                  </Link>
                </TableCell>
                <TableCell className='w-40'>
                  <Link
                    href={`/customers/${customer.customerReference}/edit`}
                    className='hover:underline'
                  >
                    {customer.phoneNumber}
                  </Link>
                </TableCell>
                <TableCell className='w-60'>
                  <div className='flex justify-between'>
                    <Link
                      href={`/customers/${customer.customerReference}/edit`}
                      className='hover:underline'
                    >
                      {customer.customerReference}
                    </Link>
                    <CopyToClipboard value={customer.customerReference + ''} />
                  </div>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`/customers/${customer.customerReference}/edit`}
                    className='hover:underline'
                  >
                    {customer.businessSector || 'N/A'}
                  </Link>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`/customers/${customer.customerReference}/edit`}
                    className='hover:underline'
                  >
                    {customer.deleted ? (
                      <Badge variant={'destructive'}>
                        {tStatus('inactive')}
                      </Badge>
                    ) : (
                      <Badge variant={'success'}>{tStatus('active')}</Badge>
                    )}
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
                          href={`/customers/${customer.customerReference}/edit`}
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
            <TableEmptyState colSpan={8}>
              <EmptyState
                icon={UserCircle}
                title={
                  isFiltered
                    ? tEmptyState('title')
                    : tEmptyState('subtitle')
                }
                description={tEmptyState('description')}
                isFiltered={isFiltered}
                filterMessage={
                  searchQuery || businessSectorFilter
                    ? `${searchQuery ? `Suche: "${searchQuery}"` : ''}${businessSectorFilter ? ` | Branche: ${businessSectorFilter}` : ''}`
                    : undefined
                }
              />
            </TableEmptyState>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
