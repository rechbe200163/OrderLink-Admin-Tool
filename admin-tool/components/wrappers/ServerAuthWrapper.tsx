import { getCookie } from '@/lib/cookies/cookie-managment';
import type React from 'react';
import { UnauthenticatedWrapper } from './UnauthenticatedWrapper';

interface ServerAuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loginPath?: string;
}

export async function ServerAuthWrapper({
  children,
  fallback,
  loginPath = '/login',
}: ServerAuthWrapperProps) {
  const isLoggedIn = (await getCookie('token')) !== null;

  return (
    <UnauthenticatedWrapper
      isLoggedIn={isLoggedIn}
      fallback={fallback}
      loginPath={loginPath}
    >
      {children}
    </UnauthenticatedWrapper>
  );
}
