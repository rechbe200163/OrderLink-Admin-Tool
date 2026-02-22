import { OrderAmountChart } from '@/components/cards/charts/OrderAmountChart';
import { dataAnalysisService } from '@/lib/api/concrete/data-analysis';

export default async function OrderDtaPage(props: {
  searchParams?: Promise<{
    last_days?: string;
    month?: boolean;
    year?: boolean;
    show_zeros?: boolean;
  }>;
}) {
  const searchParams = await props.searchParams;
  const last_days = searchParams?.last_days
    ? parseInt(searchParams.last_days)
    : undefined;
  const month = searchParams?.month ?? false;
  const year = searchParams?.year ?? false;
  const show_zeros = searchParams?.show_zeros ?? true;

  const orderAmount = await dataAnalysisService.getOrderAmount(
    last_days,
    month,
    year,
    show_zeros,
  );

  return (
    <div className='px-5 pt-5'>
      <OrderAmountChart chartData={orderAmount} />
    </div>
  );
}
