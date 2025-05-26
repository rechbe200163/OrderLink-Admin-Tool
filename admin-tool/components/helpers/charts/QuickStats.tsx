import { CustomerBusinessTypeDistrubution } from '@/components/cards/charts/CustomerBusinessTypeDistrubution';

const QuickStats = async () => {
  return (
    <div className='flex flex-col px-4 lg:px-6'>
      <CustomerBusinessTypeDistrubution />
      <CustomerBusinessTypeDistrubution />
    </div>
  );
};

export default QuickStats;
