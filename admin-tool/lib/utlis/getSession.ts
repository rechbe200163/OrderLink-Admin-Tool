import { ModuleName, RoleName } from '@/lib/types';
import { getCookie } from '../cookies/cookie-managment';
import { unauthorized } from 'next/navigation';

export interface Token {
  accessToken: string;
  issuedAt: number;
  expiresAt: number;
}

export interface Session {
  token: Token;
  user: SanitizedEmployee;
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

  if (!user || !token) {
    unauthorized();
  }

  try {
    return { token, user };
  } catch (e) {
    unauthorized();
  }
}

export async function authenticated(): Promise<void> {
  const session = await getSession();
  if (!session) {
    unauthorized();
  }
}
