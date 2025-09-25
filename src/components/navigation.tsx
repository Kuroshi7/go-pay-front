"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Plus, Key } from "lucide-react"

const navigationItems = [
  {
    name: "Autenticação",
    href: "/",
    icon: Key,
  },
  {
    name: "Faturas",
    href: "/invoices",
    icon: FileText,
  },
  {
    name: "Nova Fatura",
    href: "/invoices/new",
    icon: Plus,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-slate-800 border-r border-slate-700 w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-white text-lg font-semibold">go-pay</h2>
        <p className="text-gray-400 text-sm">Gateway de Pagamento</p>
      </div>

      <ul className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href === "/invoices" && pathname.startsWith("/invoices") && pathname !== "/invoices/new")

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-slate-700 hover:text-white",
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
