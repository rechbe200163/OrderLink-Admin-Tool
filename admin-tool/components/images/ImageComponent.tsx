import type React from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { supabaseService } from '@/lib/utlis/SupabaseStorageService';

interface ImagesComponentProps {
  imagePath: string | null;
  alt: string;
  width?: number;
  style?: React.CSSProperties;
  sizes?: string;
  height?: number;
  classname?: string;
}

async function ImageComponent({
  imagePath,
  alt,
  sizes,
  classname = '',
}: ImagesComponentProps) {
  if (!imagePath || imagePath === '') {
    return (
      <div className='w-full h-full bg-muted flex items-center justify-center'>
        <ImageOff className='h-8 w-8 text-muted-foreground/50' />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-lg ${classname}`}
    >
      <Image
        src={imagePath || '/placeholder.svg'}
        alt={alt}
        fill={true}
        sizes={sizes || '(max-width: 768px) 100vw, 33vw'}
        className='object-contain w-full h-full transition-transform duration-300 hover:scale-105 p-2'
        loading='lazy'
        onError={(err) => {
          console.error('Image failed to load', err);
        }}
      />
    </div>
  );
}

export default ImageComponent;
