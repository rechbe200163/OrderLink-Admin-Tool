import { ProductsBarChart } from '@/components/cards/charts/ProductAmountChartComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataAnalysisService } from '@/lib/api/concrete/data-analysis';
import { CalendarDays } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ProductsMostlyBoughtPage() {
  const t = await getTranslations('Dashboard.Ressource.Products.MostlyBought');

  const monthdata = await dataAnalysisService.getProductsMostlyBought(
    0,
    false,
    true,
    5,
  );
  const yearData = await dataAnalysisService.getProductsMostlyBought(
    0,
    true,
    false,
    5,
  );

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main w-full max-w-none px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 md:gap-6'>
          {/* Optional: Page header */}
          <div className='space-y-1'>
            <h1 className='text-xl font-semibold tracking-tight'>
              {t('title')}
            </h1>
            <p className='text-sm text-muted-foreground'>{t('description')}</p>
          </div>
          <Tabs defaultValue='monthly' className='w-full'>
            <TabsList className='self-start'>
              <TabsTrigger value='monthly' className='gap-1.5'>
                <CalendarDays className='size-4' />
                Monthly
              </TabsTrigger>
              <TabsTrigger value='yearly' className='gap-1.5'>
                <CalendarDays className='size-4' />
                Yearly
              </TabsTrigger>
            </TabsList>

            <TabsContent value='monthly'>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <ProductsBarChart
                  products={monthdata.products}
                  cardTitle={`${t('title')} ${t('monthlyTimeframe')}`}
                  cardDescription={t('description')}
                />
              </div>
            </TabsContent>

            <TabsContent value='yearly'>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <ProductsBarChart
                  products={yearData.products}
                  cardTitle={`${t('title')} ${t('yearlyTimeframe')}`}
                  cardDescription={t('description')}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
