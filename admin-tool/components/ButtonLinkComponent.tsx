import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

interface ButtonLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'link';
}

export const ButtonLinkComponent = ({
  href,
  label,
  icon,
  variant,
}: ButtonLinkProps) => {
  return (
    <Button asChild variant={variant}>
      <Link href={href}>
        {icon && <span className='mr-2'>{icon}</span>}
        {label}
      </Link>
    </Button>
  );
};
