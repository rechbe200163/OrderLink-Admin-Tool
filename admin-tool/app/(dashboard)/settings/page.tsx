import SiteConfigCard from '@/components/cards/siteConfig/SiteConfigCard';
import { siteConfigApiService } from '@/lib/api/concrete/siteConfig';
import { getCookie } from '@/lib/cookies/cookie-managment';
import { Session } from '@/lib/utlis/getSession';
import React from 'react';

const SiteConfigPage = async () => {
  const siteConfig = await siteConfigApiService.getSiteConfig();
  const session = await getCookie<Session>('tenant');
  console.log('Session:', session);
  return (
    <div className='p-5'>
      <div className='sticky top-0 bg-background z-10'></div>
      <SiteConfigCard
        siteConfig={siteConfig}
        enabledModules={session?.tenantInfo?.enabledModules}
      />
    </div>
  );
};

export default SiteConfigPage;
