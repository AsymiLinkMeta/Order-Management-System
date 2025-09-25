import { useState, useEffect } from 'react'
import { orderTypesAPI } from '../services/api'
import { OrderType } from '../types'

export function useOrderTypes() {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderTypes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await orderTypesAPI.getAll()
      setOrderTypes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order types')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderTypes()
  }, [])

  const uploadOrderType = async (file: File) => {
    try {
      const result = await orderTypesAPI.create(file)
      await fetchOrderTypes() // Refresh the list
      return result
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to upload order type')
    }
  }

  const activateOrderType = async (id: number) => {
    try {
      await orderTypesAPI.activate(id)
      await fetchOrderTypes() // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to activate order type')
    }
  }

  const dismissOrderType = async (id: number) => {
    try {
      await orderTypesAPI.dismiss(id)
      await fetchOrderTypes() // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to dismiss order type')
    }
  }

  const deleteOrderType = async (id: number) => {
    try {
      await orderTypesAPI.delete(id)
      await fetchOrderTypes() // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete order type')
    }
  }

  return {
    orderTypes,
    isLoading,
    error,
    fetchOrderTypes,
    uploadOrderType,
    activateOrderType,
    dismissOrderType,
    deleteOrderType
  }
}