"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Info } from "lucide-react"

export function AuthForm() {
  const [apiKey, setApiKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle API key submission
    console.log("API Key submitted:", apiKey)
  }

  return (
    <Card className="w-full max-w-md bg-slate-800 border-slate-700">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">Autenticação Gateway</CardTitle>
        <CardDescription className="text-gray-400">Insira sua API Key para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-white text-sm font-medium">
              API Key
            </label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Digite sua API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>

        <div className="bg-slate-700 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-white font-medium">Como obter uma API Key?</h4>
              <p className="text-gray-400 text-sm">
                Para obter sua API Key, você precisa criar uma conta de comerciante. Entre em contato com nosso suporte
                para mais informações.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
