'use client';

import { useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createProduct } from '@/lib/actions/product.actions';
import SelectCategoryComponent from '../categories/SelectCategoryComponent';
import FileInputComponent from '@/components/file-upload/FileInputComponent';
import { useProductStore } from '@/lib/stores/useProductStore';
import { GenericDialogForm } from '@/components/forms/generic';
import { useTranslations } from 'next-intl';

const AddProductDialog = () => {
  const t = useTranslations('Dashboard.Ressource.Products');
  const name = useProductStore((s) => s.product.name);
  const description = useProductStore((s) => s.product.description);
  const price = useProductStore((s) => s.product.price);
  const stock = useProductStore((s) => s.product.stock);
  const categoryId = useProductStore((s) => s.product.categoryId);

  const setName = useProductStore((s) => s.setName);
  const setDescription = useProductStore((s) => s.setDescription);
  const setPrice = useProductStore((s) => s.setPrice);
  const setStock = useProductStore((s) => s.setStock);
  const setImagePath = useProductStore((s) => s.setImagePath);
  const setCategoryId = useProductStore((s) => s.setCategoryId);

  // Hydrate the store on mount to prevent SSR hydration issues
  useEffect(() => {
    useProductStore.persist.rehydrate();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === 'name') setName(value);
      if (name === 'description') setDescription(value);
      if (name === 'stock') setStock(Number(value));
    },
    [setName, setDescription, setStock]
  );

  const handleCategoryChange = useCallback(
    (id: string) => {
      setCategoryId(id);
    },
    [setCategoryId]
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      value = value.replace(/[^\d.,]/g, '');
      value = value.replace(',', '.');
      if (!isNaN(Number(value))) {
        setPrice(Number(value));
      }
      if (!value || Number(value) < 0) {
        setPrice(0);
      }
      if (value.split('.')[1]?.length > 2) {
        setPrice(parseFloat(Number(value).toFixed(2)));
      }
      if (value.split('.').length > 2) {
        setPrice(parseFloat(value.slice(0, -1)));
      }
    },
    [setPrice]
  );

  const handleImageUpload = useCallback(
    (file: File | null) => {
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImagePath(imageUrl);
      }
    },
    [setImagePath]
  );

  return (
    <GenericDialogForm
      triggerButtonText={t('add')}
      triggerButtonIcon={<Plus className='h-4 w-4' />}
      dialogTitle={t('add')}
      dialogDescription={t('dialogDescription')}
      serverAction={createProduct}
      submitButtonText={t('buttons.add')}
      submitButtonPendingText={t('buttons.addLoading')}
      formClassName='space-y-4 max-h-[60vh] overflow-y-auto'
    >
      {(formState, isPending) => (
        <>
          <div className='w-full flex items-center justify-center'>
            <FileInputComponent
              label={t('Attributes.image')}
              onImageUpload={handleImageUpload}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='name'>{t('Attributes.name')}</Label>
            <Input
              id='name'
              name='name'
              value={name}
              onChange={handleInputChange}
              required
              disabled={isPending}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>{t('Attributes.description')}</Label>
            <Textarea
              id='description'
              name='description'
              value={description}
              onChange={handleInputChange}
              required
              disabled={isPending}
            />
          </div>
          <div className='flex gap-4'>
            <div className='space-y-2 flex-1'>
              <Label htmlFor='price'>{t('Attributes.price')}</Label>
              <div className='relative flex rounded-lg shadow-xs shadow-black/5'>
                <span className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground'>
                  €
                </span>
                <Input
                  id='price'
                  name='price'
                  className='-me-px rounded-e-none ps-6 shadow-none'
                  placeholder='0.00'
                  type='text'
                  value={price}
                  onChange={handlePriceChange}
                  disabled={isPending}
                />
                <span className='-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground'>
                  EUR
                </span>
              </div>
            </div>
            <div className='space-y-2 flex-1'>
              <Label htmlFor='stock'>{t('Attributes.stock')}</Label>
              <Input
                id='stock'
                name='stock'
                type='number'
                value={stock}
                onChange={handleInputChange}
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <SelectCategoryComponent
              onCategorySelect={handleCategoryChange}
              defaultValue={categoryId}
            />
            <input
              id='categoryId'
              name='categoryId'
              type='hidden'
              value={categoryId}
            />
          </div>
        </>
      )}
    </GenericDialogForm>
  );
};

export default AddProductDialog;
