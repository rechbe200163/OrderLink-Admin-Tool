import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ProductHistory } from '@/lib/types';
import { formatDateTimeWithTime, formatPrice, cn } from '@/lib/utils';
import ImageComponent from '@/components/images/ImageComponent';
import { Suspense } from 'react';
import ImageSkeleton from '@/components/images/ImageSkeleton';

export function ProductHistoryTable({
  history,
}: {
  history: ProductHistory[];
}) {
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='[&>div]:max-h-[60vh] min-w-full overflow-y-auto'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-10'>Version</TableHead>
              <TableHead className='w-20'>Bild</TableHead>
              <TableHead className='w-40'>Name</TableHead>
              <TableHead className='w-32 text-right'>Preis</TableHead>
              <TableHead className='w-32 text-right'>Lager</TableHead>
              <TableHead className='w-60'>Beschreibung</TableHead>
              <TableHead className='w-40 text-right'>Zeitpunkt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length > 0 ? (
              history.map((item, index) => {
                const prev = history[index + 1]; // Comparison with previous version (lower index)
                const changed = {
                  price: prev?.price !== undefined && prev.price !== item.price,
                  stock: prev?.stock !== undefined && prev.stock !== item.stock,
                  name: prev?.name !== undefined && prev.name !== item.name,
                  description:
                    prev?.description !== undefined &&
                    prev.description !== item.description,
                };
                return (
                  <TableRow
                    key={item.historyId}
                    className='hover:bg-muted/50 transition-colors'
                  >
                    <TableCell className='text-center font-mono text-xs text-muted-foreground'>
                      {item.version}
                    </TableCell>
                    <TableCell className='p-2 flex items-center justify-center'>
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
                              <span className='text-muted-foreground text-sm'>
                                Kein Bild
                              </span>
                            </div>
                          )}
                        </div>
                      </Suspense>
                    </TableCell>
                    <TableCell className='w-40'>
                      <span
                        className={cn(
                          changed.name && 'text-green-600 font-bold'
                        )}
                      >
                        {item.name}
                      </span>
                      {changed.name && prev && (
                        <div className='text-xs text-muted-foreground line-through'>
                          {prev.name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='w-32 text-right'>
                      <span
                        className={cn(
                          changed.price && 'text-green-600 font-bold'
                        )}
                      >
                        {formatPrice(item.price)}
                      </span>
                      {changed.price && prev && (
                        <div className='text-xs text-muted-foreground line-through'>
                          {formatPrice(prev.price)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='w-32 text-right'>
                      <span
                        className={cn(
                          changed.stock && 'text-green-600 font-bold'
                        )}
                      >
                        {item.stock}
                      </span>
                      {changed.stock && prev && (
                        <div className='text-xs text-muted-foreground line-through'>
                          {prev.stock}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='w-60 truncate max-w-xs'>
                      <span
                        className={cn(
                          changed.description && 'text-green-600 font-bold'
                        )}
                      >
                        {item.description || 'Keine Beschreibung'}
                      </span>
                      {changed.description && prev && (
                        <div className='text-xs text-muted-foreground line-through'>
                          {prev.description || 'Keine'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='w-40 text-right'>
                      {formatDateTimeWithTime(item.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='text-center py-4'>
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
