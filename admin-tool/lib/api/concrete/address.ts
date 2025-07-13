'server only';
import { Address } from '@/lib/types';
import { BaseApiService } from '../base';
import { PagingDto } from '@/lib/dtos';

class AddressApiService extends BaseApiService {
  private static instance: AddressApiService;

  static getInstance(): AddressApiService {
    if (!this.instance) {
      this.instance = new AddressApiService();
    }

    return this.instance;
  }

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || '');
  }

  async getCustomerAddress(customerReference: number): Promise<Address> {
    return this.get<Address>(`addresses/${customerReference}`);
  }

  async getAddresses(): Promise<Address[]> {
    return this.get<Address[]>('addresses/all');
  }

  async getAddressesPaging(
    page: number,
    limit: number,
    query?: string,
    filter?: string,
    tag?: string
  ): Promise<PagingDto<Address>> {
    return this.get<PagingDto<Address>>('addresses', {
      page,
      limit,
      query,
      filter,
      tag,
    });
  }

  async getAddressById(addressId: string): Promise<Address> {
    return this.get<Address>(`addresses/${addressId}`);
  }
}

export const addressApiService = AddressApiService.getInstance();
