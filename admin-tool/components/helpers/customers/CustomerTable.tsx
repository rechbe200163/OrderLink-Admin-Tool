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
import { useOptimisticCustomers } from './CustomerProvider';

export function CustomerTable() {
  const t = useTranslations('Dashboard.Ressource.Customers');
  const { customers } = useOptimisticCustomers();
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='[&>div]:max-h-[50vh] min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-20'>{t('Attributes.avatar')}</TableHead>
              <TableHead className='w-40'>{t('Attributes.name')}</TableHead>
              <TableHead className='w-60'>{t('Attributes.email')}</TableHead>
              <TableHead className='w-40'>{t('Attributes.phone')}</TableHead>
              <TableHead className='w-60'>
                {t('Attributes.customerReference')}
              </TableHead>
              <TableHead className='w-40 text-right'>
                {t('Attributes.businessSector')}
              </TableHead>
              <TableHead className='w-40 text-right'>
                {t('Attributes.status')}
              </TableHead>
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
                      <CopyToClipboard
                        value={customer.customerReference + ''}
                      />
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
                          {t('Status.inactive')}
                        </Badge>
                      ) : (
                        <Badge variant={'success'}>{t('Status.active')}</Badge>
                      )}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='text-center'>
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
