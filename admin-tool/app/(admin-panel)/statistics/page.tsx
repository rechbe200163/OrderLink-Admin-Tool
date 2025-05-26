import { CustomerChartsComponent } from '@/components/helpers/charts/CustomerChartsComponent';
import { OrdersChartsComponent } from '@/components/helpers/charts/OrdersChartsComponent';
import { ProductChartsComponent } from '@/components/helpers/charts/ProductsChartsCompoent';
import TabView from '@/components/TabView';
import { Box, Package, Route, UsersRound, ChartLine } from 'lucide-react';
import React from 'react';

export default async function StatisticsPage() {
  const tabs = [
    {
      value: 'tab-1',
      label: 'Kunden',
      icon: UsersRound,
      content: CustomerChartsComponent,
    },
    {
      value: 'tab-2',
      label: 'Produkte',
      icon: Package,
      content: ProductChartsComponent,
    },
    {
      value: 'tab-3',
      label: 'Kategorien',
      icon: Box,
      content: () => <div>Categories Data</div>,
    },
    {
      value: 'tab-4',
      label: 'Routen',
      icon: Route,
      content: () => <div>Routes Data</div>,
    },
    {
      value: 'tab-5',
      label: 'Bestellungen',
      icon: ChartLine,
      content: OrdersChartsComponent,
    },
  ];

  return <TabView tabs={tabs} />;
}
