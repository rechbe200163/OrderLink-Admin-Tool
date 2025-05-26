import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function CustomerTableSkeleton() {
  return (
    <div>
      <div className='[&>div]:max-h-[50vh] min-w-full'>
        <Table className='border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none'>
          <TableHeader className='sticky top-0 z-10 bg-background/90 backdrop-blur-sm'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-20'>Avatar</TableHead>
              <TableHead className='w-40'>Name</TableHead>
              <TableHead className='w-60'>Email</TableHead>
              <TableHead className='w-40'>Phone</TableHead>
              <TableHead className='w-60'>Customer Reference</TableHead>
              <TableHead className='w-40 text-right'>Business Sector</TableHead>
              <TableHead className='w-40 text-right'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className='w-20 font-medium'>
                  <Skeleton className='h-10 w-10 rounded-full' />
                </TableCell>
                <TableCell className='w-40 font-medium'>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell className='w-60'>
                  <Skeleton className='h-4 w-40' />
                </TableCell>
                <TableCell className='w-40'>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell className='w-60'>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Skeleton className='h-4 w-20 ml-auto' />
                </TableCell>
                <TableCell className='w-40 text-right'>
                  <Skeleton className='h-6 w-16 ml-auto' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
