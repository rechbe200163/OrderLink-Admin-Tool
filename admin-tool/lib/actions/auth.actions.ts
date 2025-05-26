import { signOut } from '@/auth';
import { FormState } from '../form.types';

export async function logout(): Promise<FormState> {
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
  }
}
