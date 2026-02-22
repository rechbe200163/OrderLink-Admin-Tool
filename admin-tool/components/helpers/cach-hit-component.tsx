import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { DatabaseZap } from 'lucide-react';
// for not this a a debug feature only, to show if the cache is working or not, we can use the cacheHit property from the API response and display an indicator in the UI. This component can be used in any page that makes API calls to show whether the data was served from the cache or not.
function CacheHitIndicatorComponent() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='outline'>
          <DatabaseZap />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          The data shown was served from the cache. note this is a debug feature
          only, to show if the cache is working or not, we can use the cacheHit
          property from the API response and display an indicator in the UI.
          This component can be used in any page that makes API calls to show
          whether the data was served from the cache or not.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export default CacheHitIndicatorComponent;
