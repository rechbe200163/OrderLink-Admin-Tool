import { GenericLoading } from '@/components/loading-states/loading';
import React from 'react';

const loading = () => {
  return (
    <div className='flex items-center justify-center h-full'>
      <GenericLoading />
    </div>
  );
};

export default loading;
