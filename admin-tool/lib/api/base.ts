'server only';

import { getCookie } from '../cookies/cookie-managment';
import { forbidden } from 'next/navigation';
import { headers as nextHeaders } from 'next/headers';

export type ApiResult<T> = T & {
  ok: boolean;
  error: string | null;
  status: number;
  cacheHit?: boolean;
};

function extractTenantSubdomain(host: string): string | null {
  const normalizedHost = host.split(':')[0].trim().toLowerCase();

  if (!normalizedHost) return null;

  if (normalizedHost.endsWith('.localhost')) {
    const subdomain = normalizedHost.replace('.localhost', '');
    return subdomain || null;
  }

  const parts = normalizedHost.split('.');

  if (parts.length >= 4) {
    return parts[0] || null;
  }

  return null;
}

async function getTenantSubdomainFromRequest(): Promise<string | null> {
  const requestHeaders = await nextHeaders();
  const forwardedHost = requestHeaders.get('x-forwarded-host');
  const host = requestHeaders.get('host');

  return extractTenantSubdomain(forwardedHost ?? host ?? '');
}

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
  ): Promise<ApiResult<T>> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);

    console.log(
      `Making ${method} request to ${url.toString()} with body:`,
      body,
      'and params:',
      params,
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const tokenData = await getCookie<{ accessToken: string }>('token');
    const token = tokenData?.accessToken;
    const tenantSubdomain = await getTenantSubdomainFromRequest();

    const isFormData = body instanceof FormData;

    const options: RequestInit = {
      method,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(tenantSubdomain ? { 'x-tenant-subdomain': tenantSubdomain } : {}),
        ...(headers || {}),
      },
    };

    if (body !== undefined) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), options);
      const cacheHit = response.headers.get('x-cache') === 'HIT';
      console.log(`Response:`, response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
          forbidden();
        }

        return {
          ok: false,
          ...(Object.create(null) as T),
          error:
            errorData.message ||
            errorData.error ||
            `Request failed with status ${response.status}`,
          status: response.status,
          cacheHit,
        };
      }

      const data = await response.json().catch(() => ({}) as T);

      return {
        ok: true,
        ...(data as T),
        error: null,
        status: response.status,
        cacheHit,
      };
    } catch (error) {
      console.error('Network error:', error);
      return {
        ok: false,
        ...(Object.create(null) as T),
        error: error instanceof Error ? error.message : 'Unknown network error',
        status: 0,
        cacheHit: false,
      };
    }
  }
  public get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<ApiResult<T>> {
    return this.request<T>('GET', endpoint, { params });
  }

  public post<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResult<T>> {
    return this.request<T>('POST', endpoint, { body, params });
  }

  public put<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResult<T>> {
    return this.request<T>('PUT', endpoint, { body, params });
  }

  public patch<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResult<T>> {
    return this.request<T>('PATCH', endpoint, { body, params });
  }

  public delete<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResult<T>> {
    return this.request<T>('DELETE', endpoint, { params });
  }
}

export const baseApiService = new BaseApiService();
