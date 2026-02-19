import SiteConfigCard from '@/components/cards/siteConfig/SiteConfigCard';
import PortalSessionButton from '@/components/PortalSessionButton';
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
      <SiteConfigCard siteConfig={siteConfig} />
      <PortalSessionButton />
    </div>
  );
};

export default SiteConfigPage;
