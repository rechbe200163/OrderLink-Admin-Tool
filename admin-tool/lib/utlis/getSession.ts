import { Role } from '@/lib/types';
import { getCookie } from '../cookies/cookie-managment';

export interface Session {
  token: string;
  user: {
    employeeId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
  };
}

export async function getSession(): Promise<Session> {
  const raw = await getCookie('user');
  if (!raw) {
    throw new Error('No session found');
  }
  const user = JSON.parse(raw);
  return { token: user.token, user };
}

export async function authenticated(): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
}
