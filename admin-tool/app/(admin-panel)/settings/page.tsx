import SiteConfigCard from '@/components/cards/siteConfig/SiteConfigCard';
import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';
import React from 'react';

const SiteConfigPage = async () => {
  const { siteConfig, tenant } = await siteConfigApiService.getSiteConfig();
  return (
    <div className='p-5'>
      <div className='sticky top-0 bg-background z-10'></div>
      <SiteConfigCard siteConfig={siteConfig} tenant={tenant} />
    </div>
  );
};

export default SiteConfigPage;
