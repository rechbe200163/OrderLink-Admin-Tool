import { SidebarMenuAction } from '@/components/ui/sidebar';
import { deleteCookie } from '@/lib/cookies/cookie-managment';
import { LogOut } from 'lucide-react';

export default function SignOutComponent() {
  return (
    <form
      action={async () => {
        'use server';
        await deleteCookie('token');
        await deleteCookie('user');
      }}
    >
      <SidebarMenuAction type='submit' className='items-center gap-2'>
        <LogOut className='w-6 h-6' type='submit' />
      </SidebarMenuAction>
    </form>
  );
}
