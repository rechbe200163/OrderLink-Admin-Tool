'use client';
import { Input } from '@/components/ui/input';
import { CircleX, ListFilter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchComponent({
  placeholder,
}: {
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Synchronize the 'inputValue' state with the query parameter 'query'
  const [inputValue, setInputValue] = useState(searchParams.get('query') || '');

  useEffect(() => {
    // Update the input value when the query parameter changes
    setInputValue(searchParams.get('query') || '');
  }, [searchParams]);

  const handleClearInput = () => {
    setInputValue('');
    // Clear the 'query' parameter in the URL
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className='space-y-2'>
      <div className='relative'>
        <Input
          className='peer pe-9 ps-9'
          placeholder={placeholder}
          type='text'
          aria-label={placeholder}
          value={inputValue} // Use value to make the input controlled
          onChange={(e) => {
            const newTerm = e.target.value;
            setInputValue(newTerm); // Update the input state as the user types
            handleSearch(newTerm); // Update the URL with the search term
          }}
        />
        <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'>
          <ListFilter size={16} strokeWidth={2} />
        </div>
        {inputValue && (
          <button
            className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Clear filter'
            onClick={() => {
              handleClearInput(); // Clear the input and URL query
            }}
          >
            <CircleX size={16} strokeWidth={2} aria-hidden='true' />
          </button>
        )}
      </div>
    </div>
  );
}
