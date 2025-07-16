import SiteConfigCard from '@/components/cards/siteConfig/SiteConfigCard';
import { SiteConfigProvider } from '@/components/helpers/siteConfig/SiteConfigProvider';
import { addressApiService } from '@/lib/api/concrete/address';
import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';
import React from 'react';

const SiteConfigPage = async () => {
  const siteConfig = await siteConfigApiService.getSiteConfig();
  const addresses = await addressApiService.getAddresses();
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
      </div>
      <SiteConfigProvider initialSiteConfig={siteConfig}>
        <SiteConfigCard siteConfig={siteConfig} addresses={addresses} />
      </SiteConfigProvider>
    </div>
  );
};

export default SiteConfigPage;
