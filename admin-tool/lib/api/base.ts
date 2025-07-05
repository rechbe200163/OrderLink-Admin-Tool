'server only';
import { hasPermission } from '../utlis/getSession';
import { getCookie } from '../cookies/cookie-managment';

export class BaseApiService {
  protected baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    {
      params,
      body,
      action = method === 'GET' ? 'read' : 'write',
      headers,
    }: {
      params?: Record<string, string | number | undefined>;
      body?: unknown;
      action?: 'read' | 'write';
      headers?: HeadersInit;
    } = {}
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

    const token = await getCookie('token');
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed with status ${response.status}`
      );
    }

    return response.json();
  }

  protected get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    action: 'read' | 'write' = 'read'
  ): Promise<T> {
    return this.request('GET', endpoint, { params, action });
  }

  protected post<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
    action: 'read' | 'write' = 'write'
  ): Promise<T> {
    return this.request('POST', endpoint, { body, params, action });
  }

  protected put<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
    action: 'read' | 'write' = 'write'
  ): Promise<T> {
    return this.request('PUT', endpoint, { body, params, action });
  }

  protected patch<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
    action: 'read' | 'write' = 'write'
  ): Promise<T> {
    return this.request('PATCH', endpoint, { body, params, action });
  }

  protected delete<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    action: 'read' | 'write' = 'write'
  ): Promise<T> {
    return this.request('DELETE', endpoint, { params, action });
  }
}

export const baseApiService = new BaseApiService();
