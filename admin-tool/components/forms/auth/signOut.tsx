import { signOut } from '@/auth';
import { SidebarMenuAction } from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';

export default function SignOutComponent() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <SidebarMenuAction type='submit' className='items-center gap-2'>
        <LogOut className='w-6 h-6' type='submit' />
      </SidebarMenuAction>
    </form>
  );
}
