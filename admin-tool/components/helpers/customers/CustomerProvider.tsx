'use client'
import React, { createContext, useContext, useState } from 'react'
import { Customer } from '@/lib/types'

interface CustomerContextProps {
  customers: Customer[]
  addOptimistic: (cust: Customer) => void
  finalize: (tempRef: number, realRef: number) => void
  remove: (tempRef: number) => void
  update: (customerReference: number, data: Partial<Customer>) => void
}

const CustomerContext = createContext<CustomerContextProps | undefined>(undefined)

export function CustomerProvider({ initialCustomers, children }:{initialCustomers: Customer[], children: React.ReactNode}) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)

  const addOptimistic = (cust: Customer) => {
    setCustomers(prev => [cust, ...prev])
  }

  const finalize = (tempRef: number, realRef: number) => {
    setCustomers(prev => prev.map(c => c.customerReference === tempRef ? { ...c, customerReference: realRef } : c))
  }

  const remove = (tempRef: number) => {
    setCustomers(prev => prev.filter(c => c.customerReference !== tempRef))
  }

  const update = (customerReference: number, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.customerReference === customerReference ? { ...c, ...data } : c))
  }

  return (
    <CustomerContext.Provider value={{ customers, addOptimistic, finalize, remove, update }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useOptimisticCustomers() {
  const ctx = useContext(CustomerContext)
  if (!ctx) {
    throw new Error('useOptimisticCustomers must be used within CustomerProvider')
  }
  return ctx
}
