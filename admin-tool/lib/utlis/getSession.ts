import { Role } from '@prisma/client';
import { getCookie } from '../cookies/cookie-managment';
import { rolePermissions } from '../access-managment/permissions';

export interface Session {
  user: { role: Role } & Record<string, any>;
}

export async function getSession(): Promise<Session> {
  const raw = await getCookie('user');
  if (!raw) {
    throw new Error('No session found');
  }
  const user = JSON.parse(raw);
  return { user };
}

export async function hasPermission(
  resource: string,
  action: 'read' | 'write'
): Promise<boolean> {
  const session = await getSession();
  const role = session.user.role as Role | undefined;
  if (!role) return false;

  const permissions = rolePermissions[role];
  return permissions?.[resource]?.[action] ?? false;
}

export async function authenticated(): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
}
