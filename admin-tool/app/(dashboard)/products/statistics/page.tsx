import { ProductChartsComponent } from '@/components/helpers/products/ProductsChartsCompoent';
import React from 'react';
import { redirect } from 'next/navigation';

export default async function ProductStatisticsPage() {
  return <ProductChartsComponent />;
}
