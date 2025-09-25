import { Account, Invoice, CreateAccountRequest, CreateInvoiceRequest, ApiError } from '@/types/api'

const API_BASE_URL = 'http://localhost:8080'

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`API Error: ${response.status} - ${errorData}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Account endpoints
  async createAccount(data: CreateAccountRequest): Promise<Account> {
    return this.request<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getAccount(apiKey: string): Promise<Account> {
    return this.request<Account>('/accounts', {
      headers: {
        'X-API-Key': apiKey,
      },
    })
  }

  // Invoice endpoints
  async createInvoice(data: CreateInvoiceRequest, apiKey: string): Promise<Invoice> {
    return this.request<Invoice>('/invoices', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(data),
    })
  }

  async getInvoices(apiKey: string): Promise<Invoice[]> {
    return this.request<Invoice[]>('/invoices', {
      headers: {
        'X-API-Key': apiKey,
      },
    })
  }

  async getInvoice(id: string, apiKey: string): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    })
  }
}

export const apiService = new ApiService()