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
  Star,
  FolderPlus,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { useState, useMemo, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function NavMain() {
  const pathname = usePathname();
  const tGroup = useTranslations('Navigation.Groups');
  const tItem = useTranslations('Navigation.Items');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [groupMap, setGroupMap] = useState<Record<string, string>>({});

  // Load favorites and custom groups from localStorage
  useEffect(() => {
    try {
      const fav = JSON.parse(localStorage.getItem('nav:favorites') || '[]');
      setFavorites(Array.isArray(fav) ? fav : []);
      const map = JSON.parse(localStorage.getItem('nav:groups') || '{}');
      setGroupMap(map && typeof map === 'object' ? map : {});
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nav:favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('nav:groups', JSON.stringify(groupMap));
  }, [groupMap]);

  const toggleFavorite = (url: string) => {
    setFavorites((prev) =>
      prev.includes(url) ? prev.filter((f) => f !== url) : [...prev, url]
    );
  };

  const promptGroup = (url: string) => {
    const label = window.prompt('Group name');
    if (label) {
      setGroupMap((prev) => ({ ...prev, [url]: label }));
    }
  };

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

  // Build groups including user-defined mappings
  const groupsWithCustom = useMemo(() => {
    const custom: Record<string, { label: string; icon: any; items: typeof navGroups[0]['items'] }> = {};
    const base = navGroups.map((g) => ({ ...g, items: [...g.items] }));

    base.forEach((g) => {
      g.items = g.items.filter((item) => {
        const label = groupMap[item.url];
        if (label) {
          if (!custom[label]) {
            custom[label] = { label, icon: FolderPlus, items: [] };
          }
          custom[label].items.push(item);
          return false;
        }
        return true;
      });
    });

    return [...base, ...Object.values(custom)];
  }, [navGroups, groupMap]);

  const favoritesGroup = useMemo(() => {
    const allItems = groupsWithCustom.flatMap((g) => g.items);
    const favItems = allItems.filter((i) => favorites.includes(i.url));
    return { label: 'Favorites', icon: Star, items: favItems };
  }, [groupsWithCustom, favorites]);

  const allGroups = useMemo(() => {
    return favoritesGroup.items.length > 0
      ? [favoritesGroup, ...groupsWithCustom]
      : groupsWithCustom;
  }, [favoritesGroup, groupsWithCustom]);

  const filteredGroups = useMemo(() => {
    if (!query) return allGroups;
    const lower = query.toLowerCase();
    return allGroups

      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.title.toLowerCase().includes(lower)),
      }))
      .filter(
        (g) =>
          g.items.length > 0 || g.label.toLowerCase().includes(lower)
      );
  }, [query, allGroups]);



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
                          <SidebarMenuAction
                            showOnHover
                            onClick={() => toggleFavorite(item.url)}
                          >
                            <Star
                              size={14}
                              className={favorites.includes(item.url) ? 'fill-yellow-400 text-yellow-400' : ''}
                            />
                            <span className='sr-only'>Favorite</span>
                          </SidebarMenuAction>
                          <SidebarMenuAction
                            showOnHover
                            onClick={() => promptGroup(item.url)}
                          >
                            <FolderPlus size={14} />
                            <span className='sr-only'>Group</span>
                          </SidebarMenuAction>
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
                  <SidebarMenuAction
                    showOnHover
                    onClick={() => toggleFavorite(item.url)}
                  >
                    <Star
                      size={14}
                      className={favorites.includes(item.url) ? 'fill-yellow-400 text-yellow-400' : ''}
                    />
                    <span className='sr-only'>Favorite</span>
                  </SidebarMenuAction>
                  <SidebarMenuAction showOnHover onClick={() => promptGroup(item.url)}>
                    <FolderPlus size={14} />
                    <span className='sr-only'>Group</span>
                  </SidebarMenuAction>
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
