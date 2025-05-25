import SiteConfigCard from '@/components/cards/siteConfig/SiteConfigCard';
import BreadcrumbComponent from '@/components/helpers/BreadCrumbComponent';
import { addressApiService } from '@/lib/api/concrete/address';
import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';
import React from 'react';

const SiteConfigPage = async () => {
  const siteConfig = await siteConfigApiService.getSiteConfig();
  console.log('siteConfig', siteConfig);
  const addresses = await addressApiService.getAddresses();
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
        <BreadcrumbComponent
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Routes', href: '/routes/' },
          ]}
        />
      </div>
      <SiteConfigCard siteConfig={siteConfig} addresses={addresses} />
    </div>
  );
};

export default SiteConfigPage;
