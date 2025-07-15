'use client';
import {
  CreditCardIcon,
  LogOut,
  MoreVerticalIcon,
  UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import UserSettingsModal from './UserSettingsModal';
import { logOut } from '@/lib/actions/auth.actions';
import type { Session } from '@/lib/utlis/getSession';
import { useTranslations } from 'next-intl';

export default function NavUser({ session }: { session: Session }) {
  // if user is null return generic user object
  const { isMobile } = useSidebar();
  const tItem = useTranslations('Navigation.Items');
  // const user: User = await getCookie('user');
  if (!session) return null;
  const user = session?.user || {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };
  const { firstName = 'John', lastName = 'Doe' } = user;
  const name = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg grayscale'>
                <AvatarImage alt={name} />
                <AvatarFallback className='rounded-lg'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{name}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage alt={name} />
                  <AvatarFallback className='rounded-lg'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{name}</span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {user.email}
                  </span>
                </div>
              </div>{' '}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <UserSettingsModal user={user}>
                  <div className='flex items-center'>
                    <UserIcon className='mr-2 h-4 w-4' />
                    {tItem('profileSettings')}
                  </div>
                </UserSettingsModal>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon className='mr-2 h-4 w-4' />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>
              <LogOut className='mr-2 h-4 w-4' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
