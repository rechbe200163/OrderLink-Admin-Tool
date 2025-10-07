'use client';

import GroupComponent from '@/components/GroupComponent';
import RadioGroupComponentUserTiers from '@/components/RadioGroupComponent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { billingAction } from '@/lib/actions/billing.actions';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BillingPage = () => {
  const router = useRouter();
  const [formState, action, isPending] = useActionState(billingAction, {
    success: false,
    errors: {
      title: [],
    },
  });

  useEffect(() => {
    if (formState.success && formState.data) {
      // @ts-expect-error: formState.data.url type is assumed to be string for now
      router.push(formState.data.url);
    }
  }, [formState, router]);

  return (
    <div className='flex min-h-svh items-center justify-center bg-muted p-6 md:p-10'>
      <Card className='w-full max-w-3xl space-y-8 p-8 shadow-lg border border-border bg-background'>
        <div className='space-y-2 text-center'>
          <h1 className='text-4xl font-bold tracking-tights text-foreground'>
            Wähle dein OrderLink Paket
          </h1>
          <p className='text-muted-foreground text-sm md:text-base'>
            Stelle dein individuelles System aus Modulen und Nutzeranzahl
            zusammen
          </p>
        </div>

        <form action={action} className='space-y-8'>
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold text-foreground'>
              Nutzergruppe
            </h2>
            <RadioGroupComponentUserTiers />
          </div>

          <div className='space-y-4'>
            <h2 className='text-lg font-semibold text-foreground'>Module</h2>
            <GroupComponent />
          </div>

          <Button
            type='submit'
            disabled={isPending}
            className='w-full text-base font-medium'
          >
            Jetzt konfigurieren
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default BillingPage;
