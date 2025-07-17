'use client';
import Image from 'next/image';
import { toast } from 'sonner';
import { useActionState } from 'react';
import { Category } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageOff, Loader2, Plus } from 'lucide-react';
import CustomeToast from '../toasts/CustomeErrorToast';
import { ProductWithCategoryNames } from '@/lib/types';
import { updateProduct } from '@/lib/actions/product.actions';
import React, { useState, useCallback, useEffect } from 'react';
import SelectCategoryComponent from '../categories/SelectCategoryComponent';
import FileInputComponent from '@/components/file-upload/FileInputComponent';

const EditProductPage = ({
  product,
  signedImageUrl,
}: {
  product: ProductWithCategoryNames;
  signedImageUrl: string; // Passed from server as pre-fetched signed URL
}) => {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product.categories.map((c) => c.category.categoryId)
  );

  const [_image, setImage] = useState<File | null>(null);

  const [formState, action, isPending] = useActionState(
    updateProduct.bind(null, product.productId, product),
    {
      success: false,
      errors: {
        title: [],
      },
    }
  );

  useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Product updated successfully'
        />
      ));
      if (formState.data) {
        router.push(`/products/${formState.data}/edit`);
      }
    }
  }, [formState, router]);

  useEffect(() => {
    if ((formState.errors?.title?.length ?? 0) > 0) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred: ${(formState.errors?.title ?? []).join(
            ', '
          )}`}
        />
      ));
    }
  }, [formState.errors]);

  // Initializing form data with existing product details
  const [productData, setProductData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    imagePath: signedImageUrl || '',
    createdAt: product?.createdAt || new Date(),
  });

  // Load the form state from localStorage if available
  useEffect(() => {
    const savedProductData = localStorage.getItem('productData');
    if (savedProductData) {
      setProductData(JSON.parse(savedProductData));
    }
  }, []);

  // Save the form state to localStorage on change
  useEffect(() => {
    localStorage.setItem('productData', JSON.stringify(productData));
  }, [productData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProductData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleCategoryChange = useCallback((categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
  }, []);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.trim();
      value = value.replace(/[^\d.,]/g, '').replace(',', '.');

      if (!isNaN(Number(value))) {
        setProductData((prev) => ({
          ...prev,
          price: parseFloat(Number(value).toFixed(2)),
        }));
      } else if (value === '') {
        setProductData((prev) => ({ ...prev, price: 0 }));
      }
    },
    []
  );

  const handleImageUpload = useCallback((file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        setProductData((prev) => ({ ...prev, imagePath: base64Image }));
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  }, []);

  return (
    <div className='flex h-screen w-full  bg-background'>
      {/* Left side: Product Preview */}
      <div className='w-full p-8 flex items-center justify-center'>
        <div className='w-full max-w-2xl  rounded-lg shadow-lg overflow-hidden'>
          <div className='relative aspect-square w-full  overflow-hidden'>
            {productData.imagePath ? (
              <Image
                src={productData.imagePath}
                alt='Product Image'
                fill
                className='object-cover'
              />
            ) : (
              <div className='flex items-center justify-center w-full h-full text-foreground '>
                <ImageOff className='h-20 w-20' />
              </div>
            )}
            <Badge className='absolute top-4 right-4 z-10' variant='secondary'>
              Preview
            </Badge>
          </div>
          <div className='p-6 space-y-4'>
            <h2 className='text-2xl font-bold text-background'>
              {productData.name || 'Product Name'}
            </h2>
            <p className='text-gray-600'>
              {productData.description || 'Product Description'}
            </p>
            <div className='flex items-center justify-between pt-2'>
              <span className='text-3xl font-bold text-primary'>
                {formatPrice(Number(productData.price))}
              </span>
              {productData.stock > 0 ? (
                <Badge variant='secondary'>{productData.stock} in stock</Badge>
              ) : (
                <Badge variant='outline'>Out of Stock</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Input Form */}
      <Card className='sticky p-4 top-4 h-fit mx-4 my-4 w-1/2 bg-background'>
        <form action={action} className='space-y-6'>
          <h2 className='text-3xl font-bold mb-6 text-primary'>Edit Product</h2>

          <FileInputComponent
            label='Product Image'
            onImageUpload={handleImageUpload}
            initialImage={productData.imagePath}
          />

          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            value={productData.name}
            onChange={handleInputChange}
            required
          />

          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            name='description'
            value={productData.description}
            onChange={handleInputChange}
            required
          />

          <Label htmlFor='price'>Price (€)</Label>
          <Input
            id='price'
            name='price'
            type='text'
            value={productData.price}
            onChange={handlePriceChange}
            required
          />

          <Label htmlFor='stock'>Stock</Label>
          <Input
            id='stock'
            name='stock'
            type='number'
            value={productData.stock}
            onChange={handleInputChange}
            required
          />

          <Label>Categories</Label>
          <SelectCategoryComponent
            defaultValues={selectedCategories}
            onCategorySelect={handleCategoryChange}
          />
          <input
            type='hidden'
            id='categoryIds'
            name='categoryIds'
            value={selectedCategories}
          />

          <Button type='submit' disabled={isPending}>
            {isPending ? <Loader2 className='animate-spin' /> : <Plus />} Edit
            Product
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditProductPage;
