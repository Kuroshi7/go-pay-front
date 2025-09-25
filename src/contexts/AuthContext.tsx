"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Account } from '@/types/api'
import { apiService } from '@/services/api'

interface AuthContextType {
  account: Account | null
  apiKey: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (apiKey: string) => Promise<boolean>
  logout: () => void
  createAccount: (name: string, email: string) => Promise<Account | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if there's a stored API key
    const storedApiKey = localStorage.getItem('go-pay-api-key')
    if (storedApiKey) {
      login(storedApiKey)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (key: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const accountData = await apiService.getAccount(key)
      setAccount(accountData)
      setApiKey(key)
      localStorage.setItem('go-pay-api-key', key)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      logout()
      return false
    }
  }

  const logout = () => {
    setAccount(null)
    setApiKey(null)
    localStorage.removeItem('go-pay-api-key')
    setIsLoading(false)
  }

  const createAccount = async (name: string, email: string): Promise<Account | null> => {
    try {
      const newAccount = await apiService.createAccount({ name, email })
      setAccount(newAccount)
      setApiKey(newAccount.api_key)
      localStorage.setItem('go-pay-api-key', newAccount.api_key)
      return newAccount
    } catch (error) {
      console.error('Account creation failed:', error)
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        account,
        apiKey,
        isAuthenticated: !!account,
        isLoading,
        login,
        logout,
        createAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}