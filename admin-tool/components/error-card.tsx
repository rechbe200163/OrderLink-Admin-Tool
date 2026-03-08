import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { getTranslations } from 'next-intl/server';
import { CircleX } from 'lucide-react';

type ErrorCardKey =
  | 'Forbidden'
  | 'NotFound'
  | 'InternalServerError'
  | 'NetworkError'
  | 'Unauthorized'
  | 'DataFetchError';

interface ErrorCardProps {
  errorType?: ErrorCardKey;
}

export async function ErrorCard({
  errorType = 'DataFetchError',
}: ErrorCardProps) {
  const t = await getTranslations(`Errors.${errorType}`);

  return (
    <Card className='@container/card border-destructive/20 bg-destructive/5 shadow-sm'>
      <CardHeader className='gap-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-start gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive'>
              <CircleX className='size-5' />
            </div>

            <div className='space-y-1'>
              <Badge
                variant='destructive'
                className='w-fit rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide'
              >
                Fehler
              </Badge>

              <CardTitle className='text-lg font-semibold text-foreground @[250px]/card:text-xl'>
                {t('title')}
              </CardTitle>

              <CardDescription className='text-sm leading-6 text-muted-foreground'>
                {t('message')}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='rounded-lg border border-dashed border-destructive/20 bg-background/60 px-3 py-2 text-sm text-muted-foreground'>
          Bitte Seite neu laden oder später erneut versuchen.
        </div>
      </CardContent>
    </Card>
  );
}
