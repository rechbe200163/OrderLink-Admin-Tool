import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { RoutesWithCount } from '@/lib/types';
import Link from 'next/link';
import ToolTipWrapper from '@/components/ToolTipWrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, MapPin } from 'lucide-react';
import { EmptyState, TableEmptyState } from '@/components/ui/empty-state';
import { useTranslations } from 'next-intl';

interface RoutesTableProps {
  routes: RoutesWithCount[];
  searchQuery?: string;
}

export function RoutesTable({ routes, searchQuery }: RoutesTableProps) {
  const t = useTranslations('Dashboard.Ressource.Routes.Attributes');
  const tButtons = useTranslations('Dashboard.Ressource.Routes.buttons');
  const tStatus = useTranslations('Dashboard.Ressource.Routes.Status');
  const tEmptyState = useTranslations('Dashboard.Ressource.Routes.EmptyState');
  const isFiltered = !!searchQuery;
  
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
        <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
          <TableRow className='hover:bg-muted/50'>
            <TableHead className='w-20'>{t('name')}</TableHead>
            <TableHead className='w-30 text-center'>{t('orders')}</TableHead>
            <TableHead className='w-30 text-center'>{t('status')}</TableHead>
            <TableHead className='w-20 text-right'>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.length > 0 ? (
            routes.map((route) => (
              <TableRow
                key={route.routeId}
                className='hover:bg-muted/50 transition-colors cursor-pointer'
              >
                {/* Routenname */}
                <TableCell className='w-40 font-medium'>
                  <Link
                    href={`/routes/${route.routeId}/edit`}
                    className='block w-full h-full hover:underline'
                  >
                    {route.name}
                  </Link>
                </TableCell>

                {/* Bestellungen mit Tooltip */}
                <TableCell className='w-40 text-center'>
                  <ToolTipWrapper label={t('clickForOrderDetails')}>
                    <Link
                      href={`/orders/routes/${route.routeId}/${route.name}`}
                      className='block w-full h-full p-2 hover:underline'
                    >
                      {route.ordersCount ?? 0}
                    </Link>
                  </ToolTipWrapper>
                </TableCell>

                {/* Routenstatus */}
                <TableCell className='w-40 text-center'>
                  <Link
                    href={`/routes/${route.routeId}/edit`}
                    className='hover:underline'
                  >
                    {route.deleted ? (
                      <Badge variant='destructive'>{tStatus('inactive')}</Badge>
                    ) : (
                      <Badge variant='success'>{tStatus('active')}</Badge>
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
                        <Link href={`/routes/${route.routeId}/edit`}>
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
            <TableEmptyState colSpan={4}>
              <EmptyState
                icon={MapPin}
                title={
                  isFiltered
                    ? tEmptyState('title')
                    : tEmptyState('subtitle')
                }
                description={tEmptyState('description')}
                isFiltered={isFiltered}
                filterMessage={searchQuery ? `Suche: "${searchQuery}"` : undefined}
              />
            </TableEmptyState>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
