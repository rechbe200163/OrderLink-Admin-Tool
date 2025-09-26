import { CustomerChartsComponent } from '@/components/helpers/customers/CustomerChartsComponent';
import React from 'react';
import { redirect } from 'next/navigation';
import { isModuleEnabled } from '@/lib/modules';

export default async function CustomersStatisticsPage() {
  if (!(await isModuleEnabled('STATISTICS')))
    redirect('/upgrade?module=STATISTICS');
  return <CustomerChartsComponent />;
}
