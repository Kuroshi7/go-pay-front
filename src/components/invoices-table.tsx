"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { apiService } from "@/services/api"
import { Invoice } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Loader2 } from "lucide-react"

const statusConfig = {
  approved: { label: "Aprovado", className: "bg-green-600 text-white" },
  pending: { label: "Pendente", className: "bg-yellow-600 text-white" },
  rejected: { label: "Rejeitado", className: "bg-red-600 text-white" },
}

export function InvoicesTable() {
  const { apiKey } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const itemsPerPage = 10
  const totalPages = Math.ceil(invoices.length / itemsPerPage)

  useEffect(() => {
    const loadInvoices = async () => {
      if (!apiKey) return
      
      setIsLoading(true)
      setError("")
      
      try {
        const data = await apiService.getInvoices(apiKey)
        setInvoices(data)
      } catch (error) {
        console.error("Erro ao carregar faturas:", error)
        setError("Erro ao carregar faturas")
      } finally {
        setIsLoading(false)
      }
    }

    loadInvoices()
  }, [apiKey])

  const handleDownload = (invoiceId: string) => {
    // TODO: Implementar download da fatura
    console.log(`Download da fatura ${invoiceId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = invoices.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Carregando faturas...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Nenhuma fatura encontrada</p>
        <Link 
          href="/invoices/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-block"
        >
          Criar primeira fatura
        </Link>
      </div>
    )
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
            {currentInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-700/50">
                <td className="text-white py-4 px-4 font-mono">{invoice.id}</td>
                <td className="text-white py-4 px-4">{formatDate(invoice.created_at)}</td>
                <td className="text-white py-4 px-4">{invoice.description}</td>
                <td className="text-white py-4 px-4 font-semibold">{formatCurrency(invoice.amount)}</td>
                <td className="py-4 px-4">
                  <Badge className={statusConfig[invoice.status].className}>
                    {statusConfig[invoice.status].label}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/invoices/${invoice.id}`}>
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
        <p className="text-gray-400 text-sm">
          Mostrando {startIndex + 1} - {Math.min(endIndex, invoices.length)} de {invoices.length} resultados
        </p>
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
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1
            return (
              <Button 
                key={pageNumber}
                size="sm" 
                className={currentPage === pageNumber ? "bg-indigo-600 text-white" : "bg-transparent text-gray-400 hover:bg-slate-700"}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          })}
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
