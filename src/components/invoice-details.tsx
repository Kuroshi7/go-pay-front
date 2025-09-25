"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { apiService } from "@/services/api"
import { Invoice } from "@/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Clock, XCircle, Loader2 } from "lucide-react"

interface InvoiceDetailsProps {
  invoiceId: string
}

const statusConfig = {
  approved: { 
    label: "Aprovado", 
    icon: Check, 
    className: "bg-green-600",
    description: "Pagamento processado com sucesso"
  },
  pending: { 
    label: "Pendente", 
    icon: Clock, 
    className: "bg-yellow-600",
    description: "Aguardando processamento"
  },
  rejected: { 
    label: "Rejeitado", 
    icon: XCircle, 
    className: "bg-red-600",
    description: "Pagamento rejeitado"
  },
}

export function InvoiceDetails({ invoiceId }: InvoiceDetailsProps) {
  const { apiKey } = useAuth()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadInvoice = async () => {
      if (!apiKey || !invoiceId) return
      
      setIsLoading(true)
      setError("")
      
      try {
        const data = await apiService.getInvoice(invoiceId, apiKey)
        setInvoice(data)
      } catch (error) {
        console.error("Erro ao carregar fatura:", error)
        setError("Erro ao carregar detalhes da fatura")
      } finally {
        setIsLoading(false)
      }
    }

    loadInvoice()
  }, [apiKey, invoiceId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Carregando detalhes da fatura...</span>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-400">{error || "Fatura não encontrada"}</p>
      </div>
    )
  }

  const status = statusConfig[invoice.status]
  const StatusIcon = status.icon

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informações da Fatura */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Informações da Fatura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">ID da Fatura</span>
            <span className="text-white font-mono">{invoice.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Valor</span>
            <span className="text-white font-semibold">{formatCurrency(invoice.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Data de Criação</span>
            <span className="text-white">{formatDate(invoice.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Última Atualização</span>
            <span className="text-white">{formatDate(invoice.updated_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Descrição</span>
            <span className="text-white">{invoice.description}</span>
          </div>
        </CardContent>
      </Card>

      {/* Status da Transação */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Status da Transação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 ${status.className} rounded-full flex items-center justify-center`}>
              <StatusIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">{status.label}</p>
              <p className="text-gray-400 text-sm">{status.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Pagamento */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Informações do Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Método de Pagamento</span>
            <span className="text-white">{invoice.payment_type.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cartão</span>
            <span className="text-white font-mono">**** **** **** {invoice.card_last_digits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">ID da Conta</span>
            <span className="text-white font-mono text-sm">{invoice.account_id}</span>
          </div>
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Histórico da Fatura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white text-sm">Fatura criada</p>
                <p className="text-gray-400 text-xs">{formatDate(invoice.created_at)}</p>
              </div>
            </div>
            
            {invoice.updated_at !== invoice.created_at && (
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  invoice.status === 'approved' ? 'bg-green-500' :
                  invoice.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-white text-sm">
                    Status atualizado para {status.label.toLowerCase()}
                  </p>
                  <p className="text-gray-400 text-xs">{formatDate(invoice.updated_at)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
