'use server';
import { cookies } from 'next/headers';
import type { Attributes } from '@flags-sdk/growthbook';
import type { Identify } from 'flags';
import { dedupe } from 'flags/next';
import { getSession } from '../utlis/getSession';

export const identify = dedupe(async () => {
  const session = await getSession();
  const user = session?.user;

  const headers = await cookies();
  const userAgent = (headers.get('user-agent')?.value ?? '') as string;
  const url = headers.get('referer')?.value ?? '';
  const path = new URL(url || 'http://localhost').pathname;
  const host = new URL(url || 'http://localhost').host;
  const query = new URL(url || 'http://localhost').search;

  return {
    id: user?.email ?? 'guest',
    url,
    path,
    host,
    query,
    deviceType: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
    browser: getBrowserName(userAgent),
  };
}) satisfies Identify<Attributes>;

function getBrowserName(userAgent: string): string {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('Edg/')) return 'Edge';
  if (userAgent.includes('OPR/') || userAgent.includes('Opera')) return 'Opera';
  if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/'))
    return 'Chrome';
  if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/'))
    return 'Safari';
  if (userAgent.includes('Firefox/')) return 'Firefox';
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/'))
    return 'Internet Explorer';
  return 'Other';
}
