import React from 'react';
import { AppSidebar } from '../../components/app-sidebar';

import { SiteHeader } from '../../components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' collapsible='icon' />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
