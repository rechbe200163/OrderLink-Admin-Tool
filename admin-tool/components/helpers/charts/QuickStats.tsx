import { CustomerBusinessTypeDistrubution } from '@/components/cards/charts/CustomerBusinessTypeDistrubution copy';
import { OrderStateDistributionChart } from '@/components/cards/charts/OrderStateDistribution';
import { statisticsApiService } from '@/lib/api/concrete/statistics';

const QuickStats = async () => {
  const customerCountData = await statisticsApiService.getCustomerCount();
  const data = await statisticsApiService.getOrderStateCount();

  return (
    <div className='grid grid-cols-1 gap-4 px-4 data-[slot=card]:*:shadow-2xs data-[slot=card]:*:bg-linear-to-t data-[slot=card]:*:from-primary/5 data-[slot=card]:*:to-card dark:data-[slot=card]:*:bg-card sm:grid-cols-2 lg:px-6'>
      <CustomerBusinessTypeDistrubution data={customerCountData} />
      <OrderStateDistributionChart data={data} />
    </div>
  );
};

export default QuickStats;
