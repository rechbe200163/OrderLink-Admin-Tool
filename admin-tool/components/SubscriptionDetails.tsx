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

interface SubscriptionDetailsProps {
  subscription: Subscription;
  siteconfigId: string;
}

const SubscriptionDetails = ({
  subscription,
  siteconfigId,
}: SubscriptionDetailsProps) => {
  const { amount, interval, interval_count } = subscription.plan;

  return (
    <Card className='mb-4'>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='font-semibold'>Status</p>
            <p className='capitalize'>{subscription.status}</p>
          </div>
          <div>
            <p className='font-semibold'>Plan</p>
            <p>{subscription.plan.amount || 'N/A'}</p>
          </div>
          <div>
            <p className='font-semibold'>Amount</p>
            <p>{formatPrice(amount, subscription.currency)}</p>
          </div>
          <div>
            <p className='font-semibold'>Billing Period</p>
            <p>
              {interval_count} {interval}
            </p>
          </div>
          <div>
            <p className='font-semibold'>Current Period Start</p>
            <p>
              {formatDateTime(subscription.current_period_start.toString())}
            </p>
          </div>
          <div>
            <p className='font-semibold'>Current Period End</p>
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
