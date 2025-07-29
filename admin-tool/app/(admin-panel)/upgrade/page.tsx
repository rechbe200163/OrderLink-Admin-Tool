import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upgrade Required',
};

export default function UpgradePage({ searchParams }: any) {
  const moduleName = typeof searchParams?.module === 'string' ? searchParams.module : 'feature';
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <h1 className='text-2xl font-bold'>Upgrade Needed</h1>
        <p>You need to upgrade to access the {moduleName} module.</p>
        <a href='#' className='underline text-primary'>Buy now</a>
      </div>
    </div>
  );
}
