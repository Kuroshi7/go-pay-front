import { NewInvoiceForm } from "@/components/new-invoice-form"
import { PageHeader } from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function NewInvoicePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <PageHeader />

        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="mb-6">
                <h1 className="text-white text-2xl font-semibold mb-2">Criar Nova Fatura</h1>
                <p className="text-gray-400">Preencha os dados abaixo para processar um novo pagamento</p>
              </div>

              <NewInvoiceForm />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
