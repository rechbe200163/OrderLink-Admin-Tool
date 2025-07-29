import { OrdersChartsComponent } from '@/components/helpers/orders/OrdersChartsComponent';
import React from 'react';
import { redirect } from 'next/navigation';
import { isModuleEnabled } from '@/lib/modules';

export default async function OrdersStatisticsPage() {
  if (!(await isModuleEnabled('STATISTICS')))
    redirect('/upgrade?module=STATISTICS');
  return <OrdersChartsComponent />;
}
