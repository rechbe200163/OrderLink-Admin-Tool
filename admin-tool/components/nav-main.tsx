'use client';

import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChevronRight,
  ChartLine,
  Bolt,
  UserPen,
  Route,
  MapPin,
  Box,
  Shapes,
  Key,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function NavMain() {
  const pathname = usePathname();
  const tGroup = useTranslations('Navigation.Groups');
  const tItem = useTranslations('Navigation.Items');

  const navGroups = [
    {
      label: tGroup('overview'),
      items: [
        {
          title: tItem('overview'),
          url: '/',
          icon: HomeIcon,
        },
        {
          title: tItem('statistics'),
          url: '/statistics',
          icon: ChartLine,
        },
      ],
    },
    {
      label: tGroup('sales'),
      items: [
        {
          title: tItem('orders'),
          url: '/orders',
          icon: ShoppingCartIcon,
        },
        {
          title: tItem('routes'),
          url: '/routes',
          icon: Route,
        },
        {
          title: tItem('addresses'),
          url: '/addresses',
          icon: MapPin,
        },
      ],
    },
    {
      label: tGroup('products'),
      items: [
        {
          title: tItem('products'),
          url: '/products',
          icon: Box,
        },
        {
          title: tItem('categories'),
          url: '/categories',
          icon: Shapes,
        },
      ],
    },
    {
      label: tGroup('customers'),
      items: [
        {
          title: tItem('customers'),
          url: '/customers',
          icon: UsersIcon,
        },
      ],
    },
    {
      label: tGroup('employees'),
      items: [
        {
          title: tItem('employees'),
          url: '/employees',
          icon: UserPen,
        },
      ],
    },
    {
      label: tGroup('settings'),
      items: [
        {
          title: tItem('settings'),
          url: '/settings',
          icon: Bolt,
        },
      ],
    },
    {
      label: tGroup('permissions'),
      items: [
        {
          title: tItem('permissions'),
          url: '/permissions',
          icon: Key,
        },
      ],
    },
  ];

  // Helper to check if any item in group is active
  const isGroupActive = (items: { url: string }[]) =>
    items.some(
      (item) => pathname === item.url || pathname.startsWith(item.url + '/')
    );

  return (
    <SidebarGroup>
      {navGroups.map((group) => (
        <div key={group.label} className='mb-4 last:mb-0'>
          <SidebarMenu>
            {group.items.length > 1 ? (
              <Collapsible
                asChild
                defaultOpen={isGroupActive(group.items)}
                className='group/collapsible'
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <span>{group.label}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {group.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={
                              pathname === item.url ||
                              pathname.startsWith(item.url + '/')
                                ? 'bg-primary text-primary-foreground'
                                : ''
                            }
                          >
                            <Link href={item.url}>
                              <span className='flex items-center gap-2'>
                                {item.icon && <item.icon size={16} />}
                                {item.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={
                      pathname === item.url ||
                      pathname.startsWith(item.url + '/')
                        ? 'bg-primary text-primary-foreground'
                        : ''
                    }
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon size={16} />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </div>
      ))}
    </SidebarGroup>
  );
}
