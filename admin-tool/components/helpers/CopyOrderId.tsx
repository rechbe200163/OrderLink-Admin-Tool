'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
// import { useTranslations } from 'next-intl';

const CopyToClipboard = ({ value }: { value: string }) => {
  // const t = useTranslations('toast');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true); // Set copied state to true
      toast({
        description: 'Copied to clipboard',
        // description: t('clipboard'),
      });

      // Reset the icon back to Copy after a short delay
      setTimeout(() => setCopied(false), 10000);
    });
  };

  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-6 w-6'
      onClick={handleCopy}
    >
      {copied ? (
        <Check className='h-4 w-4 text-green-500' /> // Show Check icon when copied
      ) : (
        <Copy className='h-4 w-4' /> // Default Copy icon
      )}
      <span className='sr-only'>Copied To Clipboard</span>
    </Button>
  );
};

export default CopyToClipboard;
