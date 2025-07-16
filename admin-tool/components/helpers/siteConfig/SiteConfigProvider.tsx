'use client'
import React, { createContext, useContext, useState } from 'react'
import { SiteConfigDto } from '@/lib/types'

interface SiteConfigContextProps {
  siteConfig: SiteConfigDto | null
  update: (data: Partial<SiteConfigDto>) => void
}

const SiteConfigContext = createContext<SiteConfigContextProps | undefined>(undefined)

export function SiteConfigProvider({ initialSiteConfig, children }:{ initialSiteConfig: SiteConfigDto, children: React.ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfigDto>(initialSiteConfig)

  const update = (data: Partial<SiteConfigDto>) => {
    setSiteConfig(prev => ({ ...prev, ...data }))
  }

  return (
    <SiteConfigContext.Provider value={{ siteConfig, update }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useOptimisticSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) {
    throw new Error('useOptimisticSiteConfig must be used within SiteConfigProvider')
  }
  return ctx
}
