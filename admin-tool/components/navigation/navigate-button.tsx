import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

type NavigateButtonProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    className?: string;
  };

function NavigateButton({
  href,
  children,
  variant,
  size,
  className,
  ...props
}: NavigateButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} {...props}>
        {children}
      </Link>
    </Button>
  );
}

export default NavigateButton;
