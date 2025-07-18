'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlidingNumber } from '../ui/sliding-number';

interface SessionTimerProps {
  issuedAt: number;
  expiresAt: number;
}

export default function SessionTimer({
  issuedAt,
  expiresAt,
}: SessionTimerProps) {
  const expiresAtMs = expiresAt;
  const expiry = expiresAtMs - issuedAt;
  const [remaining, setRemaining] = useState(expiry - Date.now());

  // ⏱ Timer-Tick alle 1 Sekunde
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(expiry - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

  const totalSeconds = Math.floor(remaining / 1000);
  // Less than 5 minutes
  const isLowTime = totalSeconds < 300;
  // Check if remaining time is critical (less than 1 minute)
  const isCriticalTime = totalSeconds < 60;

  const isExpired = totalSeconds <= 0;

  // Parse remaining time into hours, minutes, seconds
  const remHrs = Math.floor(Math.max(0, totalSeconds) / 3600);
  const remMins = Math.floor((Math.max(0, totalSeconds) % 3600) / 60);
  const remSecs = Math.max(0, totalSeconds) % 60;

  return (
    <div className='relative group w-[130px]'>
      {/* Timer-Anzeige */}
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
  );
}
