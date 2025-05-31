'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { AlertCircle, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex items-center justify-center min-h-[50vh] p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className=' border-b '>
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-red-500' />
            <CardTitle className='text-red-700'>
              Etwas ist schiefgelaufen!
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className='pt-6 pb-4'>
          <div className='space-y-2 text-muted-foreground'>
            <p>Beim Verarbeiten Ihrer Anfrage ist ein Fehler aufgetreten.</p>
            {error.digest && (
              <p className='text-xs font-mono bg-muted p-2 rounded'>
                Fehlercode: {error.digest}
              </p>
            )}
            {process.env.NODE_ENV === 'development' && error.message && (
              <p className='text-xs font-mono bg-muted p-2 rounded overflow-auto max-h-32'>
                Fehlermeldung: {error.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='border-t'>
          <Link
            className='w-full flex items-center text-center justify-center pt-3'
            href='/'
          >
            <HomeIcon className='mr-2 h-4 w-4' />
            Zur Startseite
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
