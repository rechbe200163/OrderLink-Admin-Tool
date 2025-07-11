'server only';
import { Address } from '@/lib/types';

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getAddresses(): Promise<Address[]> {
  try {
    const response = await fetch(`${baseApiUrl}/address`, {
      next: { tags: ['addresses'] },
    });
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch addresses' + error);
  }
}

export async function getCustomerAddress(
  customerReference: number
): Promise<Address> {
  try {
    const response = await fetch(`${baseApiUrl}/address/${customerReference}`, {
      next: { tags: [`address-${customerReference}`] },
    });
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch user address' + error);
  }
}
