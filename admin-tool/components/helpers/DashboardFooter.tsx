import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import React from 'react';

import { getSession } from '@/lib/utlis/getSession';
import SignOutComponent from '../forms/auth/signOut';

async function DashboardFooter() {
  const session = await getSession();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuSubButton>
          <span>{session?.user.email}</span>
          {/* Wrapped in a single parent element */}
          <SignOutComponent />
        </SidebarMenuSubButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default DashboardFooter;
