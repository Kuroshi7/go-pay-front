import type React from "react"
import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/page-header"

interface LayoutWrapperProps {
  children: React.ReactNode
  showNavigation?: boolean
}

export function LayoutWrapper({ children, showNavigation = true }: LayoutWrapperProps) {
  if (!showNavigation) {
    return <div className="min-h-screen bg-slate-900">{children}</div>
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Navigation />
      <div className="flex-1 flex flex-col">
        <PageHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
