"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

const invoices = [
  {
    id: "#INV-001",
    date: "30/03/2025",
    description: "Compra Online #123",
    value: "R$ 1.500,00",
    status: "approved",
  },
  {
    id: "#INV-002",
    date: "29/03/2025",
    description: "Serviço Premium",
    value: "R$ 15.000,00",
    status: "pending",
  },
  {
    id: "#INV-003",
    date: "28/03/2025",
    description: "Assinatura Mensal",
    value: "R$ 99,90",
    status: "rejected",
  },
]

const statusConfig = {
  approved: { label: "Aprovado", className: "bg-green-600 text-white" },
  pending: { label: "Pendente", className: "bg-yellow-600 text-white" },
  rejected: { label: "Rejeitado", className: "bg-red-600 text-white" },
}

export function InvoicesTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3

  const handleDownload = (invoiceId: string) => {
    // TODO: Implementar download da fatura
    console.log(`Download da fatura ${invoiceId}`)
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-gray-400 font-medium py-3 px-4">ID</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">DATA</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">DESCRIÇÃO</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">VALOR</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">STATUS</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-700/50">
                <td className="text-white py-4 px-4 font-mono">{invoice.id}</td>
                <td className="text-white py-4 px-4">{invoice.date}</td>
                <td className="text-white py-4 px-4">{invoice.description}</td>
                <td className="text-white py-4 px-4 font-semibold">{invoice.value}</td>
                <td className="py-4 px-4">
                  <Badge className={statusConfig[invoice.status as keyof typeof statusConfig].className}>
                    {statusConfig[invoice.status as keyof typeof statusConfig].label}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/invoices/${invoice.id.replace('#INV-', '')}`}>
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-400 hover:text-gray-300"
                      onClick={() => handleDownload(invoice.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-gray-400 text-sm">Mostrando 1 - 3 de 50 resultados</p>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-gray-400"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          {[1, 2, 3].map((page) => (
            <Button 
              key={page}
              size="sm" 
              className={currentPage === page ? "bg-indigo-600 text-white" : "bg-transparent text-gray-400 hover:bg-slate-700"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-gray-400"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
