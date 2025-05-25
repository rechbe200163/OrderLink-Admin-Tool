import type React from 'react';
import PremiumCheckoutForm from './forms/PremiumCheckoutFotm';
import { getTranslations } from 'next-intl/server';
import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';

interface PremiumWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export async function PremiumWrapper({
  children,
  fallback,
}: PremiumWrapperProps) {
  const t = await getTranslations('PremiumWrapper');
  const { isPremium } = await siteConfigApiService.getPremiumStatus();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className='relative'>
      {/* Overlay with proper dark mode support */}
      <div className='absolute inset-0 bg-white/50 dark:bg-background/70 backdrop-blur-sm z-10'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center bg-white dark:bg-background p-6 rounded-lg shadow-lg dark:shadow-gray-800'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {t('header')}
            </h2>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>
              {t('subtitle')}
            </p>
            <PremiumCheckoutForm />
          </div>
        </div>
      </div>
      <div className='pointer-events-none'>{}</div>
      {fallback ? fallback : children}
    </div>
  );
}
