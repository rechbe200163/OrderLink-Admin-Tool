import { CustomerGrowthCharts } from '@/components/cards/charts/UserChartComponent';
import { authenticateExternalAPI } from '@/lib/depricated-data/data.externalapi';
import { customerGrowthService } from '@/lib/api/external/concrete/CustomerGrowth';
import { getCookie } from '@/lib/cookies/cookie-managment';

import React from 'react';

export const CustomerChartsComponent = async () => {
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
  const chartData = await customerGrowthService.getCustomerGrowth(token);

  return <CustomerGrowthCharts chartData={chartData} />;
};
