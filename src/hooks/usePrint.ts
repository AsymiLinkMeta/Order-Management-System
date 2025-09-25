import { useState } from 'react'
import { printAPI } from '../services/api'

export function usePrint() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const printOrder = async (orderCode: string, convertToPdf: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await printAPI.printOrder(orderCode, convertToPdf)

      // Handle file download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `order-${orderCode}.${convertToPdf ? 'pdf' : 'html'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Print failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const printMultipleOrders = async (orderCodes: string[], convertToPdf: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await printAPI.printMultipleOrders(orderCodes, convertToPdf)
      
      if (result.error) {
        throw new Error(result.error)
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Print failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    printOrder,
    printMultipleOrders
  }
}