import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CreateAddress } from '../types';

type AddressState = {
  address: CreateAddress;
  setCountry: (v: string) => void;
  setState: (v: string) => void;
  setCity: (v: string) => void;
  setPostCode: (v: string) => void;
  setStreetName: (v: string) => void;
  setStreetNumber: (v: string) => void;
  reset: () => void;
};

const initial: CreateAddress = {
  country: '',
  state: '',
  city: '',
  postCode: '',
  streetName: '',
  streetNumber: '',
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: initial,
      setCountry: (v) => set((s) => ({ address: { ...s.address, country: v } })),
      setState: (v) => set((s) => ({ address: { ...s.address, state: v } })),
      setCity: (v) => set((s) => ({ address: { ...s.address, city: v } })),
      setPostCode: (v) => set((s) => ({ address: { ...s.address, postCode: v } })),
      setStreetName: (v) => set((s) => ({ address: { ...s.address, streetName: v } })),
      setStreetNumber: (v) => set((s) => ({ address: { ...s.address, streetNumber: v } })),
      reset: () => set({ address: initial }),
    }),
    {
      name: 'address-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ address: state.address }),
      version: 1,
    }
  )
);
