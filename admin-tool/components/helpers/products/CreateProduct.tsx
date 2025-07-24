'use client';

import React from 'react';
import { useState, useCallback, useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createProduct } from '@/lib/actions/product.actions';
import { Card } from '@/components/ui/card';
import SelectCategoryComponent from '../categories/SelectCategoryComponent';
import FileInputComponent from '@/components/file-upload/FileInputComponent';
import { toast } from 'sonner';
import CustomeToast from '../toasts/CustomeErrorToast';
import LoadingIcon from '@/components/loading-states/loading-icon';
import { GenericLoading } from '@/components/loading-states/loading';

const CreateProduct = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  const [formState, action, isPending] = useActionState(
    createProduct.bind(null),
    {
      success: false,
      errors: {
        title: [],
      },
    }
  );
  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast
          variant='success'
          message='Product created successfully'
        />
      ));
    }
  }, [formState.success]);

  React.useEffect(() => {
    if (
      formState.errors &&
      Object.keys(formState.errors).length > 0 &&
      formState.errors.title.length > 0
    ) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred ${formState.errors?.title}`}
        />
      ));
    }
  }, [formState.errors]);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    productImage: '',
    categories: [] as string[],
    createdAt: new Date().toISOString(),
  });

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
      let value = e.target.value;

      // trim value from everything except numbers
      value = value.replace(/[^\d.,]/g, '');
      value = value.replace(',', '.');

      // check if value is a valid number
      if (!isNaN(Number(value))) {
        setProductData((prev) => ({ ...prev, price: Number(value) }));
      }

      // if value is empty, set it to 0
      if (!value) {
        setProductData((prev) => ({ ...prev, price: 0 }));
      }

      // if value is negative, set it to 0
      if (Number(value) < 0) {
        setProductData((prev) => ({ ...prev, price: 0 }));
      }

      // if value has more than 2 decimal places, round it to 2
      if (value.split('.')[1]?.length > 2) {
        setProductData((prev) => ({
          ...prev,
          price: parseFloat(Number(value).toFixed(2)),
        }));
      }

      // if value has more than 1 decimal separator, remove the last one
      if (value.split('.').length > 2) {
        setProductData((prev) => ({
          ...prev,
          price: parseFloat(value.slice(0, -1)),
        }));
      }
    },
    []
  );
  const handleImageUpload = useCallback((file: File | null) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProductData((prev) => ({ ...prev, imagePath: imageUrl }));
    }
  }, []);

  return (
    <Card className='mx-auto my-4 w-full max-w-xl p-6'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold mb-6 text-primary'>
          Neues Produkt erstellen
        </h2>
        <div className='w-full flex items-center justify-center'>
          <FileInputComponent
            label='Produktbild'
            onImageUpload={handleImageUpload}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            value={productData.name}
            onChange={handleInputChange}
            required
            className='transition-all duration-200 focus:ring-2 focus:ring-primary'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Beschreibung</Label>
          <Textarea
            id='description'
            name='description'
            value={productData.description}
            onChange={handleInputChange}
            required
            className='transition-all duration-200 focus:ring-2 focus:ring-primary'
          />
        </div>
        <div className='flex gap-4'>
          <div className='space-y-2'>
            <Label htmlFor={'price'}>Preis</Label>
            <div className='relative flex rounded-lg shadow-xs shadow-black/5'>
              <span className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground'>
                €
              </span>
              <Input
                id='price'
                name='price'
                className='-me-px rounded-e-none ps-6 shadow-none'
                placeholder='0,00'
                type='text'
                value={productData.price}
                onChange={handlePriceChange}
              />
              <span className='-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground'>
                EUR
              </span>
            </div>
          </div>
          <div className='space-y-2 w-1/2'>
            <Label htmlFor='stock'>Lagerbestand</Label>
            <Input
              id='stock'
              name='stock'
              type='number'
              value={productData.stock}
              onChange={handleInputChange}
              required
              className='transition-all duration-200 focus:ring-2 focus:ring-primary'
            />
          </div>
        </div>
        <div className='space-y-2'>
          <SelectCategoryComponent
            onCategorySelect={handleCategoryChange}
            defaultValue={selectedCategory}
          />
          <input
            id='categoryId'
            name='categoryId'
            type='hidden'
            value={selectedCategory}
          />
        </div>
        <Button
          type='submit'
          className='w-full transition-all duration-200 hover:bg-primary/90'
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoadingIcon />
              <GenericLoading text='Creating product...' />
            </>
          ) : (
            <>
              <Plus className='mr-2 h-4 w-4' />
              Produkt erstellen
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default CreateProduct;
