import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Category } from '@prisma/client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function CategoryTable({ categories }: { categories: Category[] }) {
  const t = useTranslations('Dashboard.Ressource.Categories');
  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-sm'>
      <div className='[&>div]:max-h-[50vh] min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-sm'>
            <TableRow className='hover:bg-muted'>
              <TableHead className='w-40 text-start'>
                {t('Attributes.name')}
              </TableHead>
              <TableHead className='w-40 text-right'>
                {t('Attributes.status')}
              </TableHead>
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
                          {t('Attributes.Status.inactive')}
                        </Badge>
                      ) : (
                        <Badge variant={'success'}>{t('Status.active')}</Badge>
                      )}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className='text-center'>
                  {t('Attributes.notFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
