'use server';
import { FormState } from '../form.types';
import { redirect } from 'next/navigation';
import { apiPost } from './api.actions';
import { ENDPOINTS } from '../api/endpoints';
import { setCookie, deleteCookie } from '../cookies/cookie-managment';
import { getSession, Session } from '../utlis/getSession';

export async function logOut(): Promise<FormState> {
  try {
    await deleteCookie('token');
    await deleteCookie('user');
    await deleteCookie('tenant');
    await deleteCookie('siteConfig');
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
    const resp = await apiPost<Session>(ENDPOINTS.AUTH_LOGIN, {
      email,
      password,
    });
    await setCookie('token', {
      accessToken: resp.token.accessToken,
      issuedAt: resp.token.issuedAt,
      expiresAt: resp.token.expiresAt,
    });
    await setCookie('user', resp.user);
    await setCookie('tenant', resp.tenantInfo);
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, errors: { title: [error.message] } };
  }
  redirect(`/`);
}

export async function verifyOtp(
  tenantSlug: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const otp = Number(formData.get('otp'));

  if (!otp) {
    return {
      success: false,
      errors: { title: ['Missing OTP'] },
    };
  }

  try {
    const resp = await apiPost<Session>(ENDPOINTS.AUTH_OTP(tenantSlug, otp));
    await setCookie('token', {
      accessToken: resp.token.accessToken,
      issuedAt: resp.token.issuedAt,
      expiresAt: resp.token.expiresAt,
    });
    await setCookie('user', resp.user);
    await setCookie('tenant', resp.tenantInfo);
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return { success: false, errors: { title: [error.message] } };
  }
  redirect(`/`);
}

export async function renewSessionAction(): Promise<FormState> {
  const session = await getSession();
  console.log('Renewing session:', session);

  if (!session) {
    return { success: false }; // ❌ redirect NICHT hier aufrufen
  }

  try {
    const resp = await apiPost<Session>(ENDPOINTS.AUTH_RENEW_SESSION);

    console.log('Renewed session response:', resp);

    if (resp?.token) {
      await setCookie('token', resp.token);
      await setCookie('user', resp.user);
      return { success: true };
    }

    return { success: false };
  } catch (err) {
    console.error('Renew failed:', err);
    return { success: false };
  }
}

export async function resendOtp(employeeId: string): Promise<FormState> {
  try {
    await apiPost(ENDPOINTS.OTP_RESEND(employeeId));
    return { success: true } as FormState;
  } catch (err: any) {
    return { success: false, errors: { title: [err.message] } } as FormState;
  }
}
