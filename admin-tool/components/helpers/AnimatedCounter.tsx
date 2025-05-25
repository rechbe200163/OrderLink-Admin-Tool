'use client';

import { formatPrice } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import CountUp from 'react-countup';

const AnimatedCounter = ({ value }: { value: number }) => {
  const t = useTranslations('Dashboard.InfoCards');
  console.log(t('currency'));
  return (
    <div className='w-full'>
      <CountUp
        decimals={2}
        end={value}
        formattingFn={(val) => formatPrice(val, t('currency'))}
      />
    </div>
  );
};

export default AnimatedCounter;
