'use client';

import { useEffect, useState } from 'react';
import { renewSession } from '@/lib/actions/auth.actions';

interface SessionTimerProps {
  issuedAt: number;
  expiresAt: number;
}

export default function SessionTimer({ issuedAt, expiresAt }: SessionTimerProps) {
  const sessionDuration = expiresAt - issuedAt;
  const [expiry, setExpiry] = useState(expiresAt);
  const [remaining, setRemaining] = useState(expiry - Date.now());

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
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  async function handleRenew() {
    await renewSession();
    const newExpiry = Date.now() + sessionDuration;
    setExpiry(newExpiry);
    setRemaining(newExpiry - Date.now());
  }

  return (
    <span className="relative group text-xs font-mono">
      <span className="group-hover:hidden">{format(remaining)}</span>
      <button
        onClick={handleRenew}
        className="hidden group-hover:inline-flex underline"
      >
        Renew Session
      </button>
    </span>
  );
}
