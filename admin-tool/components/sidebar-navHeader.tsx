import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';
import { ArrowUpCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { SidebarMenuButton } from './ui/sidebar';
import { getTranslations } from 'next-intl/server';

async function ErrorComponent() {
  const t = await getTranslations('Components.SidebarHeader');
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>{t('errorTitle')}</h1>
        <p className='mt-2 text-gray-600'>{t('errorMessage')}</p>
      </div>
    </div>
  );
}

const SideBarHeader = async () => {
  const t = await getTranslations('Components.SidebarHeader');
  const data = await siteConfigApiService.getSiteConfig();

  if (!data) {
    return <ErrorComponent />;
  }

  const { companyName } = data;

  if (!companyName) {
    return <ErrorComponent />;
  }

  return (
    <SidebarMenuButton
      asChild
      className='data-[slot=sidebar-menu-button]:p-1.5!'
    >
      <Link href='/'>
        {/* <ArrowUpCircleIcon className='h-5 w-5' /> */}
        <span className='text-base font-semibold'>
          {companyName || t('defaultName')}
        </span>
      </Link>
    </SidebarMenuButton>
  );
};

export default SideBarHeader;
