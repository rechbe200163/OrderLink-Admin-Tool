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
  Settings,
  ShieldCheck,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
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
  const [query, setQuery] = useState('');

  const navGroups = useMemo(
    () => [
      {
        label: tGroup('overview'),
        icon: HomeIcon,
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
        icon: ShoppingCartIcon,
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
        icon: Box,
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
        icon: UsersIcon,
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
        icon: UserPen,
        items: [
          {
            title: tItem('employees'),
            url: '/employees',
            icon: UserPen,
          },
        ],
      },
      {
        label: tGroup('permissions'),
        icon: Key,
        items: [
          {
            title: tItem('permissions'),
            url: '/permissions',
            icon: ShieldCheck,
          },
        ],
      },
      {
        label: tGroup('settings'),
        icon: Settings,
        items: [
          {
            title: tItem('settings'),
            url: '/settings',
            icon: Bolt,
          },
        ],
      },
    ],
    [tGroup, tItem]
  );

  const filteredGroups = useMemo(() => {
    if (!query) return navGroups;
    const lower = query.toLowerCase();
    return navGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.title.toLowerCase().includes(lower)),
      }))
      .filter(
        (g) =>
          g.items.length > 0 || g.label.toLowerCase().includes(lower)
      );
  }, [query, navGroups]);

  // Helper to check if any item in group is active
  const isGroupActive = (items: { url: string }[]) =>
    items.some(
      (item) => pathname === item.url || pathname.startsWith(item.url + '/')
    );

  return (
    <>
      <div className='mb-4'>
        <Input
          type='search'
          placeholder='Search items...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <SidebarGroup>
        {filteredGroups.map((group) => (
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
                        {group.icon && <group.icon size={16} />}
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
    </>
  );
}
