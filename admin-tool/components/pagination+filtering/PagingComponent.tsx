'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { SelectNative } from '@/components/ui/select-native';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMemo, useId } from 'react';
import { useTranslations } from 'next-intl';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalValues: number;
};

export default function PaginationComponent({
  currentPage,
  totalPages,
  totalValues,
}: PaginationProps) {
  const t = useTranslations('Pagination');
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Helper: Validate and normalize page and limit values
  function validateParams(page: number, limit: number) {
    const allowedLimits = [10, 25, 50, 100];
    const validLimit = allowedLimits.includes(limit) ? limit : 10;
    const validPage = Math.max(1, Math.min(page, totalPages));
    return { validPage, validLimit };
  }

  // Helper: Update URL with given page and validated parameters
  function updateUrlWithPage(page: number) {
    const { validPage, validLimit } = validateParams(page, limit);
    params.set('page', validPage.toString());
    params.set('limit', validLimit.toString());
    return `${pathname}?${params.toString()}`;
  }

  // Helper: Calculate shown results (start and end)
  const shownValues = useMemo(() => {
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalValues);
    return { start, end };
  }, [currentPage, limit, totalValues]);

  return (
    <div className='flex items-center justify-between gap-8'>
      {/* Results per page */}
      <div className='flex items-center gap-3'>
        <Label htmlFor={id}>{t('rowsPerPage')}</Label>
        <SelectNative
          defaultValue={limit.toString()}
          onChange={(e) => {
            const value = e.target.value;
            const newLimit = parseInt(value, 10);
            if (newLimit !== limit) {
              params.set('limit', value);
              params.delete('page');
              router.push(`${pathname}?${params.toString()}`);
            }
          }}
          id={id}
          className='w-fit whitespace-nowrap h-9 ps-3 pe-8'
        >
          <option value='10'>10</option>
          <option value='25'>25</option>
          <option value='50'>50</option>
          <option value='100'>100</option>
        </SelectNative>
      </div>

      {/* Page number information */}
      <div className='flex grow justify-end whitespace-nowrap text-sm text-muted-foreground'>
        <p
          className='whitespace-nowrap text-sm text-muted-foreground'
          aria-live='polite'
        >
          <span className='text-foreground'>
            {shownValues.start} - {shownValues.end}
          </span>{' '}
          {t('of')} <span className='text-foreground'>{totalValues}</span>
        </p>
      </div>

      {/* Pagination */}
      <div>
        <Pagination>
          <PaginationContent>
            {/* First page button */}
            <PaginationItem>
              <PaginationLink
                className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
                href={updateUrlWithPage(1)}
                aria-label={t('goToFist')}
                aria-disabled={currentPage === 1}
              >
                <ChevronFirst size={16} strokeWidth={2} aria-hidden='true' />
              </PaginationLink>
            </PaginationItem>

            {/* Previous page button */}
            <PaginationItem>
              <PaginationLink
                className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
                href={updateUrlWithPage(currentPage - 1)}
                aria-label={t('goToPrev')}
                aria-disabled={currentPage === 1}
              >
                <ChevronLeft size={16} strokeWidth={2} aria-hidden='true' />
              </PaginationLink>
            </PaginationItem>

            {/* Next page button */}
            <PaginationItem>
              <PaginationLink
                className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
                href={updateUrlWithPage(currentPage + 1)}
                aria-label={t('goToNext')}
                aria-disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} strokeWidth={2} aria-hidden='true' />
              </PaginationLink>
            </PaginationItem>

            {/* Last page button */}
            <PaginationItem>
              <PaginationLink
                className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
                href={updateUrlWithPage(totalPages)}
                aria-label={t('goToLast')}
                aria-disabled={currentPage === totalPages}
              >
                <ChevronLast size={16} strokeWidth={2} aria-hidden='true' />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
