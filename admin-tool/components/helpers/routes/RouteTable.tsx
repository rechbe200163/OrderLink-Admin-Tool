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

export function RoutesTable({ routes }: { routes: RoutesWithCount[] }) {
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-sm'>
      <div className='max-h-[50vh] overflow-auto min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-sm'>
            <TableRow className='hover:bg-muted/50'>
              <TableHead className='w-40'>Name</TableHead>
              <TableHead className='w-40 text-center'>Orders Count</TableHead>
              <TableHead className='w-40 text-center'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.length > 0 ? (
              routes.map((route) => (
                <TableRow
                  key={route.routeId}
                  className='hover:bg-muted/50 transition-colors cursor-pointer'
                >
                  {/* Route Name */}
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/routes/${route.routeId}/edit`}
                      className='block w-full h-full hover:underline'
                    >
                      {route.name}
                    </Link>
                  </TableCell>

                  {/* Orders Count with Tooltip */}
                  <TableCell className='w-40 text-center'>
                    <ToolTipWrapper label='Click for order details'>
                      <Link
                        href={`/orders/routes/${route.routeId}/${route.name}`}
                        className='block w-full h-full p-2 hover:underline'
                      >
                        {route._count?.order ?? 0}
                      </Link>
                    </ToolTipWrapper>
                  </TableCell>

                  {/* Route Status */}
                  <TableCell className='w-40 text-center'>
                    <Link
                      href={`/routes/${route.routeId}/edit`}
                      className='hover:underline'
                    >
                      {route.deleted ? (
                        <Badge variant='destructive'>Deleted</Badge>
                      ) : (
                        <Badge variant='success'>Active</Badge>
                      )}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className='text-center py-4'>
                  No routes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
