import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getSession } from '@/lib/utlis/getSession';
import SessionTimer from './helpers/SessionTimer';
import PathBreadcrumbs from './helpers/PathBreadcrumbs';
import { sessionTimerFeatureFlag } from '@/lib/feature-flags/flags';

export async function SiteHeader() {
  const session = await getSession();
  // const enabled = sessionTimerFeatureFlag;
  // console.log('Feature Flag Enabled:', enabled);
  if (!session) return <NoSessionError />;

  return (
    <header className='group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mx-2 data-[orientation=vertical]:h-4'
          />
          <PathBreadcrumbs />
        </div>
        <div className='flex items-center gap-2 m-5'>
          <SessionTimer
            issuedAt={session.token.issuedAt}
            expiresAt={session.token.expiresAt}
          />
        </div>
      </div>
    </header>
  );
}

async function NoSessionError() {
  return (
    <div className='flex items-center justify-center h-full'>
      <p className='text-red-500'>
        You are not logged in. Please log in to continue.
      </p>
    </div>
  );
}
