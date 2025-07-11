import { ApiError } from './ApiError';
import { redirect } from 'next/navigation';

export class ExternalApiService {
  protected baseUrl: string;

  constructor() {
    const externalApiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API;
    if (!externalApiUrl) {
      throw new Error('NEXT_PUBLIC_EXTERNAL_API is not defined');
    }
    this.baseUrl = externalApiUrl;
  }

  protected async fetchFromExternalApi<T>(
    token: string,
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    options?: RequestInit
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);

    url.searchParams.append('token', token);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
          redirect(
            `/unauthorized?message=${encodeURIComponent(
              errorData.message || errorData.error || 'Access denied'
            )}`
          );
        }

        throw new ApiError(
          errorData.message ||
            errorData.error ||
            `Request failed with status ${response.status}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw new Error(
        `Failed to fetch data from: ${endpoint}` + ' ' + '|' + ' ' + error
      );
    }
  }
}
