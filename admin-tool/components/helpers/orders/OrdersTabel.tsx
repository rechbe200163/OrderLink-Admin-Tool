'use client';

import React from 'react';

import { useState } from 'react'; // Import useState for managing expanded state
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button for the expand/collapse trigger
import type { OrdersWithCustomerAndProducts, Product } from '@/lib/types';
import { formatDateTime, formatPrice } from '@/lib/utils';
import Image from 'next/image'; // Use next/image for optimized images
import { Suspense } from 'react';
import ImageSkeleton from '@/components/images/ImageSkeleton';
import Link from 'next/link';
import { Package, ChevronDown } from 'lucide-react'; // ChevronDown for the expand/collapse icon
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

  // State to manage which order's product details are currently expanded
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Function to toggle the expanded state for a given orderId
  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <div className='max-h-[50vh] min-w-full overflow-auto'>
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
              {/* This column is now dedicated to the expand/collapse button */}
              <TableHead className='w-10 text-center'>
                <span className='sr-only'>
                  {t('Attributes.Products.title')}
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                // Use React.Fragment to group the main row and the expandable row
                <React.Fragment key={order.orderId}>
                  <TableRow className='hover:bg-muted/50 transition-colors'>
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
                    {/* Cell for the expand/collapse button */}
                    <TableCell className='w-10 text-center'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => toggleExpand(order.orderId)}
                        aria-expanded={expandedOrderId === order.orderId}
                        aria-controls={`products-row-${order.orderId}`}
                        className='h-auto w-auto p-1' // Adjust padding/size for the button
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            expandedOrderId === order.orderId
                              ? 'rotate-180'
                              : ''
                          }`}
                        />
                        <span className='sr-only'>
                          {expandedOrderId === order.orderId
                            ? 'Collapse'
                            : 'Expand'}{' '}
                          products for order {order.orderId}
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  {/* Conditionally rendered row for product details */}
                  {expandedOrderId === order.orderId && (
                    <TableRow
                      id={`products-row-${order.orderId}`}
                      className='bg-muted/20'
                    >
                      {/* This cell spans all columns to contain the product table */}
                      <TableCell colSpan={6} className='p-0'>
                        <OrderProductsTable products={order.products} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
    <div className='py-4 px-4'>
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
                          <Image
                            src={product.imagePath || '/placeholder.svg'}
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
