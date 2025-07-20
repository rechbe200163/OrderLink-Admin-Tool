import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ProductHistory } from '@/lib/types';
import { formatDateTime, formatPrice } from '@/lib/utils';
import ImageComponent from '@/components/images/ImageComponent';
import { Suspense } from 'react';
import ImageSkeleton from '@/components/images/ImageSkeleton';

export function ProductHistoryTable({ history }: { history: ProductHistory[] }) {
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='[&>div]:max-h-[50vh] min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-20'>Bild</TableHead>
              <TableHead className='w-40'>Name</TableHead>
              <TableHead className='w-40'>Preis</TableHead>
              <TableHead className='w-60'>Beschreibung</TableHead>
              <TableHead className='w-40 text-right'>Lager</TableHead>
              <TableHead className='w-40 text-right'>Erstellt am</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length > 0 ? (
              history.map((item) => (
                <TableRow
                  key={item.historieId}
                  className='hover:bg-muted/50 transition-colors'
                >
                  <TableCell className='w-20 flex items-center justify-center p-2'>
                    <Suspense fallback={<ImageSkeleton />}>
                      <div className='relative w-16 h-16 overflow-hidden rounded-md'>
                        {item.imagePath ? (
                          <ImageComponent
                            imagePath={item.imagePath}
                            alt={item.name}
                            width={64}
                            height={64}
                          />
                        ) : (
                          <div className='w-full h-full bg-muted flex items-center justify-center'>
                            <span className='text-muted-foreground text-sm'>Kein Bild</span>
                          </div>
                        )}
                      </div>
                    </Suspense>
                  </TableCell>
                  <TableCell className='w-40'>{item.name}</TableCell>
                  <TableCell className='w-40'>{formatPrice(item.price)}</TableCell>
                  <TableCell className='w-60 truncate max-w-xs'>
                    {item.description || 'Keine Beschreibung'}
                  </TableCell>
                  <TableCell className='w-40 text-right'>{item.stock}</TableCell>
                  <TableCell className='w-40 text-right'>
                    {formatDateTime(item.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-4'>
                  Keine Historie gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

