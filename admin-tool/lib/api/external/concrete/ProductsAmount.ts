import { ExternalApiService } from '../../externalBase';

export type ProductsAmount = {
  products: Record<string, number>;
};

class ProductsAmountServie extends ExternalApiService {
  private static instance: ProductsAmountServie;

  private constructor() {
    super();
  }

  static getInstance(): ProductsAmountServie {
    if (!ProductsAmountServie.instance) {
      ProductsAmountServie.instance = new ProductsAmountServie();
    }
    return ProductsAmountServie.instance;
  }

  async getProductsGrowth(
    token: string,
    limit: number = 10,
    well_stocked: boolean = false,
    out_of_stock: boolean = false
  ): Promise<ProductsAmount> {
    try {
      const params: Record<string, string> = {
        limit: String(limit),
      };

      if (well_stocked) params.well_stocked = 'true';
      if (out_of_stock) params.out_of_stock = 'true';

      const data = await this.fetchFromExternalApi<any>(
        token,
        'descriptive/products-amount/',
        params,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
      );

      return data.products;
    } catch (error) {
      console.error('Error fetching products growth:', error);
      return { products: {} };
    }
  }
}

export const productsAmountService = ProductsAmountServie.getInstance();
