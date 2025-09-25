"use client"

import { InvoiceDetails } from "@/components/invoice-details"
import { PageHeader } from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const handleDownload = () => {
    // TODO: Implementar download do PDF da fatura
    console.log(`Download da fatura ${params.id}`)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <PageHeader />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Link href="/invoices" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Link>
                  <div className="flex items-center gap-3">
                    <h1 className="text-white text-2xl font-semibold">Detalhes da Fatura</h1>
                  </div>
                </div>
                <button 
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              <InvoiceDetails invoiceId={params.id} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
