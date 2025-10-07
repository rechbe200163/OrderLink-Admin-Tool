'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const themes = [
  {
    key: 'system',
    icon: Monitor,
    label: 'System theme',
  },
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
];

export type ThemeSwitcherProps = {
  value?: 'light' | 'dark' | 'system';
  onChange?: (theme: 'light' | 'dark' | 'system') => void;
  defaultValue?: 'light' | 'dark' | 'system';
  className?: string;
};

export const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue = 'system',
  className,
}: ThemeSwitcherProps) => {
  const [theme, setTheme] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });

  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleThemeClick = useCallback(
    (themeKey: 'light' | 'dark' | 'system') => {
      setTheme(themeKey);
      setExpanded(false);
    },
    [setTheme]
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className={cn(
        'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
        className
      )}
      initial={false}
      animate={{
        width: expanded ? `${themes.length * 30}px` : '35px',
        transition: { type: 'spring', bounce: 0.2, duration: 0.4 },
      }}
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setExpanded(true);
      }}
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => setExpanded(false), 150);
      }}
    >
      <div className='flex h-full w-full items-center justify-center gap-1 px-1'>
        {themes.map(({ key, icon: Icon, label }) => {
          const isActive = key === theme;

          // Immer rendern, aber bei Collapse nur den aktiven zeigen
          if (!expanded && !isActive) return null;

          return (
            <button
              key={key}
              type='button'
              aria-label={label}
              onClick={() =>
                handleThemeClick(key as 'light' | 'dark' | 'system')
              }
              className='relative h-6 w-6 rounded-full transition-colors'
            >
              {isActive && (
                <motion.div
                  layoutId='activeTheme'
                  className='absolute inset-0 rounded-full bg-secondary'
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                />
              )}
              <Icon
                className={cn(
                  'relative z-10 m-auto h-4 w-4',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
