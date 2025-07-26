'use client';

import { useActionState, useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlidingNumber } from '../ui/sliding-number';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { renewSessionAction } from '@/lib/actions/auth.actions';

interface SessionTimerProps {
  issuedAt: number;
  expiresAt: number;
}

export default function SessionTimer({
  issuedAt,
  expiresAt,
}: SessionTimerProps) {
  const [remaining, setRemaining] = useState(expiresAt - Date.now());
  const [formState, action, isPending] = useActionState(
    renewSessionAction,
    undefined
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemaining = expiresAt - Date.now();
      setRemaining(newRemaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const totalSeconds = Math.floor(remaining / 1000);
  const isLowTime = totalSeconds < 300;
  const isCriticalTime = totalSeconds < 60;
  const isExpired = totalSeconds <= 0;

  const remHrs = Math.floor(Math.max(0, totalSeconds) / 3600);
  const remMins = Math.floor((Math.max(0, totalSeconds) % 3600) / 60);
  const remSecs = Math.max(0, totalSeconds) % 60;

  const [modalOpen, setModalOpen] = useState(false);

  // Öffne Modal bei kritischem oder abgelaufenem Zustand
  useEffect(() => {
    if (isLowTime || isExpired) {
      setModalOpen(true);
    }
  }, [isLowTime, isExpired]);

  return (
    <>
      {/* Timer-Anzeige */}
      <div className='relative group w-[130px]'>
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200',
            'bg-background/50 backdrop-blur-sm group-hover:bg-background/80',
            isExpired && 'border-destructive bg-destructive/10',
            isCriticalTime &&
              !isExpired &&
              'border-destructive bg-destructive/5 animate-pulse',
            isLowTime &&
              !isCriticalTime &&
              !isExpired &&
              'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
          )}
        >
          <Clock
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              isExpired && 'text-destructive',
              isCriticalTime && !isExpired && 'text-destructive',
              isLowTime && !isCriticalTime && !isExpired && 'text-orange-500',
              !isLowTime && 'text-muted-foreground'
            )}
          />
          <span
            className={cn(
              'font-mono text-sm font-medium transition-colors',
              isExpired && 'text-destructive',
              isCriticalTime && !isExpired && 'text-destructive',
              isLowTime &&
                !isCriticalTime &&
                !isExpired &&
                'text-orange-600 dark:text-orange-400',
              !isLowTime && 'text-foreground'
            )}
          >
            {isExpired ? (
              'EXPIRED'
            ) : (
              <div className='flex items-center gap-0.5 font-mono'>
                <SlidingNumber value={remHrs} padStart={true} />
                <span className='text-zinc-500'>:</span>
                <SlidingNumber value={remMins} padStart={true} />
                <span className='text-zinc-500'>:</span>
                <SlidingNumber value={remSecs} padStart={true} />
              </div>
            )}
          </span>
        </div>
      </div>

      {/* ⚠️ Kritisches Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
        <DialogContent
          className='sm:max-w-[425px]'
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {isExpired ? 'Session abgelaufen' : 'Session läuft bald ab'}
            </DialogTitle>
            <DialogDescription>
              {isExpired
                ? 'Deine Sitzung ist abgelaufen. Bitte erneuere sie, um fortzufahren.'
                : 'Deine Sitzung läuft in Kürze ab. Bitte verlängere sie, um Datenverlust zu vermeiden.'}
            </DialogDescription>
          </DialogHeader>

          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline' onClick={() => setModalOpen(false)}>
              Schließen
            </Button>
            <form action={action} className='flex items-center gap-2'>
              <Button type='submit'>Session verlängern</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
