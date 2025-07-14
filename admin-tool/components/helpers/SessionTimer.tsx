'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { renewSessionAction } from '@/lib/actions/auth.actions'; // Server Action
import { Button } from '../ui/button';
import { Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionTimerProps {
  issuedAt: number;
  expiresAt: number;
}

export default function SessionTimer({
  issuedAt,
  expiresAt,
}: SessionTimerProps) {
  const issuedAtMs = issuedAt;
  const expiresAtMs = expiresAt;
  const initialDuration = expiresAtMs - issuedAtMs;

  const [expiry, setExpiry] = useState(expiresAtMs);
  const [remaining, setRemaining] = useState(expiry - Date.now());

  // ⏱ Timer-Tick alle 1 Sekunde
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(expiry - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

  function format(ms: number) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const isLowTime = totalSeconds < 300;
  const isCriticalTime = totalSeconds < 60;
  const isExpired = totalSeconds <= 0;

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
          {isExpired ? 'EXPIRED' : format(remaining)}
        </span>
      </div>
    </div>
  );
}
