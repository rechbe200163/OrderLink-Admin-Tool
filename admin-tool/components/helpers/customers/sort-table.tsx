'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { SortOrder } from '@/lib/types';
import { Spinner } from '@/components/ui/kibo-ui/spinner';

interface SortableTableHeadProps {
  label: React.ReactNode;
  sortKey: string;
  align?: 'left' | 'right';
  className?: string;
  resetPageParam?: string;
}

export function SortableTableHead({
  label,
  sortKey,
  align = 'left',
  className,
  resetPageParam = 'page',
}: SortableTableHeadProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const activeSort = searchParams.get('sort');
  const activeOrder = (searchParams.get('order') as SortOrder | null) ?? null;

  const isActive = activeSort === sortKey;

  const nextOrder: SortOrder = !isActive
    ? 'asc'
    : activeOrder === 'asc'
      ? 'desc'
      : 'asc';

  function onClick() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortKey);
    params.set('order', nextOrder);

    if (resetPageParam) params.set(resetPageParam, '1');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const Icon = isPending
    ? Spinner
    : !isActive
      ? ArrowUpDown
      : activeOrder === 'asc'
        ? ArrowUp
        : ArrowDown;

  return (
    <TableHead
      onClick={onClick}
      role='button'
      tabIndex={0}
      aria-busy={isPending}
      aria-disabled={isPending}
      className={[
        'select-none cursor-pointer',
        'hover:bg-muted transition-colors',
        isPending ? 'pointer-events-none opacity-70' : '',
        align === 'right' ? 'text-right' : 'text-left',
        className ?? '',
      ].join(' ')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className={[
          'flex items-center gap-2',
          align === 'right' ? 'justify-end' : 'justify-start',
        ].join(' ')}
      >
        <span>{label}</span>
        <Icon
          className={[
            'h-4 w-4 opacity-70',
            isPending ? 'animate-spin' : '',
          ].join(' ')}
        />
      </div>
    </TableHead>
  );
}
