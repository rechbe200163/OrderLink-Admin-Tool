import { StockBarChart } from '@/components/cards/charts/StockBarChart';
import { dataAnalysisService } from '@/lib/api/concrete/data-analysis';
import { getTranslations } from 'next-intl/server';

export default async function ProductsStockPage() {
  const t = await getTranslations('Dashboard.Ressource.Products.Stock');

  const wellStockData = await dataAnalysisService.getProductsAmount(
    true,
    false,
    5,
  );
  const outOfStockData = await dataAnalysisService.getProductsAmount(
    false,
    true,
    5,
  );

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main w-full max-w-none px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-6'>
          <header className='space-y-1'>
            <h1 className='text-xl font-semibold tracking-tight'>
              {t('title')}
            </h1>
            <p className='text-sm text-muted-foreground'>{t('description')}</p>
          </header>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <StockBarChart
              products={wellStockData.products}
              cardTitle={t('wellStocked')}
              cardDescription='Produkte mit ausreichend Lagerbestand'
              type='high'
              limit={5}
            />

            <StockBarChart
              products={outOfStockData.products}
              cardTitle={t('outOfStock')}
              cardDescription='Kritische Produkte – Nachbestellung empfohlen'
              type='low'
              limit={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
