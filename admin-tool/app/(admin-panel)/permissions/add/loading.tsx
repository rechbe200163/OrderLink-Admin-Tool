import { GenericLoading } from '@/components/loading-states/loading';
import React from 'react';
export default function Loading() {
  return (
    <div className='flex items-center justify-center h-full'>
      <GenericLoading />;
    </div>
  );
}
