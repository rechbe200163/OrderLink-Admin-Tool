import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Category } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, FolderOpen } from 'lucide-react';
import { EmptyState, TableEmptyState } from '@/components/ui/empty-state';

interface CategoryTableProps {
  categories: Category[];
  searchQuery?: string;
  statusFilter?: string;
}

export function CategoryTable({
  categories,
  searchQuery,
  statusFilter,
}: CategoryTableProps) {
  const t = useTranslations('Dashboard.Ressource.Categories.Attributes');
  const tButtons = useTranslations('Dashboard.Ressource.Categories.buttons');
  const tStatus = useTranslations('Dashboard.Ressource.Categories.Status');
  const tEmptyState = useTranslations('Dashboard.Ressource.Categories.EmptyState');
  const isFiltered = !!(searchQuery || statusFilter);
  
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
        <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
          <TableRow className='hover:bg-muted'>
            <TableHead className='w-40 text-start'>
              {t('name')}
            </TableHead>
            <TableHead className='w-40 text-right'>
              {t('status')}
            </TableHead>
            <TableHead className='w-20 text-right'>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <TableRow key={category.categoryId} className='hover:bg-muted'>
                <TableCell className='w-40 font-medium text-start'>
                  <Link
                    href={`categories/${category.categoryId}/edit`}
                    className='hover:underline'
                  >
                    {category.name}
                  </Link>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`categories/${category.categoryId}/edit`}
                    className='hover:underline'
                  >
                    {category.deleted ? (
                      <Badge variant={'destructive'}>
                        {tStatus('inactive')}
                      </Badge>
                    ) : (
                      <Badge variant={'success'}>{tStatus('active')}</Badge>
                    )}
                  </Link>
                </TableCell>
                <TableCell className='w-20 text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem asChild>
                        <Link href={`categories/${category.categoryId}/edit`}>
                          {tButtons('editButton')}
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem disabled>
                        Löschen
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyState colSpan={3}>
              <EmptyState
                icon={FolderOpen}
                title={
                  isFiltered
                    ? tEmptyState('title')
                    : tEmptyState('subtitle')
                }
                description={tEmptyState('description')}
                isFiltered={isFiltered}
                filterMessage={
                  searchQuery || statusFilter
                    ? `${searchQuery ? `Suche: "${searchQuery}"` : ''}${statusFilter ? ` | Status: ${statusFilter}` : ''}`
                    : undefined
                }
              />
            </TableEmptyState>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
