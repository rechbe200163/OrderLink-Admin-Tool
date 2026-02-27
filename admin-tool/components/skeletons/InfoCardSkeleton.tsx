import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';

export default function InfoCardSkeleton() {
  return (
    <Card className='@container/card'>
      <CardHeader className='gap-3'>
        {/* Top row: title left + badge right */}
        <div className='flex items-center justify-between gap-3'>
          <Skeleton className='h-4 w-40' />
          {/* badge / pill */}
          <Skeleton className='h-6 w-28 rounded-full' />
        </div>

        {/* Big value */}
        <Skeleton className='h-10 w-56 @[250px]/card:h-11 @[350px]/card:w-72' />
      </CardHeader>

      <CardFooter className='flex-col items-start gap-2'>
        {/* "Mehr als letzten Monat" row with icon */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded-sm' />
          <Skeleton className='h-4 w-44' />
        </div>

        {/* sub text */}
        <Skeleton className='h-4 w-56 @[350px]/card:w-72' />
      </CardFooter>
    </Card>
  );
}
