import Link from 'next/link';
import { Suspense } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import type { Product } from '@/lib/types';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatPrice } from '@/lib/utils';
import ImageSkeleton from '@/components/images/ImageSkeleton';
import ImageComponent from '@/components/images/ImageComponent';

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
        <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
          <TableRow className='hover:bg-muted'>
            <TableHead className='w-20'>Bild</TableHead>
            <TableHead className='w-40'>Name</TableHead>
            <TableHead className='w-40'>Preis</TableHead>
            <TableHead className='w-60'>Beschreibung</TableHead>
            <TableHead className='w-40 text-right'>Lager</TableHead>
            <TableHead className='w-40 text-right'>Erstellt am</TableHead>
            <TableHead className='w-40 text-right'>Status</TableHead>
            <TableHead className='w-20 text-right'>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow
                key={product.productId}
                className='hover:bg-muted/50 transition-colors cursor-pointer'
              >
                <TableCell className='w-20 flex items-center justify-center p-2'>
                  <Link href={`/products/${product.productId}/edit`}>
                    <Suspense fallback={<ImageSkeleton />}>
                      <div className='relative w-16 h-16 overflow-hidden rounded-md'>
                        {product.imagePath ? (
                          <ImageComponent
                            imagePath={product.imagePath}
                            alt={product.name}
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
                  </Link>
                </TableCell>
                <TableCell className='w-40 font-medium'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell className='w-40'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {formatPrice(product.price)}
                  </Link>
                </TableCell>
                <TableCell className='w-60 truncate max-w-xs'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {product.description || 'Keine Beschreibung'}
                  </Link>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {product.stock}
                  </Link>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {formatDateTime(product.createdAt)}
                  </Link>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {product.deleted ? (
                      <Badge variant='destructive'>Gelöscht</Badge>
                    ) : (
                      <Badge variant='success'>Aktiv</Badge>
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
                        <Link href={`/products/${product.productId}/edit`}>
                          Bearbeiten
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.productId}/history`}>
                          Historie
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className='text-center py-4'>
                Keine Produkte gefunden
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
