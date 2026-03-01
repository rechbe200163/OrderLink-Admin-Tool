import Link from 'next/link';
import { Suspense } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import type { Product } from '@/lib/types';
import { MoreVertical, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatPrice } from '@/lib/utils';
import ImageSkeleton from '@/components/images/ImageSkeleton';
import Image from 'next/image';
import { EmptyState, TableEmptyState } from '@/components/ui/empty-state';
import { useTranslations } from 'next-intl';
import { SortableTableHead } from '../customers/sort-table';

interface ProductTableProps {
  products: Product[];
  searchQuery?: string;
  categoryFilter?: string;
  onAddProduct?: () => void;
}

export function ProductTable({
  products,
  searchQuery,
  categoryFilter,
  onAddProduct,
}: ProductTableProps) {
  const t = useTranslations('Dashboard.Ressource.Products.Attributes');
  const tButtons = useTranslations('Dashboard.Ressource.Products.buttons');
  const tStatus = useTranslations('Dashboard.Ressource.Products.Status');
  const tEmptyState = useTranslations(
    'Dashboard.Ressource.Products.EmptyState',
  );
  const isFiltered = !!(searchQuery || categoryFilter);

  // const [headers, setHeaders] = useState<string[]>([]);

  // useEffect(() => {
  //   if (products.length > 0) {
  //     setHeaders(Object.keys(products[0]));
  //   }
  // }, [products]);

  return (
    <div className='bg-background text-foreground p-4 rounded-lg shadow-xs'>
      <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
        <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-xs'>
          <TableRow className='hover:bg-muted'>
            {/* {headers.map((header, idx) => (
              <TableHead key={idx} className='w-20'>
                {header}
              </TableHead>
            ))} */}
            <TableHead className='w-20'>{t('image')}</TableHead>
            <SortableTableHead
              label={t('name')}
              sortKey='name'
              className='w-40'
            />

            <SortableTableHead
              label={t('price')}
              sortKey='price'
              className='w-60'
            />

            <TableHead className='w-60'>{t('description')}</TableHead>

            <SortableTableHead
              label={t('stock')}
              sortKey='stock'
              className='w-60'
            />

            <SortableTableHead
              label={t('createdAt')}
              sortKey='createdAt'
              className='w-40'
              align='right'
            />

            <TableHead className='w-40 text-right'>{t('status')}</TableHead>

            <TableHead className='w-20 text-right'>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow
                key={product.productId}
                className='hover:bg-muted/50 transition-colors cursor-pointer'
              >
                <TableCell className='w-20 flex items-center justify-center p-2'>
                  <Link href={`/products/${product.productId}/edit`}>
                    <Suspense fallback={<ImageSkeleton />}>
                      <div className='relative w-16 h-16 overflow-hidden rounded-md'>
                        {product.imagePath ? (
                          <Image
                            src={product.imagePath}
                            width={20}
                            height={20}
                            alt=''
                          />
                        ) : (
                          <div className='w-full h-full bg-muted flex items-center justify-center'>
                            <span className='text-muted-foreground text-sm'>
                              {t('noImage')}
                            </span>
                          </div>
                        )}
                      </div>
                    </Suspense>
                  </Link>
                </TableCell>
                <TableCell className='w-40 font-medium'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell className='w-40'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {formatPrice(product.price)}
                  </Link>
                </TableCell>
                <TableCell className='w-60 truncate max-w-xs'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {product.description || t('noDescription')}
                  </Link>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {product.stock}
                  </Link>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {formatDateTime(product.createdAt)}
                  </Link>
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Link
                    href={`/products/${product.productId}/edit`}
                    className='hover:underline'
                  >
                    {product.deleted ? (
                      <Badge variant='destructive'>{tStatus('inactive')}</Badge>
                    ) : (
                      <Badge variant='success'>{tStatus('active')}</Badge>
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
                        <Link href={`/products/${product.productId}/edit`}>
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
            <TableEmptyState colSpan={8}>
              <EmptyState
                icon={Package}
                title={
                  isFiltered ? tEmptyState('title') : tEmptyState('subtitle')
                }
                description={tEmptyState('description')}
                isFiltered={isFiltered}
                filterMessage={
                  searchQuery
                    ? `Suche: "${searchQuery}"${categoryFilter ? ` | Kategorie: ${categoryFilter}` : ''}`
                    : categoryFilter
                      ? `Kategorie: ${categoryFilter}`
                      : undefined
                }
                action={
                  !isFiltered && onAddProduct
                    ? {
                        label: tEmptyState('createFirst'),
                        onClick: onAddProduct,
                      }
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
