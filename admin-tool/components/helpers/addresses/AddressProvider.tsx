'use client'
import React, { createContext, useContext, useState } from 'react'
import { Address } from '@/lib/types'

interface AddressContextProps {
  addresses: Address[]
  addOptimistic: (addr: Address) => void
  finalize: (tempId: string, realId: string) => void
  remove: (tempId: string) => void
  update: (addressId: string, data: Partial<Address>) => void
}

const AddressContext = createContext<AddressContextProps | undefined>(undefined)

export function AddressProvider({ initialAddresses, children }:{initialAddresses: Address[], children: React.ReactNode}) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)

  const addOptimistic = (addr: Address) => {
    setAddresses((prev) => [addr, ...prev])
  }

  const finalize = (tempId: string, realId: string) => {
    setAddresses((prev) =>
      prev.map((a) => (a.addressId === tempId ? { ...a, addressId: realId } : a))
    )
  }

  const remove = (tempId: string) => {
    setAddresses((prev) => prev.filter((a) => a.addressId !== tempId))
  }

  const update = (addressId: string, data: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => (a.addressId === addressId ? { ...a, ...data } : a))
    )
  }

  return (
    <AddressContext.Provider value={{ addresses, addOptimistic, finalize, remove, update }}>
      {children}
    </AddressContext.Provider>
  )
}

export function useOptimisticAddresses() {
  const ctx = useContext(AddressContext)
  if (!ctx) {
    throw new Error('useOptimisticAddresses must be used within AddressProvider')
  }
  return ctx
}
