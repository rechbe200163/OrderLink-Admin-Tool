import { auth } from '@/auth';
import { Session } from 'next-auth';
import { rolePermissions } from '../access-managment/permissions';

export async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session) {
    throw new Error('No session found');
  }
  return session;
}

export async function hasPermission(
  resource: string,
  action: 'read' | 'write'
): Promise<boolean> {
  const session = await getSession();
  const role = session.user.role;
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
