'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { SortOrder } from '@/lib/types';

interface SortableTableHeadProps {
  label: React.ReactNode;
  sortKey: string; // z.B. "email"
  align?: 'left' | 'right';
  className?: string;
  resetPageParam?: string; // z.B. "page" (bei Sort reset auf 1)
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

    // reset page param to 1 when sorting changes
    if (resetPageParam) params.set(resetPageParam, '1');

    router.push(`${pathname}?${params.toString()}`);
  }

  const Icon = !isActive
    ? ArrowUpDown
    : activeOrder === 'asc'
      ? ArrowUp
      : ArrowDown;

  return (
    <TableHead
      onClick={onClick}
      role='button'
      tabIndex={0}
      className={[
        'select-none cursor-pointer',
        'hover:bg-muted transition-colors',
        align === 'right' ? 'text-right' : 'text-left',
        className ?? '',
      ].join(' ')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div
        className={[
          'flex items-center gap-2',
          align === 'right' ? 'justify-end' : 'justify-start',
        ].join(' ')}
      >
        <span>{label}</span>
        <Icon className='h-4 w-4 opacity-70' />
      </div>
    </TableHead>
  );
}
