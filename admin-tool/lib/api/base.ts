import { hasPermission } from '../utlis/getSession';

export class BaseApiService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async fetchFromApi<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    action: 'read' | 'write' = 'read',
    options?: RequestInit
  ): Promise<T> {
    const ressource = endpoint.split('?')[0].split('/')[0];
    if (!(await hasPermission(ressource, action))) {
      throw new Error(`Unauthorized: No ${action} access to ${endpoint}`);
    }

    const url = new URL(`${this.baseUrl}/${endpoint}`);

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
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Request failed with status ${response.status}`
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
