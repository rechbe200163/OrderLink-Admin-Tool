import React from 'react';
import { redirect } from 'next/navigation';
import { isModuleEnabled } from '@/lib/modules';

export default async function RoutesStatisticsPage() {
  if (!(await isModuleEnabled('STATISTICS')))
    redirect('/upgrade?module=STATISTICS');
  return <div>Routes Data</div>;
}
