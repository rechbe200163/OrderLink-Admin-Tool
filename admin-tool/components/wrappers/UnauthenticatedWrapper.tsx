'use client';

import type React from 'react';
import { LoginForm } from '../session/LoginForm';

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isLoggedIn: boolean;
  loginPath?: string;
}

export function UnauthenticatedWrapper({
  children,
  fallback,
  isLoggedIn,
}: AuthWrapperProps) {
  if (isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className='relative'>
      {/* Blurred content in background */}
      <div className='pointer-events-none filter blur-sm opacity-50'>
        {fallback || children}
      </div>

      {/* Auth overlay */}
      <div className='absolute inset-0 flex items-center justify-center z-10'>
        <LoginForm />
      </div>
    </div>
  );
}
