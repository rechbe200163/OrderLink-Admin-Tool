import { ProductsBarChart } from '@/components/cards/charts/ProductAmountChartComponent';
import { CustomerGrowthCharts } from '@/components/cards/charts/UserChartComponent';
import { authenticateExternalAPI } from '@/lib/depricated-data/data.externalapi';
import { customerGrowthService } from '@/lib/api/external/concrete/CustomerGrowth';
import { productsAmountService } from '@/lib/api/external/concrete/ProductsAmount';
import { getCookie } from '@/lib/cookies/cookie-managment';

import React from 'react';

export const ProductChartsComponent = async (props: {
  searchParams?: Promise<{
    limit?: string;
    well_stocked?: boolean;
    out_of_stock?: boolean;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20;
  const well_stocked = searchParams?.well_stocked ?? false;
  const out_of_stock = searchParams?.out_of_stock ?? false;

  let token = null;
  token = await getCookie('token');
  console.log('token', token);
  if (!token) {
    token = await authenticateExternalAPI();
    console.log('token', token);
    if (!token) {
      throw new Error('Failed to authenticate');
    }
  }
  const products = await productsAmountService.getProductsGrowth(
    token,
    limit,
    well_stocked,
    out_of_stock
  );

  console.log('products', products);

  return <ProductsBarChart products={products} />;
};
