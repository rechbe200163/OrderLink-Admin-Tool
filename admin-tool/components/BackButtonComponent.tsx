import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface GoBackButtonComponentProps {
  href: string;
  label?: string;
}

export default function GoBackButtonComponent({
  href,
  label,
}: GoBackButtonComponentProps) {
  const t = useTranslations('Components.BackButton');
  return (
    <Button variant='link' className='gap-1' asChild>
      <Link href={href}>
        <ChevronLeftIcon className='opacity-60' size={16} aria-hidden='true' />
        {label || t('goBack')}
      </Link>
    </Button>
  );
}
