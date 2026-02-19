import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CreateProduct } from '../types';

type ProductState = {
  product: CreateProduct;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  setPrice: (v: number) => void;
  setStock: (v: number) => void;
  setImagePath: (v: string) => void;
  setCategoryId: (v: string) => void;
  reset: () => void;
};

const initial: CreateProduct = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  imagePath: '',
  categoryId: '',
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      product: initial,
      setName: (v) => set((s) => ({ product: { ...s.product, name: v } })),
      setDescription: (v) => set((s) => ({ product: { ...s.product, description: v } })),
      setPrice: (v) => set((s) => ({ product: { ...s.product, price: v } })),
      setStock: (v) => set((s) => ({ product: { ...s.product, stock: v } })),
      setImagePath: (v) => set((s) => ({ product: { ...s.product, imagePath: v } })),
      setCategoryId: (v) => set((s) => ({ product: { ...s.product, categoryId: v } })),
      reset: () => set({ product: initial }),
    }),
    {
      name: 'product-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ product: state.product }),
      version: 1,
      skipHydration: true,
    }
  )
);
