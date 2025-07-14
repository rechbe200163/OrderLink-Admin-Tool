'use server';
import { cookies } from 'next/headers';

export async function setCookie(name: string, data: string) {
  // 30 Minutes validity
  const cookieStore = await cookies();
  const value = {
    data,
    createdAt: new Date().toISOString(),
  };
  cookieStore.set(name, JSON.stringify(value), {
    expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    httpOnly: true,
    secure: true,
  });
}

export async function getCookie(name: string): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  // check for validity
  if (cookie) {
    const { data, createdAt } = JSON.parse(cookie.value);
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - createdAtDate.getTime()) / 1000 / 60
    );
    if (diffInMinutes < 30) {
      return data;
    }
  }
  return null;
}

export async function deleteCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
