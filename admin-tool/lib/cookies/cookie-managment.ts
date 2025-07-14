'use server';
import { cookies } from 'next/headers';

export async function setCookie<T extends object>(
  name: string,
  data: T
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, JSON.stringify(data), {
    expires: new Date(Date.now() + 30 * 60), // 30 Minuten
    httpOnly: true,
    secure: true,
    path: '/',
  });
}

export async function getCookie<T = any>(name: string): Promise<T | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);

  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value) as T;
  } catch (e) {
    console.error(`Failed to parse cookie "${name}":`, e);
    return null;
  }
}

export async function deleteCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
