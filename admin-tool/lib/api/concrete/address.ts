'server only';
import { Address } from '@prisma/client';
import { BaseApiService } from '../base';
import { GetAddressesPaging } from '@/lib/types';

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

  // TODO on backend
  async getAddressesPaging(
    page: number,
    limit: number,
    query?: string,
    filter?: string,
    tag?: string
  ): Promise<GetAddressesPaging> {
    return this.get<GetAddressesPaging>('addresses', {
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
