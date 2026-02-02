'use client';

import { useState, useTransition } from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { setUserLocale } from '@/services/locale';
import { Locale } from '@/i18n/config';
import { useRouter } from 'next/navigation';

const languages = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  nl: 'Nederlands',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
} as const;

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export default function LanguageSwitcher({
  currentLocale,
  className,
}: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(currentLocale);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    startTransition(async () => {
      await setUserLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <div className={className}>
      <Label htmlFor="language" className="flex items-center gap-2 mb-2">
        <Globe className="h-4 w-4" />
        Language / Sprache / 语言
      </Label>
      <Select
        value={locale}
        onValueChange={(value) => handleLocaleChange(value as Locale)}
        disabled={isPending}
      >
        <SelectTrigger id="language" className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && (
        <p className="text-sm text-muted-foreground mt-1">
          Applying language change...
        </p>
      )}
    </div>
  );
}
