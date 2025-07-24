'use client';
import { toast } from 'sonner';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import CustomeToast from '../toasts/CustomeErrorToast';
import { Product } from '@/lib/types';
import { updateProduct } from '@/lib/actions/product.actions';
import React, { useState, useCallback, useEffect } from 'react';
import SelectCategoryComponent from '../categories/SelectCategoryComponent';
import FileInputComponent from '@/components/file-upload/FileInputComponent';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { GenericLoading } from '@/components/loading-states/loading';

const EditProductPage = ({ product }: { product: Product }) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    product.categoryId || ''
  );

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
    imagePath: product?.imagePath || '',
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

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
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
    }
  }, []);

  return (
    <Card className='mx-auto my-4 w-full max-w-xl p-6 bg-background'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold mb-6 text-primary'>
          Produkt bearbeiten
        </h2>

        <FileInputComponent
          label='Produktbild'
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

        <SelectCategoryComponent
          defaultValue={selectedCategory}
          onCategorySelect={handleCategoryChange}
        />
        <input
          type='hidden'
          id='categoryId'
          name='categoryId'
          value={selectedCategory}
        />

        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? (
            <>
              <LoadingIcon />
              <GenericLoading text='Saving product...' />
            </>
          ) : (
            <>
              <Plus className='mr-2 h-4 w-4' /> Produkt speichern
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default EditProductPage;
