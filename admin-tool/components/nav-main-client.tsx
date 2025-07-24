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
  StarOff,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { useState, useMemo, useEffect } from 'react';
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

interface NavMainProps {
  favoritesEnabled: boolean;
}
export function NavMainClient({ favoritesEnabled }: NavMainProps) {
  const pathname = usePathname();
  const tGroup = useTranslations('Navigation.Groups');
  const tItem = useTranslations('Navigation.Items');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load and save favorites from/to localStorage
  useEffect(() => {
    if (!favoritesEnabled) return;
    const raw = localStorage.getItem('navFavorites');
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch {
        setFavorites([]);
      }
    }
  }, [favoritesEnabled]);

  useEffect(() => {
    if (!favoritesEnabled) return;
    localStorage.setItem('navFavorites', JSON.stringify(favorites));
  }, [favoritesEnabled, favorites]);

  const toggleFavorite = (url: string) => {
    if (!favoritesEnabled) return;
    setFavorites((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const baseGroups = useMemo(
    () => [
      {
        label: tGroup('overview'),
        icon: HomeIcon,
        items: [{ title: tItem('overview'), url: '/', icon: HomeIcon }],
      },
      {
        label: tGroup('sales'),
        icon: ShoppingCartIcon,
        items: [
          { title: tItem('orders'), url: '/orders', icon: ShoppingCartIcon },
          { title: tItem('routes'), url: '/routes', icon: Route },
          { title: tItem('addresses'), url: '/addresses', icon: MapPin },
          {
            title: tItem('statistics'),
            url: '/orders/statistics',
            icon: ChartLine,
          },
          {
            title: tItem('statistics'),
            url: '/routes/statistics',
            icon: ChartLine,
          },
        ],
      },
      {
        label: tGroup('products'),
        icon: Box,
        items: [
          { title: tItem('products'), url: '/products', icon: Box },
          { title: tItem('categories'), url: '/categories', icon: Shapes },
          {
            title: tItem('statistics'),
            url: '/products/statistics',
            icon: ChartLine,
          },
          {
            title: tItem('statistics'),
            url: '/categories/statistics',
            icon: ChartLine,
          },
        ],
      },
      {
        label: tGroup('customers'),
        icon: UsersIcon,
        items: [
          { title: tItem('customers'), url: '/customers', icon: UsersIcon },
          {
            title: tItem('statistics'),
            url: '/customers/statistics',
            icon: ChartLine,
          },
        ],
      },
      {
        label: tGroup('employees'),
        icon: UserPen,
        items: [
          { title: tItem('employees'), url: '/employees', icon: UserPen },
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
        items: [{ title: tItem('settings'), url: '/settings', icon: Bolt }],
      },
    ],
    [tGroup, tItem]
  );

  const navGroups = useMemo(() => {
    const base = baseGroups.map((g) => ({ ...g, items: [...g.items] })); // clone groups
    if (!favoritesEnabled) return base;
    const allItems = base.flatMap((g) => g.items);
    const favItems = allItems.filter((i) => favorites.includes(i.url));

    // Entferne Favoriten aus Originalgruppen
    for (const group of base) {
      group.items = group.items.filter((i) => !favorites.includes(i.url));
    }

    const favoritesGroup =
      favItems.length > 0
        ? [{ label: 'Favorites', icon: Star, items: favItems }]
        : [];

    return [...favoritesGroup, ...base];
  }, [baseGroups, favoritesEnabled, favorites]);

  const filteredGroups = useMemo(() => {
    if (!query) return navGroups;
    const lower = query.toLowerCase();
    return navGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.title.toLowerCase().includes(lower)),
      }))
      .filter(
        (g) => g.items.length > 0 || g.label.toLowerCase().includes(lower)
      );
  }, [query, navGroups]);

  const isGroupActive = (items: { url: string }[]) =>
    items.some(
      (item) => pathname === item.url || pathname.startsWith(item.url + '/')
    );

  return (
    <>
      <div className='mt-4'>
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
                        <group.icon
                          size={16}
                          {...(group.label === 'Favorites'
                            ? { fill: '#facc15', color: '#facc15' }
                            : {})}
                        />
                        <span>{group.label}</span>
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items.map((item) => (
                          <SidebarMenuSubItem
                            key={item.title}
                            className='relative'
                          >
                            <SidebarMenuSubButton
                              asChild
                              className={
                                pathname === item.url ||
                                pathname.startsWith(item.url + '/')
                                  ? 'bg-primary text-primary-foreground'
                                  : ''
                              }
                            >
                              <Link href={item.url} className='flex-1'>
                                <span className='flex items-center gap-2'>
                                  {item.icon && <item.icon size={16} />}
                                  {item.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                            {favoritesEnabled && (
                              <SidebarMenuAction
                                onClick={() => toggleFavorite(item.url)}
                                showOnHover
                              >
                                {favorites.includes(item.url) ? (
                                  <StarOff size={16} />
                                ) : (
                                  <Star size={16} />
                                )}
                                <span className='sr-only'>Favorite</span>
                              </SidebarMenuAction>
                            )}
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                group.items.map((item) => (
                  <SidebarMenuItem key={item.title} className='relative'>
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
                      <Link href={item.url} className='flex-1'>
                        {item.icon && <item.icon size={16} />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {favoritesEnabled && (
                      <SidebarMenuAction
                        onClick={() => toggleFavorite(item.url)}
                        showOnHover
                      >
                        {favorites.includes(item.url) ? (
                          <StarOff size={16} />
                        ) : (
                          <Star size={16} />
                        )}
                        <span className='sr-only'>Favorite</span>
                      </SidebarMenuAction>
                    )}
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
