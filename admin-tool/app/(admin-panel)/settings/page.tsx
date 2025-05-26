import SiteConfigCard from '@/components/cards/siteConfig/SiteConfigCard';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import { addressApiService } from '@/lib/api/concrete/address';
import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';
import React from 'react';

const SiteConfigPage = async () => {
  const siteConfig = await siteConfigApiService.getSiteConfig();
  const addresses = await addressApiService.getAddresses();
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
        <BreadcrumbComponent
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Einstellungen', href: '/settings/' },
          ]}
        />
      </div>
      <SiteConfigCard siteConfig={siteConfig} addresses={addresses} />
    </div>
  );
};

export default SiteConfigPage;
