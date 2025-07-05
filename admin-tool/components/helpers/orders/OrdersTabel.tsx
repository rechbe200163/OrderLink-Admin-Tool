import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { OrdersWithCustomerAndProducts } from '@/lib/types';
import { formatDateTime, formatPrice } from '@/lib/utils';
import ImageComponent from '@/components/images/ImageComponent';
import { Suspense, use } from 'react';
import ImageSkeleton from '@/components/images/ImageSkeleton';
import Link from 'next/link';
import { Package } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Product } from '@prisma/client';
import { useTranslations } from 'next-intl';

export function OrderTable({
  orders,
}: {
  orders: OrdersWithCustomerAndProducts[];
}) {
  const t = useTranslations('Dashboard.Ressource.Orders');
  const tOrderState = useTranslations(
    'FilterAndSearch.Filter.OrderState.options'
  );
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='max-h-[50vh] min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
            <TableRow className='hover:bg-muted/50'>
              <TableHead className='w-40'>{t('Attributes.customer')}</TableHead>
              <TableHead className='w-40'>
                {t('Attributes.orderDate')}
              </TableHead>
              <TableHead className='w-60'>
                {t('Attributes.deliveryDate')}
              </TableHead>
              <TableHead className='w-40'>
                {t('Attributes.orderState')}
              </TableHead>
              <TableHead className='w-40 text-right'>
                {t('Attributes.deliveryMethode')}
              </TableHead>
              <TableHead className='w-40 text-right'>
                {t('Attributes.Products.title')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.orderId}
                  className='hover:bg-muted/50 transition-colors'
                >
                  <TableCell className='w-40 font-medium'>
                    <Link
                      href={`/customers/${order.customer.customerReference}/edit`}
                      className='hover:underline'
                    >
                      {order.customer.lastName} {order.customer.firstName}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40'>
                    <Link
                      href={`/orders/${order.orderId}/edit`}
                      className='hover:underline'
                    >
                      {formatDateTime(order.orderDate)}
                    </Link>
                  </TableCell>
                  <TableCell className='w-60'>
                    <Link
                      href={`/orders/${order.orderId}/edit`}
                      className='hover:underline'
                    >
                      {order.deliveryDate ? (
                        formatDateTime(order.deliveryDate)
                      ) : (
                        <Badge variant='destructive'>
                          {t('Attributes.notDeliveredYet')}
                        </Badge>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className='w-40'>
                    <Link
                      href={`/orders/${order.orderId}/edit`}
                      className='hover:underline'
                    >
                      <Badge variant='success'>
                        {tOrderState(`${order.orderState.toLowerCase()}`)}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 text-right'>
                    <Link
                      href={`/orders/${order.orderId}/edit`}
                      className='hover:underline'
                    >
                      <Badge
                        variant={order.selfCollect ? 'success' : 'secondary'}
                      >
                        {order.selfCollect ? (
                          <>{t('Attributes.selfCollect')}</>
                        ) : (
                          <>{t('Attributes.selfCollectNo')}</>
                        )}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className='w-40 text-right'>
                    <Accordion type='single' collapsible>
                      <AccordionItem value={order.orderId} className='border-0'>
                        <AccordionTrigger className='flex h-full py-0 hover:underline'>
                          {t('Attributes.Products.title')}
                        </AccordionTrigger>
                        <AccordionContent>
                          <OrderProductsTable products={order.products} />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-4'>
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

function OrderProductsTable({
  products,
}: {
  products: { product: Product; productAmount: number }[];
}) {
  const t = useTranslations('Dashboard.Ressource.Orders.Attributes.Products');
  return (
    <div className='py-4'>
      <h4 className='text-sm font-medium mb-2 flex items-center gap-2'>
        <Package className='h-4 w-4' />
        Order Products
      </h4>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16'>{t('Product.image')}</TableHead>
              <TableHead>{t('title')}</TableHead>
              <TableHead>{t('price')}</TableHead>
              <TableHead className='text-center'>{t('quantity')}</TableHead>
              <TableHead className='text-right'>{t('total')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map(({ product, productAmount }) => (
                <TableRow key={product.productId} className='hover:bg-muted/50'>
                  <TableCell className='w-16 h-16 p-2'>
                    <Suspense fallback={<ImageSkeleton />}>
                      <div className='relative w-12 h-12 overflow-hidden rounded-md'>
                        {product.imagePath ? (
                          <ImageComponent
                            imagePath={product.imagePath || '/placeholder.svg'}
                            alt={product.name}
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className='w-full h-full bg-muted flex items-center justify-center'>
                            <Package className='h-6 w-6 text-muted-foreground' />
                          </div>
                        )}
                      </div>
                    </Suspense>
                  </TableCell>
                  <TableCell className='font-medium'>{product.name}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell className='text-center'>{productAmount}</TableCell>
                  <TableCell className='text-right'>
                    {formatPrice(product.price * productAmount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-4'>
                  {t('noProductsInOrder')}
                </TableCell>
              </TableRow>
            )}
            {products.length > 0 && (
              <TableRow>
                <TableCell colSpan={4} className='text-right font-medium'>
                  {t('orderTotal')}
                </TableCell>
                <TableCell className='text-right font-bold'>
                  {formatPrice(
                    products.reduce(
                      (total, { product, productAmount }) =>
                        total + product.price * productAmount,
                      0
                    )
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
