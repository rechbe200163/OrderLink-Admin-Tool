'use server';

import { baseApiService } from '../api/base';

export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  return baseApiService.get<T>(endpoint, params);
}

export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  return baseApiService.post<T>(endpoint, body, params);
}

export async function apiPut<T>(
  endpoint: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  return baseApiService.put<T>(endpoint, body, params);
}

export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  return baseApiService.patch<T>(endpoint, body, params);
}

export async function apiDelete<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  return baseApiService.delete<T>(endpoint, params);
}
