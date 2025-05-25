'use client';
import { useTranslations } from 'next-intl';
import React from 'react';

const PremiumCheckoutForm = () => {
  const t = useTranslations('PremiumWrapper');
  return (
    <form action='/api/checkout_sessions' method='POST'>
      <button
        type='submit'
        className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
      >
        {t('button')}
      </button>
    </form>
  );
};

export default PremiumCheckoutForm;
