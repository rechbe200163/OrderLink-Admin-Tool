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
import { Address } from '@/lib/types';

export function AddressTable({ addresses }: { addresses: Address[] }) {
  const t = useTranslations('Dashboard.Ressource.Address.Attributes');
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='[&>div]:max-h-[50vh] min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-40'>{t('country')}</TableHead>
              <TableHead className='w-40'>{t('state')}</TableHead>
              <TableHead className='w-40'>{t('city')}</TableHead>
              <TableHead className='w-40'>{t('postCode')}</TableHead>
              <TableHead className='w-40'>{t('streetName')}</TableHead>
              <TableHead className='w-40'>{t('streetNumber')}</TableHead>
              <TableHead className='w-40 text-right'>{t('status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <TableRow
                  key={address.addressId}
                  className='hover:bg-muted/50 transition-colors'
                >
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/addresses/${address.addressId}/edit`}
                      className='hover:underline'
                    >
                      {address.country || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/addresses/${address.addressId}/edit`}
                      className='hover:underline'
                    >
                      {address.state || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/addresses/${address.addressId}/edit`}
                      className='hover:underline'
                    >
                      {address.city || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/addresses/${address.addressId}/edit`}
                      className='hover:underline'
                    >
                      {address.postCode || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/addresses/${address.addressId}/edit`}
                      className='hover:underline'
                    >
                      {address.streetName || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/addresses/${address.addressId}/edit`}
                      className='hover:underline'
                    >
                      {address.streetNumber || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 text-right'>
                    <Link
                      href={`/addresses/${address.addressId}/edit`}
                      className='hover:underline'
                    >
                      <Badge
                        variant={address.deleted ? 'destructive' : 'success'}
                      >
                        {address.deleted ? 'Inactive' : 'Active'}
                      </Badge>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='text-center'>
                  No addresses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
