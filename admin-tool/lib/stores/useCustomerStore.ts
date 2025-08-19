import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BusinessSector, CreateCustomer } from '../types';

type CustomerState = {
  customer: CreateCustomer;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhoneNumber: (v: string) => void;
  setCompanyNumber: (v: string) => void;
  setAddressId: (v: string) => void;
  setBusinessSector: (v: BusinessSector | null) => void;
  reset: () => void;
};

const initial: CreateCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  companyNumber: null,
  addressId: '',
  businessSector: null,
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customer: initial,
      setFirstName: (v: string) =>
        set((s) => ({ customer: { ...s.customer, firstName: v } })),
      setLastName: (v: string) =>
        set((s) => ({ customer: { ...s.customer, lastName: v } })),
      setEmail: (v) => set((s) => ({ customer: { ...s.customer, email: v } })),
      setPhoneNumber: (v: string) =>
        set((s) => ({ customer: { ...s.customer, phoneNumber: v } })),
      setCompanyNumber: (v: string) =>
        set((s) => ({ customer: { ...s.customer, companyNumber: v } })),
      setAddressId: (v: string) =>
        set((s) => ({ customer: { ...s.customer, addressId: v } })),
      setBusinessSector: (v: BusinessSector | null) =>
        set((s) => ({ customer: { ...s.customer, businessSector: v } })),
      reset: () => set({ customer: initial }),
    }),
    {
      name: 'customer-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ customer: state.customer }),
      version: 1,
    }
  )
);
