import { productApiService } from '@/lib/api/concrete/products';
import { ProductHistoryTable } from '@/components/helpers/products/ProductHistoryTable';
import React from 'react';

interface HistoryPageProps {
  params: Promise<{ productId: string }>;
}

async function HistoryPage(props: HistoryPageProps) {
  const { productId } = await props.params;
  const history = await productApiService.getProductHistory(productId);

  console.log('Product History:', history);

  return (
    <div className='p-5'>
      <ProductHistoryTable history={history} />
    </div>
  );
}

export default HistoryPage;
