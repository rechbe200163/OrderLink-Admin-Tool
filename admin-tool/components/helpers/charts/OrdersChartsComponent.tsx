import { ProductsBarChart } from '@/components/cards/charts/ProductAmountChartComponent';
import { authenticateExternalAPI } from '@/lib/depricated-data/data.externalapi';
import { productsAmountService } from '@/lib/api/external/concrete/ProductsAmount';
import { getCookie } from '@/lib/cookies/cookie-managment';

import React from 'react';
import { ProductsMostlyBought } from '@/components/cards/charts/ProductsMostlyBought';
import { ordersStatsService } from '@/lib/api/external/concrete/OrderStatsService';
import { OrderAmountChart } from '@/components/cards/charts/OrderAmountcChart';

export const OrdersChartsComponent = async (props: {
  searchParams?: Promise<{
    limit?: string;
    well_stocked?: boolean;
    out_of_stock?: boolean;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const well_stocked = searchParams?.well_stocked ?? false;
  const out_of_stock = searchParams?.out_of_stock ?? false;

  let token = null;
  token = await getCookie('token');
  if (!token) {
    token = await authenticateExternalAPI();
    if (!token) {
      throw new Error('Failed to authenticate');
    }
  }
  const orders = await ordersStatsService.getProductsGrowth(
    token,
    limit,
    well_stocked,
    out_of_stock
  );

  return (
    <>
      <OrderAmountChart chartData={orders} />
    </>
  );
};
