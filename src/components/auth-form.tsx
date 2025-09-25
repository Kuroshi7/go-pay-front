"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Plus, Loader2 } from "lucide-react"

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [apiKey, setApiKey] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { login, createAccount } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) return

    setIsLoading(true)
    setError("")
    
    try {
      const success = await login(apiKey)
      if (success) {
        router.push('/invoices')
      } else {
        setError("API Key inválida ou erro de conexão")
      }
    } catch (error) {
      setError("Erro ao fazer login. Verifique sua API Key.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsLoading(true)
    setError("")
    
    try {
      const account = await createAccount(name, email)
      if (account) {
        router.push('/invoices')
      } else {
        setError("Erro ao criar conta. Verifique os dados e tente novamente.")
      }
    } catch (error) {
      setError("Erro ao criar conta. Verifique os dados e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-slate-800 border-slate-700">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">
          {mode === 'login' ? 'Login Gateway' : 'Criar Conta'}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {mode === 'login' 
            ? 'Insira sua API Key para acessar o sistema'
            : 'Crie uma nova conta de comerciante'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
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
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4"
                  disabled={isLoading || !apiKey.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-white text-sm font-medium">
                Nome do Comerciante
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Digite o nome da empresa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-white text-sm font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading || !name.trim() || !email.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Criando conta...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Conta
                </>
              )}
            </Button>
          </form>
        )}

        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            {mode === 'login' ? 'Não tem conta? Criar uma' : 'Já tem conta? Fazer login'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
