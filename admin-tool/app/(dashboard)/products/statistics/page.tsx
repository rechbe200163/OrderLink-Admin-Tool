import { ProductChartsComponent } from '@/components/helpers/products/ProductsChartsCompoent';
import React from 'react';
import { redirect } from 'next/navigation';
import { isModuleEnabled } from '@/lib/modules';

export default async function ProductStatisticsPage() {
  if (!(await isModuleEnabled('STATISTICS')))
    redirect('/upgrade?module=STATISTICS');
  return <ProductChartsComponent />;
}
