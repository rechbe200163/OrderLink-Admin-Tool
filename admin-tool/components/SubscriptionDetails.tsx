import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { formatDateTime, formatPrice } from '@/lib/utils';
import { Subscription } from '@/lib/types';
import PauseSubscriptionsForm from './premium/forms/PauseSubscriptionsForm';
import CancleSubscriptionForm from './premium/forms/CancleSubscriptionForm';
import { useTranslations } from 'next-intl';

interface SubscriptionDetailsProps {
  subscription: Subscription;
  siteconfigId: string;
}

const SubscriptionDetails = ({
  subscription,
  siteconfigId,
}: SubscriptionDetailsProps) => {
  const { amount, interval, interval_count } = subscription.plan;
  const t = useTranslations('Components.SubscriptionDetails');

  return (
    <Card className='mb-4'>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='font-semibold'>{t('status')}</p>
            <p className='capitalize'>{subscription.status}</p>
          </div>
          <div>
            <p className='font-semibold'>{t('plan')}</p>
            <p>{subscription.plan.amount || 'N/A'}</p>
          </div>
          <div>
            <p className='font-semibold'>{t('amount')}</p>
            <p>{formatPrice(amount, subscription.currency)}</p>
          </div>
          <div>
            <p className='font-semibold'>{t('billingPeriod')}</p>
            <p>
              {interval_count} {interval}
            </p>
          </div>
          <div>
            <p className='font-semibold'>{t('currentPeriodStart')}</p>
            <p>
              {formatDateTime(subscription.current_period_start.toString())}
            </p>
          </div>
          <div>
            <p className='font-semibold'>{t('currentPeriodEnd')}</p>
            <p>{formatDateTime(subscription.current_period_end.toString())}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end space-x-2'>
        <PauseSubscriptionsForm
          subId={subscription.id + ''}
          siteConfigId={siteconfigId}
        />
        <CancleSubscriptionForm
          subId={subscription.id + ''}
          siteConfigId={siteconfigId}
        />
      </CardFooter>
    </Card>
  );
};

export default SubscriptionDetails;
