'use server';
import { signOut } from '@/auth';
import { FormState } from '../form.types';
import { redirect } from 'next/navigation';

export async function logOut(): Promise<FormState> {
  try {
    await signOut();
    return Promise.resolve({
      success: true,
      message: 'Logout successful',
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Logout failed',
    };
  } finally {
    redirect('/auth/signin');
  }
}
