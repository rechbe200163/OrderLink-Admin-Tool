import { ProductsBarChart } from "@/components/cards/charts/ProductAmountChartComponent";
import { dataAnalysisService } from "@/lib/api/concrete/data-analysis";
import { getTranslations } from "next-intl/server";

export default async function ProductsStockPage() {

  const t = await getTranslations('Dashboard.Ressource.Products.Stock');

  const wellStockData = await dataAnalysisService.getProductsAmount(true, false, 5);

  const outOfStockData = await dataAnalysisService.getProductsAmount(false, true, 5);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main w-full max-w-none'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              <div className="grid grid-cols-1 grid-rows-2 gap-4 w-full">
                <ProductsBarChart products={wellStockData.products} cardDescription={t('title') + " " + t('wellStocked')} cardTitle={t('description')} />
                <ProductsBarChart products={outOfStockData.products} cardDescription={t('title') + " " + t('outOfStock')} cardTitle={t('description')} />
              </div>
            </div>
        </div>
      </div>
  );
}