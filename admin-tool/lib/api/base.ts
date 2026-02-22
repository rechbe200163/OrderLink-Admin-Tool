'server only';
import { getCookie } from '../cookies/cookie-managment';
import { ApiError } from './ApiError';
import { forbidden } from 'next/navigation';

export class BaseApiService {
  public baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
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
    } = {},
  ): Promise<T & { cacheHit?: boolean }> {
    console.log('BaseApiService initialized with baseUrl:', this.baseUrl);
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    console.log('API Request:', {
      method,
      url: url.toString(),
      body,
    });

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

    const cacheHit = response.headers.get('x-cache') === 'HIT';

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(errorData);

      if (response.status === 401 || response.status === 403) {
        forbidden();
      }

      throw new ApiError(
        errorData.message ||
          errorData.error ||
          `Request failed with status ${response.status}`,
        response.status,
      );
    }
    const data = await response.json().catch(() => ({}));
    return { ...data, cacheHit };
  }

  public get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T & { cacheHit?: boolean }> {
    return this.request('GET', endpoint, { params });
  }

  public post<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
  ): Promise<T & { cacheHit?: boolean }> {
    return this.request('POST', endpoint, { body, params });
  }

  public put<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
  ): Promise<T & { cacheHit?: boolean }> {
    return this.request('PUT', endpoint, { body, params });
  }

  public patch<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
  ): Promise<T> {
    return this.request('PATCH', endpoint, { body, params });
  }

  public delete<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<T> {
    return this.request('DELETE', endpoint, { params });
  }
}

export const baseApiService = new BaseApiService();
