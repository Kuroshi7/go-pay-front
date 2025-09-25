"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function InvoicesFilters() {
  const [status, setStatus] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [search, setSearch] = useState("")

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="all" className="text-white">
              Todos
            </SelectItem>
            <SelectItem value="approved" className="text-white">
              Aprovado
            </SelectItem>
            <SelectItem value="pending" className="text-white">
              Pendente
            </SelectItem>
            <SelectItem value="rejected" className="text-white">
              Rejeitado
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm font-medium">Data Inicial</label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="dd/mm/aaaa"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm font-medium">Data Final</label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="dd/mm/aaaa"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm font-medium">Buscar</label>
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="ID ou descrição"
        />
      </div>
    </div>
  )
}
