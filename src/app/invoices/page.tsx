import Link from "next/link"
import { InvoicesTable } from "@/components/invoices-table"
import { InvoicesFilters } from "@/components/invoices-filters"
import { PageHeader } from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <PageHeader />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-white text-2xl font-semibold mb-2">Faturas</h1>
                  <p className="text-gray-400">Gerencie suas faturas e acompanhe os pagamentos</p>
                </div>
                <Link 
                  href="/invoices/new"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Fatura
                </Link>
              </div>

              <InvoicesFilters />
              <InvoicesTable />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
