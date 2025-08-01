'use client';
import { ThemeSwitcher } from '@/components/ui/kibo-ui/theme-switcher';
import { useTheme } from 'next-themes';
import { useState } from 'react';
const Example = () => {
  const [theme, setThemeToggle] = useState<'light' | 'dark' | 'system'>(
    'system'
  );
  const { setTheme } = useTheme();
  const handleTheme = (theme: 'light' | 'dark' | 'system') => {
    setThemeToggle(theme);
    setTheme(theme);
  };
  return (
    <ThemeSwitcher defaultValue='system' onChange={handleTheme} value={theme} />
  );
};
export default Example;
