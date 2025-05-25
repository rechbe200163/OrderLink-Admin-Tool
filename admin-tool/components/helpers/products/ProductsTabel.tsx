import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@prisma/client';
import { formatDateTime, formatPrice } from '@/lib/utils';
import ImageComponent from '@/components/images/ImageComponent';
import { Suspense } from 'react';
import ImageSkeleton from '@/components/images/ImageSkeleton';
import Link from 'next/link';

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-sm'>
      <div className='max-h-[50vh] overflow-auto min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-sm'>
            <TableRow className='hover:bg-muted/50'>
              <TableHead className='w-20'>Image</TableHead>
              <TableHead className='w-40'>Name</TableHead>
              <TableHead className='w-40'>Price</TableHead>
              <TableHead className='w-60'>Description</TableHead>
              <TableHead className='w-40 text-right'>Stock</TableHead>
              <TableHead className='w-40 text-right'>Created At</TableHead>
              <TableHead className='w-40 text-right'>Status</TableHead>
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
                                No Image
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
                      {product.description || 'No description'}
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
                <TableCell colSpan={7} className='text-center py-4'>
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
