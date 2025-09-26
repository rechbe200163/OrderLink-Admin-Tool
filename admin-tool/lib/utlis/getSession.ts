import { ModuleName, RoleName } from '@/lib/types';
import { getCookie } from '../cookies/cookie-managment';
import Module from 'module';

export interface Token {
  accessToken: string;
  issuedAt: number;
  expiresAt: number;
}

export interface Session {
  token: Token;
  user: SanitizedEmployee;
  tenantInfo: TenantInfo;
}

export interface TenantInfo {
  trialEndsAt: string;
  trialStartedAt: string;
  status: string;
}

export interface SanitizedEmployee {
  employeeId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roleName?: RoleName;
  superAdmin?: boolean;
}

export async function getSession(): Promise<Session> {
  const user = await getCookie<SanitizedEmployee>('user');
  const token = await getCookie<Token>('token');
  const tenantInfo = await getCookie<TenantInfo>('tenant');

  if (!user || !token || !tenantInfo) {
    throw new Error('No session found');
  }

  try {
    return { token, user, tenantInfo };
  } catch (e) {
    console.error('Session parsing error:', e);
    throw new Error('Session parsing failed');
  }
}

export async function authenticated(): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
}
