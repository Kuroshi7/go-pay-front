"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { apiService } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react"

export function NewInvoiceForm() {
  const router = useRouter()
  const { apiKey } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    value: "",
    description: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\\D/g, "")
    const formattedValue = (Number.parseInt(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
    return formattedValue
  }

  const formatCardNumber = (value: string) => {
    const numericValue = value.replace(/\\D/g, "")
    return numericValue.replace(/(\\d{4})(?=\\d)/g, "$1 ")
  }

  const formatExpiryDate = (value: string) => {
    const numericValue = value.replace(/\\D/g, "")
    if (numericValue.length >= 2) {
      return numericValue.substring(0, 2) + "/" + numericValue.substring(2, 4)
    }
    return numericValue
  }

  const calculateSubtotal = () => {
    const numericValue = formData.value.replace(/\\D/g, "")
    return Number.parseInt(numericValue) / 100 || 0
  }

  const calculateProcessingFee = () => {
    return calculateSubtotal() * 0.02
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateProcessingFee()
  }

  const handleCancel = () => {
    router.push('/invoices')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!apiKey) {
      setError("Erro de autenticação")
      return
    }

    if (!formData.value || !formData.description || !formData.cardNumber || 
        !formData.expiryDate || !formData.cvv || !formData.cardName) {
      setError("Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const numericValue = formData.value.replace(/\\D/g, "")
      const amount = Number.parseInt(numericValue) / 100

      const [month, year] = formData.expiryDate.split('/')
      const expiryMonth = parseInt(month)
      const expiryYear = parseInt(`20${year}`)

      const invoiceData = {
        amount,
        description: formData.description,
        payment_type: "credit_card",
        card_number: formData.cardNumber.replace(/\\s/g, ''),
        cvv: formData.cvv,
        expiry_month: expiryMonth,
        expiry_year: expiryYear,
        cardholder_name: formData.cardName
      }

      await apiService.createInvoice(invoiceData, apiKey)
      
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/invoices')
      }, 2000)
    } catch (error) {
      console.error('Erro ao criar fatura:', error)
      setError("Erro ao processar pagamento. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">Pagamento processado com sucesso! Redirecionando...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Valor</label>
              <Input
                type="text"
                value={formData.value}
                onChange={(e) => handleInputChange("value", formatCurrency(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white text-lg"
                placeholder="R$ 0,00"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white resize-none"
                placeholder="Descreva o motivo do pagamento"
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Dados do Cartão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Número do Cartão</label>
              <Input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                className="bg-slate-600 border-slate-500 text-white font-mono"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Data de Expiração</label>
                <Input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                  className="bg-slate-600 border-slate-500 text-white font-mono"
                  placeholder="MM/AA"
                  maxLength={5}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">CVV</label>
                <Input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\\D/g, ""))}
                  className="bg-slate-600 border-slate-500 text-white font-mono"
                  placeholder="123"
                  maxLength={3}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Nome no Cartão</label>
              <Input
                type="text"
                value={formData.cardName}
                onChange={(e) => handleInputChange("cardName", e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="Como aparece no cartão"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-700 border-slate-600">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>{calculateSubtotal().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Taxa de Processamento (2%)</span>
              <span>{calculateProcessingFee().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
            <div className="border-t border-slate-600 pt-3">
              <div className="flex justify-between text-white text-lg font-semibold">
                <span>Total</span>
                <span>{calculateTotal().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          className="border-slate-600 text-gray-300 hover:bg-slate-700 bg-transparent"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Processar Pagamento
            </>
          )}
        </Button>
      </div>

      <div className="text-center pt-6 border-t border-slate-700">
        <p className="text-gray-400 text-sm">© 2025 go-pay. Todos os direitos reservados.</p>
      </div>
    </form>
  )
}
