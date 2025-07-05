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
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='max-h-[50vh] overflow-auto min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted/50'>
              <TableHead className='w-40'>Name</TableHead>
              <TableHead className='w-40 text-center'>Bestellungen</TableHead>
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
                    <ToolTipWrapper label='Klicken für Bestelldetails'>
                      <Link
                        href={`/orders/routes/${route.routeId}/${route.name}`}
                        className='block w-full h-full p-2 hover:underline'
                      >
                        {route._count?.order ?? 0}
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
                        <Badge variant='destructive'>Gelöscht</Badge>
                      ) : (
                        <Badge variant='success'>Aktiv</Badge>
                      )}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className='text-center py-4'>
                  Keine Routen gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
