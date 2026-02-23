'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMemo, useId } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

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
    <div className='flex items-center justify-between gap-8 mt-4 mb-5 bg-accent rounded-md shadow-sm p-2'>
      {/* Results per page */}
      <div className='flex items-center gap-3 ml-3'>
        <Label htmlFor={id}>{t('rowsPerPage')}</Label>
        <Select
          defaultValue={limit.toString()}
          onValueChange={(value) => {
            const newLimit = parseInt(value, 10);
            if (newLimit !== limit) {
              params.set('limit', value);
              params.delete('page'); // Reset to first page when limit changes
              router.push(`${pathname}?${params.toString()}`);
            }
          }}
        >
          <SelectTrigger id={id} className='w-fit whitespace-nowrap'>
            <SelectValue placeholder='Select number of results' />
          </SelectTrigger>
          <SelectContent className='[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2'>
            <SelectItem value='10'>10</SelectItem>
            <SelectItem value='25'>25</SelectItem>
            <SelectItem value='50'>50</SelectItem>
            <SelectItem value='100'>100</SelectItem>
          </SelectContent>
        </Select>
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
            {/* First page */}
            <PaginationItem>
              <PaginationLink
                className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
                aria-label={t('goToFist')}
                aria-disabled={currentPage === 1}
                href={updateUrlWithPage(1)}
                scroll={false}
              >
                <ChevronFirst size={16} strokeWidth={2} aria-hidden='true' />
              </PaginationLink>
            </PaginationItem>

            {/* Previous page */}
            <PaginationItem>
              <PaginationLink
                className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
                aria-label={t('goToPrev')}
                aria-disabled={currentPage === 1}
                href={updateUrlWithPage(currentPage - 1)}
                scroll={false}
              >
                <ChevronLeft size={16} strokeWidth={2} aria-hidden='true' />
              </PaginationLink>
            </PaginationItem>

            {/* Next page */}
            <PaginationItem>
              <PaginationLink
                className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
                aria-label={t('goToNext')}
                aria-disabled={currentPage === totalPages}
                href={updateUrlWithPage(currentPage + 1)}
                scroll={false}
              >
                <ChevronRight size={16} strokeWidth={2} aria-hidden='true' />
              </PaginationLink>
            </PaginationItem>

            {/* Last page */}
            <PaginationItem>
              <PaginationLink
                className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
                aria-label={t('goToLast')}
                aria-disabled={currentPage === totalPages}
                href={updateUrlWithPage(totalPages)}
                scroll={false}
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
