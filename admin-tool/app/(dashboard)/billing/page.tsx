'use client';

import GroupComponent from '@/components/GroupComponent';
import RadioGroupComponentUserTiers from '@/components/RadioGroupComponent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { billingAction } from '@/lib/actions/billing.actions';
import {
  ModulePackageName,
  PackagePricing,
  UserTier,
  UserTierPricing,
} from '@/lib/types';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const moduleLabels: Record<ModulePackageName, string> = {
  [ModulePackageName.ACCESS]: 'Access (Rollen & Rechte)',
  [ModulePackageName.FLOW]: 'Flow (Tourenplanung)',
  [ModulePackageName.INSIGHT]: 'Insight (Analysen)',
};

type PreconfiguredPackage = {
  name: string;
  description: string;
  userTier: UserTier;
  modules: ModulePackageName[];
};

const PRECONFIGURED_PACKAGES: PreconfiguredPackage[] = [
  {
    name: 'Full Pro',
    description:
      'Komplettes Funktionspaket f��r ambitionierte Teams inklusive aller Module.',
    userTier: UserTier.PRO,
    modules: [
      ModulePackageName.ACCESS,
      ModulePackageName.FLOW,
      ModulePackageName.INSIGHT,
    ],
  },
  {
    name: 'Insight Core',
    description:
      'Perfekt f��r Solo-Analysten, die alle Kennzahlen im Blick behalten wollen.',
    userTier: UserTier.CORE,
    modules: [ModulePackageName.INSIGHT],
  },
  {
    name: 'Operations Team',
    description:
      'Optimierte Prozesse f��r Teams mit Tourenplanung und Rollenverwaltung.',
    userTier: UserTier.TEAM,
    modules: [ModulePackageName.FLOW, ModulePackageName.ACCESS],
  },
  {
    name: 'Executive Insights',
    description:
      'Enterprise-Paket f��r datengetriebene Entscheidungen mit erweiterten Analysen.',
    userTier: UserTier.ENTERPRISE,
    modules: [ModulePackageName.INSIGHT, ModulePackageName.FLOW],
  },
];

const BillingPage = () => {
  const router = useRouter();
  const [formState, action, isPending] = useActionState(billingAction, {
    success: false,
    errors: {
      title: [],
    },
  });
  const [userTier, setUserTier] = useState<UserTier>(UserTier.TEAM);
  const [modules, setModules] = useState<ModulePackageName[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }),
    []
  );
  const totalMonthly = useMemo(() => {
    const tierPrice = UserTierPricing[userTier] ?? 0;
    const modulesPrice = modules.reduce(
      (sum, moduleName) => sum + (PackagePricing[moduleName] ?? 0),
      0
    );
    return tierPrice + modulesPrice;
  }, [userTier, modules]);
  const formattedTotal = useMemo(
    () => currencyFormatter.format(totalMonthly),
    [currencyFormatter, totalMonthly]
  );

  useEffect(() => {
    if (formState.success && formState.data) {
      // @ts-expect-error: formState.data.url type is assumed to be string for now
      router.push(formState.data.url);
    }
  }, [formState, router]);

  const handlePackageSelect = (pkg: PreconfiguredPackage) => {
    setUserTier(pkg.userTier);
    setModules([...pkg.modules]);
    setSelectedPackage(pkg.name);
  };

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
              Vorkonfigurierte Pakete
            </h2>
            <p className='text-sm text-muted-foreground'>
              Wähle ein Paket für einen schnellen Start oder passe es unten
              individuell an.
            </p>
            <div className='grid gap-4 md:grid-cols-2'>
              {PRECONFIGURED_PACKAGES.map((pkg) => (
                <button
                  key={pkg.name}
                  type='button'
                  onClick={() => handlePackageSelect(pkg)}
                  className={`rounded-lg border p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                    selectedPackage === pkg.name
                      ? 'border-primary bg-accent/40'
                      : 'border-border hover:border-primary/60 hover:bg-accent/20'
                  }`}
                  aria-pressed={selectedPackage === pkg.name}
                >
                  <div className='mb-2 flex items-center justify-between gap-2'>
                    <span className='text-lg font-semibold text-foreground'>
                      {pkg.name}
                    </span>
                    <span className='text-xs font-medium uppercase text-muted-foreground'>
                      {pkg.userTier}
                    </span>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {pkg.description}
                  </p>
                  <div className='mt-3 text-xs text-muted-foreground'>
                    <span className='font-semibold text-foreground'>
                      Module:
                    </span>{' '}
                    {pkg.modules
                      .map((module) => moduleLabels[module])
                      .join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <h2 className='text-lg font-semibold text-foreground'>
              Nutzergruppe
            </h2>
            <RadioGroupComponentUserTiers
              userTier={userTier}
              onChange={(value) => {
                setUserTier(value);
                setSelectedPackage(null);
              }}
            />
          </div>

          <div className='space-y-4'>
            <h2 className='text-lg font-semibold text-foreground'>Module</h2>
            <GroupComponent
              modules={modules}
              onChange={(value) => {
                setModules(value);
                setSelectedPackage(null);
              }}
            />
          </div>

          <Button
            type='submit'
            disabled={isPending}
            className='w-full text-base font-medium'
          >
            Jetzt konfigurieren
          </Button>
          <input type='hidden' name='totalMonthly' value={totalMonthly} />
          <div className='rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-foreground'>
            <div className='flex items-center justify-between font-medium'>
              <span>Monatliche Kosten</span>
              <span className='text-lg font-semibold'>{formattedTotal}</span>
            </div>
            <div className='mt-2 flex flex-col gap-1 text-muted-foreground'>
              <div className='flex items-center justify-between'>
                <span>Nutzerpaket</span>
                <span>
                  {userTier} ({currencyFormatter.format(UserTierPricing[userTier] ?? 0)})
                </span>
              </div>
              <div className='flex flex-col gap-1'>
                <span>Module</span>
                {modules.length ? (
                  modules.map((moduleName) => (
                    <span
                      key={moduleName}
                      className='flex items-center justify-between text-xs text-muted-foreground'
                    >
                      <span>{moduleLabels[moduleName]}</span>
                      <span>
                        {currencyFormatter.format(
                          PackagePricing[moduleName] ?? 0
                        )}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className='text-xs text-muted-foreground'>
                    Keine Zusatzmodule ausgewählt
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default BillingPage;
