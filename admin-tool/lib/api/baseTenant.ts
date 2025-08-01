'server only';
import { getCookie } from '../cookies/cookie-managment';
import { ApiError } from './ApiError';
import { forbidden } from 'next/navigation';

export class BaseTenantApiService {
  public baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_TENANT_SERVICE || '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    {
      params,
      body,
      headers,
    }: {
      params?: Record<string, string | number | boolean | undefined>;
      body?: unknown;
      headers?: HeadersInit;
    } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const tokenData = await getCookie<{ accessToken: string }>('token');
    const token = tokenData?.accessToken;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString(),
        body,
        errorData: responseData,
      });

      if (response.status === 401 || response.status === 403) {
        forbidden();
      }

      throw new ApiError(
        responseData.message ||
          responseData.error ||
          `Request failed with status ${response.status}`,
        response.status,
        responseData
      );
    }

    return responseData as T;
  }

  public getTenant<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    return this.request('GET', endpoint, { params });
  }

  public postTenant<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    return this.request('POST', endpoint, { body, params });
  }
}

export const baseTenantApiService = new BaseTenantApiService();
