'use server';
import { FormState } from '../form.types';
import { redirect } from 'next/navigation';
import { apiPost } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { setCookie, deleteCookie } from '../cookies/cookie-managment';

export async function logOut(): Promise<FormState> {
  try {
    await deleteCookie('token');
    await deleteCookie('user');
    return Promise.resolve({ success: true, message: 'Logout successful' });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Logout failed',
    };
  } finally {
    redirect('/auth/signin');
  }
}

export async function logIn(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return {
      success: false,
      errors: { title: ['Missing credentials'] },
    };
  }

  try {
    const resp = await apiPost<{ token: string; user: any }>(ENDPOINTS.AUTH_LOGIN, {
      email,
      password,
    });
    await setCookie('token', resp.token);
    await setCookie('user', JSON.stringify(resp.user));
    redirect('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, errors: { title: [error.message] } };
  }
}
