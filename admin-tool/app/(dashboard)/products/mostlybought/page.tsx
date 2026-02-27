import { ProductsMostlyBought } from "@/components/cards/charts/ProductsMostlyBought";
import { dataAnalysisService } from "@/lib/api/concrete/data-analysis";
import { getTranslations } from "next-intl/server";

export default async function ProductsMostlyBoughtPage() {

  const t = await getTranslations('Dashboard.Ressource.Products.MostlyBought');

  const monthdata = await dataAnalysisService.getProductsMostlyBought(0, false, true, 5);

  const yearData = await dataAnalysisService.getProductsMostlyBought(0, true, false, 5);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main w-full max-w-none'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              <div className="grid grid-cols-1 grid-rows-2 gap-4 w-full">
                    {/* TODO: CARD mit Topseller? */}
                    <ProductsMostlyBought products={monthdata.products} cardTitle={t("title") + " " + t("monthlyTimeframe")} cardDescription={t("description")} />
                    <ProductsMostlyBought products={yearData.products} cardTitle={t("title") + " " + t("yearlyTimeframe")} cardDescription={t("description")} />
              </div>
            </div>
        </div>
      </div>
  );
}