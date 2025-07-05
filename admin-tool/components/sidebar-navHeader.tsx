import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';
import { ArrowUpCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { SidebarMenuButton } from './ui/sidebar';

function ErrorComponent() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Error</h1>
        <p className='mt-2 text-gray-600'>
          An error occurred while loading the sidebar header.
        </p>
      </div>
    </div>
  );
}

const SideBarHeader = async () => {
  const { companyName } = await siteConfigApiService.getSiteConfig();

  if (!companyName) {
    return <ErrorComponent />;
  }

  return (
    <SidebarMenuButton
      asChild
      className='data-[slot=sidebar-menu-button]:p-1.5!'
    >
      <Link href='/'>
        <ArrowUpCircleIcon className='h-5 w-5' />
        <span className='text-base font-semibold'>
          {companyName || 'Admin Tool'}
        </span>
      </Link>
    </SidebarMenuButton>
  );
};

export default SideBarHeader;
