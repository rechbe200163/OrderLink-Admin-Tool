import { auth } from '@/auth';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import React from 'react';
import SignOutComponent from '../forms/auth/signOut';

async function DashboardFooter() {
  const session = await auth();
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
