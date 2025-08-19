import { RoleName } from '@/lib/types';
import { getCookie } from '../cookies/cookie-managment';

export interface Token {
  accessToken: string;
  issuedAt: number;
  expiresAt: number;
}

export interface Session {
  token: Token;
  user: {
    employeeId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: RoleName;
  };
  tenantInfo?: {
    maxEmployees: number;
    trialEndsAt: string;
    trialStartedAt: string;
    status: string;
    enabledModules: { moduleName: string }[];
  };
}

export interface SanitizedEmployee {
  employeeId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: RoleName;
  superAdmin?: boolean;
}

export async function getSession(): Promise<Session> {
  const user = await getCookie<SanitizedEmployee>('user');
  const token = await getCookie<Token>('token');

  if (!user || !token) {
    throw new Error('No session found');
  }

  try {
    return { token, user };
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
