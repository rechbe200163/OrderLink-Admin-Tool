import { ApiError } from './ApiError';
import { redirect } from 'next/navigation';
import { headers as nextHeaders } from 'next/headers';

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

export class ExternalApiService {
  public baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_EXTERNAL_API || '') {
    this.baseUrl = baseUrl;
  }

  protected async fetchFromExternalApi<T>(
    token: string,
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    options?: RequestInit,
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

    const tenantSubdomain = await getTenantSubdomainFromRequest();

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers: {
          ...(options?.headers ?? {}),
          ...(tenantSubdomain ? { 'x-tenant-subdomain': tenantSubdomain } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
          redirect(
            `/unauthorized?message=${encodeURIComponent(
              errorData.message || errorData.error || 'Access denied',
            )}`,
          );
        }

        throw new ApiError(
          errorData.message ||
            errorData.error ||
            `Request failed with status ${response.status}`,
          response.status,
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw new Error(
        `Failed to fetch data from: ${endpoint}` + ' ' + '|' + ' ' + error,
      );
    }
  }
}
