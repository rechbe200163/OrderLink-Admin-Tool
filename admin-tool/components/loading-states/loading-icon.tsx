import React from 'react';
import { Spinner } from '../ui/kibo-ui/spinner';

const LoadingIcon = () => {
  return (
    <div>
      <Spinner variant='ellipsis' />
    </div>
  );
};

export default LoadingIcon;
