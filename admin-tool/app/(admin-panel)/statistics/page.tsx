import { CustomerChartsComponent } from '@/components/helpers/charts/CustomerChartsComponent';
import { ProductChartsComponent } from '@/components/helpers/charts/ProductsChartsCompoent';
import TabView from '@/components/TabView';
import { Box, Package, Route, UsersRound, ChartLine } from 'lucide-react';
import React from 'react';

export default async function StatisticsPage() {
  const tabs = [
    {
      value: 'tab-1',
      label: 'Customers',
      icon: UsersRound,
      content: CustomerChartsComponent,
    },
    {
      value: 'tab-2',
      label: 'Products',
      icon: Package,
      content: ProductChartsComponent,
    },
    {
      value: 'tab-3',
      label: 'Categories',
      icon: Box,
      content: () => <div>Categories Data</div>,
    },
    {
      value: 'tab-4',
      label: 'Routes',
      icon: Route,
      content: () => <div>Routes Data</div>,
    },
    {
      value: 'tab-5',
      label: 'Sales',
      icon: ChartLine,
      content: () => <div>Sales Data</div>,
    },
  ];

  return <TabView tabs={tabs} />;
}
