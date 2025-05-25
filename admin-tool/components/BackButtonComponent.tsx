import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

interface GoBackButtonComponentProps {
  href: string;
  label?: string;
}

export default function GoBackButtonComponent({
  href,
  label,
}: GoBackButtonComponentProps) {
  return (
    <Button variant='link' className='gap-1' asChild>
      <Link href={href}>
        <ChevronLeftIcon className='opacity-60' size={16} aria-hidden='true' />
        {label || 'Go back'}
      </Link>
    </Button>
  );
}
