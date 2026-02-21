import { useState, useCallback } from 'react'
import { useAuth } from '../App'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-ira245erppsrdirm200d8-23969b88.us1.manus.computer'

/**
 * Custom hook for making API calls with authentication
 * Handles loading, error, and success states
 */
export function useApi() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const sessionToken = localStorage.getItem('techypark_session')
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setLoading(false)
      return data
    } catch (err) {
      const errorMessage = err.message || 'An error occurred'
      setError(errorMessage)
      setLoading(false)
      throw err
    }
  }, [])

  return { request, loading, error }
}

/**
 * Hook for fetching data with caching
 */
export function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { request } = useApi()

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const result = await request(endpoint, options)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [endpoint, request, options])

  // Auto-fetch on mount
  React.useEffect(() => {
    fetch()
  }, [fetch])

  const refetch = useCallback(() => fetch(), [fetch])

  return { data, loading, error, refetch }
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation(endpoint, method = 'POST') {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { request } = useApi()

  const mutate = useCallback(async (payload) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const result = await request(endpoint, {
        method,
        body: JSON.stringify(payload),
      })

      setSuccess(true)
      setLoading(false)
      return result
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }, [endpoint, method, request])

  return { mutate, loading, error, success }
}

/**
 * Funnels API
 */
export function useFunnels() {
  const { data: funnels, loading, error, refetch } = useFetch('/api/funnels')
  const { mutate: createFunnel } = useMutation('/api/funnels', 'POST')
  const { mutate: updateFunnel } = useMutation('/api/funnels/:id', 'PUT')
  const { mutate: deleteFunnel } = useMutation('/api/funnels/:id', 'DELETE')

  return {
    funnels: funnels?.data || [],
    loading,
    error,
    refetch,
    createFunnel,
    updateFunnel,
    deleteFunnel,
  }
}

/**
 * Products API
 */
export function useProducts() {
  const { data: products, loading, error, refetch } = useFetch('/api/products')
  const { mutate: createProduct } = useMutation('/api/products', 'POST')
  const { mutate: updateProduct } = useMutation('/api/products/:id', 'PUT')
  const { mutate: deleteProduct } = useMutation('/api/products/:id', 'DELETE')

  return {
    products: products?.data || [],
    loading,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

/**
 * Email Campaigns API
 */
export function useEmailCampaigns() {
  const { data: campaigns, loading, error, refetch } = useFetch('/api/campaigns')
  const { mutate: createCampaign } = useMutation('/api/campaigns', 'POST')
  const { mutate: updateCampaign } = useMutation('/api/campaigns/:id', 'PUT')
  const { mutate: deleteCampaign } = useMutation('/api/campaigns/:id', 'DELETE')

  return {
    campaigns: campaigns?.data || [],
    loading,
    error,
    refetch,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  }
}

/**
 * Contacts/CRM API
 */
export function useContacts() {
  const { data: contacts, loading, error, refetch } = useFetch('/api/contacts')
  const { mutate: createContact } = useMutation('/api/contacts', 'POST')
  const { mutate: updateContact } = useMutation('/api/contacts/:id', 'PUT')
  const { mutate: deleteContact } = useMutation('/api/contacts/:id', 'DELETE')

  return {
    contacts: contacts?.data || [],
    loading,
    error,
    refetch,
    createContact,
    updateContact,
    deleteContact,
  }
}

/**
 * Workflows API
 */
export function useWorkflows() {
  const { data: workflows, loading, error, refetch } = useFetch('/api/workflows')
  const { mutate: createWorkflow } = useMutation('/api/workflows', 'POST')
  const { mutate: updateWorkflow } = useMutation('/api/workflows/:id', 'PUT')
  const { mutate: deleteWorkflow } = useMutation('/api/workflows/:id', 'DELETE')

  return {
    workflows: workflows?.data || [],
    loading,
    error,
    refetch,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  }
}

/**
 * Analytics API
 */
export function useAnalytics(funnelId) {
  const endpoint = funnelId ? `/api/analytics?funnel_id=${funnelId}` : '/api/analytics'
  const { data: analytics, loading, error, refetch } = useFetch(endpoint)

  return {
    analytics: analytics?.data || {},
    loading,
    error,
    refetch,
  }
}

/**
 * Subscriptions API
 */
export function useSubscriptions() {
  const { data: subscriptions, loading, error, refetch } = useFetch('/api/subscriptions')

  return {
    subscriptions: subscriptions?.data || [],
    loading,
    error,
    refetch,
  }
}

/**
 * Orders API
 */
export function useOrders() {
  const { data: orders, loading, error, refetch } = useFetch('/api/orders')

  return {
    orders: orders?.data || [],
    loading,
    error,
    refetch,
  }
}
