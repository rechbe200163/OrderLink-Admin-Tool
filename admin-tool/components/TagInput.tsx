'use client';

import { Tag, TagInput, Delimiter } from 'emblor';
import { useId, useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Component() {
  const id = useId();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [exampleTags, setExampleTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  // Initialize tags from URL on load
  useEffect(() => {
    const rawParams = searchParams.toString();
    const tagsFromParams = rawParams
      .split('&')
      .filter((param) => param.includes('tag=') || /^\d+$/.test(param))
      .map((param, index) => ({
        id: `${index}`,
        text: param.replace('tag=', ''),
      }));

    setExampleTags(tagsFromParams.slice(0, 1)); // Limit to one tag
  }, [searchParams]);

  // Update search params when tags change
  const updateSearchParams = (tags: Tag[]) => {
    const params = new URLSearchParams(searchParams);

    // Clear any existing "tag" params
    params.delete('tag');

    // Join tags with "&" and set them as a single "tag" parameter
    if (tags.length > 0) {
      params.set('tag', tags.map((tag) => tag.text).join('&'));
    }

    // Update the URL
    replace(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, ''); // Remove non-numbers
    setInputValue(numericValue);
  };

  const validateTag = (tag: string) => /^\d+$/.test(tag); // Only allow numbers

  const handleSetTags = (newTags: Tag[] | ((prevTags: Tag[]) => Tag[])) => {
    const tagsToUpdate =
      typeof newTags === 'function' ? newTags(exampleTags) : newTags;

    // Limit to one tag
    const limitedTags = tagsToUpdate.slice(0, 1);
    setExampleTags(limitedTags);
    updateSearchParams(limitedTags);
  };

  const t = useTranslations('FilterAndSearch.Search');

  return (
    <div>
      <TagInput
        id={id}
        tags={exampleTags}
        setTags={handleSetTags}
        placeholder={t('searchForOption3')}
        onInputChange={handleInputChange}
        value={inputValue}
        validateTag={validateTag}
        delimiter={Delimiter.Enter}
        styleClasses={{
          inlineTagsContainer:
            'border-input rounded-md bg-background shadow-2xs transition-[color,box-shadow] focus-within:border-ring outline-hidden focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1',
          input: 'w-full min-w-[80px] shadow-none px-2 h-7',
          tag: {
            body: 'h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7',
            closeButton:
              'absolute top-1/2 right-1 transform -translate-y-1/2 p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-hidden focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground',
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
      />
    </div>
  );
}
