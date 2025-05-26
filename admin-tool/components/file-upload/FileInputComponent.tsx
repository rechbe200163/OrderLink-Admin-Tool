import Image from 'next/image';
import React, { useId } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabaseService } from '@/lib/utlis/SupabaseStorageService';

export default function FileInputComponent({
  label,
  onImageUpload,
  initialImage,
}: {
  label: string;
  onImageUpload: (file: File | null) => void;
  initialImage?: string;
}) {
  const id = useId();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialImage) {
      supabaseService.getSingedUrlSupabase(initialImage).then((url) => {
        setImagePreview(url);
      });
    }
  }, [initialImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      onImageUpload(file); // Pass the selected file to the parent component
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className='p-0 pe-3 file:me-3 file:border-0 file:border-e'
        type='file'
        name='image'
        accept='.png, .jpeg, .jpg'
        onChange={handleFileChange}
      />
      {imagePreview && (
        <Image
          src={imagePreview}
          alt='Preview'
          className='mt-2'
          width='300'
          height='300'
        />
      )}
    </div>
  );
}
