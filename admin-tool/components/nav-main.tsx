'use client';

import {
  BarChartIcon,
  CalendarIcon,
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: HomeIcon,
    },
    {
      title: 'Customers',
      url: '/customers',
      icon: UsersIcon,
    },
    {
      title: 'Products',
      url: '/products',
      icon: ShoppingCartIcon,
    },
    {
      title: 'Categories',
      url: '/categories',
      icon: BarChartIcon,
    },
    {
      title: 'Addresses',
      url: '/addresses',
      icon: CalendarIcon,
    },
    {
      title: 'Routes',
      url: '/routes',
      icon: CalendarIcon,
    },
    {
      title: 'Employees',
      url: '/employees',
      icon: UsersIcon,
    },
    {
      title: 'Orders',
      url: '/orders',
      icon: ShoppingCartIcon,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: BarChartIcon,
    },
    {
      title: 'Statistics',
      url: '/statistics',
      icon: BarChartIcon,
    },
    // {
    //   title: 'Subscriptions',
    //   url: '/subscriptions',
    //   icon: CalendarIcon,
    // },
  ],
};

export function NavMain() {
  const items = data.navMain;

  const pathname = usePathname();
  const isActive = (url: string) => {
    return pathname === url; // Correct comparison
  };
  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {/* <SidebarMenuItem className='flex items-center gap-2'>
            <SidebarMenuButton
              tooltip='Quick Create'
              className='min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
            >
              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size='icon'
              className='h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0'
              variant='outline'
            >
              <MailIcon />
              <span className='sr-only'>Inbox</span>
            </Button>
          </SidebarMenuItem> */}
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    'hover:cursor-pointer',
                    isActive(item.url) && 'bg-accent text-accent-foreground'
                  )}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
