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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, MapPinned } from 'lucide-react';
import { EmptyState, TableEmptyState } from '@/components/ui/empty-state';

interface AddressTableProps {
  addresses: Address[];
  searchQuery?: string;
}

export function AddressTable({ addresses, searchQuery }: AddressTableProps) {
  const t = useTranslations('Dashboard.Ressource.Address.Attributes');
  const tButtons = useTranslations('Dashboard.Ressource.Address.buttons');
  const tStatus = useTranslations('Dashboard.Ressource.Address.Status');
  const tEmptyState = useTranslations('Dashboard.Ressource.Address.EmptyState');
  const isFiltered = !!searchQuery;
  
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
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
            <TableHead className='w-20 text-right'>{t('actions')}</TableHead>
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
                      {address.deleted ? tStatus('inactive') : tStatus('active')}
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
                        <Link href={`/addresses/${address.addressId}/edit`}>
                          {tButtons('editButton')}
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem disabled>
                        {tButtons('delete')}
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState colSpan={8}>
              <EmptyState
                icon={MapPinned}
                title={
                  isFiltered
                    ? tEmptyState('title')
                    : tEmptyState('subtitle')
                }
                description={tEmptyState('description')}
                isFiltered={isFiltered}
                filterMessage={searchQuery ? `${searchQuery}` : undefined}
              />
            </TableEmptyState>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
