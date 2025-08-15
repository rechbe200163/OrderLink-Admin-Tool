import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CreateOrder, Product } from '../types';

type OrderState = {
  order: CreateOrder;
  setCustomerReference: (v: string) => void;
  setSelfCollect: (v: boolean) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  reset: () => void;
};

const initial: CreateOrder = {
  customerReference: '',
  selfCollect: false,
  selectedProducts: [],
  quantities: {},
  selectedProductObjects: [],
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      order: initial,
      setCustomerReference: (v) =>
        set((s) => ({ order: { ...s.order, customerReference: v } })),
      setSelfCollect: (v) =>
        set((s) => ({ order: { ...s.order, selfCollect: v } })),
      addProduct: (product: Product) =>
        set((s) => ({
          order: {
            ...s.order,
            selectedProducts: [...s.order.selectedProducts, product.productId],
            selectedProductObjects: [...s.order.selectedProductObjects, product],
            quantities: { ...s.order.quantities, [product.productId]: 1 },
          },
        })),
      removeProduct: (productId: string) =>
        set((s) => {
          const { selectedProducts, selectedProductObjects, quantities } = s.order;
          return {
            order: {
              ...s.order,
              selectedProducts: selectedProducts.filter((id) => id !== productId),
              selectedProductObjects: selectedProductObjects.filter(
                (p) => p.productId !== productId
              ),
              quantities: Object.fromEntries(
                Object.entries(quantities).filter(([id]) => id !== productId)
              ),
            },
          };
        }),
      setQuantity: (productId: string, quantity: number) =>
        set((s) => ({
          order: {
            ...s.order,
            quantities: { ...s.order.quantities, [productId]: quantity },
          },
        })),
      reset: () => set({ order: initial }),
    }),
    {
      name: 'order-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ order: state.order }),
      version: 1,
    }
  )
);
