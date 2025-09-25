import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function InvoiceDetails() {
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
            <span className="text-white font-mono">#INV-001</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Valor</span>
            <span className="text-white font-semibold">R$ 1.500,00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Data de Criação</span>
            <span className="text-white">30/03/2025 14:30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Última Atualização</span>
            <span className="text-white">30/03/2025 14:35</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Descrição</span>
            <span className="text-white">Compra Online #123</span>
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
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Fatura Criada</p>
              <p className="text-gray-400 text-sm">30/03/2025 14:30</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Pagamento Processado</p>
              <p className="text-gray-400 text-sm">30/03/2025 14:32</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Transação Aprovada</p>
              <p className="text-gray-400 text-sm">30/03/2025 14:35</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Método de Pagamento */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Método de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Tipo</span>
            <span className="text-white">Cartão de Crédito</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Últimos Dígitos</span>
            <span className="text-white font-mono">**** **** **** 1234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Titular</span>
            <span className="text-white">João da Silva</span>
          </div>
        </CardContent>
      </Card>

      {/* Dados Adicionais */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Dados Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">ID da Conta</span>
            <span className="text-white font-mono">ACC-12345</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">IP do Cliente</span>
            <span className="text-white font-mono">192.168.1.1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dispositivo</span>
            <span className="text-white">Desktop - Chrome</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
