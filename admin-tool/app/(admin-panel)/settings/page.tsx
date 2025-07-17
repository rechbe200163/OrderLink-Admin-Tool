import SiteConfigCard from '@/components/cards/siteConfig/SiteConfigCard';
import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';
import React from 'react';

const SiteConfigPage = async () => {
  const siteConfig = await siteConfigApiService.getSiteConfig();
  return (
    <div className='px-5'>
      <div className='sticky top-0 bg-background z-10'>
      </div>
      <SiteConfigCard siteConfig={siteConfig} />
    </div>
  );
};

export default SiteConfigPage;
