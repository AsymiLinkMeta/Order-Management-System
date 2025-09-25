import { useState, useEffect } from 'react'
import { Order } from '../types'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockOrders: Order[] = [
          {
            id: 1,
            code: 'ORD-1234',
            extCode: 'EXT-001',
            state: 'in_progress',
            archived: false,
            data: { 
              customerName: 'John Doe', 
              customerPhone: '+1234567890',
              customerEmail: 'john@example.com',
              customerCity: 'New York',
              installDate: '2024-02-01T10:00:00Z'
            },
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            estimatedExecDate: '2024-02-01T10:00:00Z',
            orderType: {
              id: 1,
              code: 'new_customer',
              name: 'New Customer',
              active: true,
              fields: {
                customerName: { type: 'string', label: 'Customer Name', required: true },
                customerPhone: { type: 'string', label: 'Customer Phone', required: true },
                customerEmail: { type: 'string', label: 'Customer Email', required: false },
                customerCity: { type: 'string', label: 'Customer City', required: true },
                installDate: { type: 'datetime', label: 'Install Date', required: true }
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            user: {
              id: 1,
              email: 'john@example.com',
              name: 'John',
              lastName: 'Doe',
              company: 'Example Corp',
              department: 'Sales',
              role: 'user',
              blocked: false,
              external: false,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          },
          {
            id: 2,
            code: 'ORD-1235',
            state: 'to_execute',
            archived: false,
            data: { 
              problemDescription: 'System login issues', 
              contractNumber: 12345,
              callBack: true
            },
            createdAt: '2024-01-14T14:20:00Z',
            updatedAt: '2024-01-14T14:20:00Z',
            orderType: {
              id: 2,
              code: 'support_request',
              name: 'Support Request',
              active: true,
              fields: {
                problemDescription: { type: 'string', label: 'Problem Description', required: true },
                contractNumber: { type: 'number', label: 'Contract Number', required: false },
                callBack: { type: 'boolean', label: 'Callback Required', required: false }
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          },
          {
            id: 3,
            code: 'ORD-1236',
            state: 'done',
            archived: false,
            data: { 
              employee: 'Jane Smith', 
              startDate: '2024-02-15T00:00:00Z',
              endDate: '2024-02-20T00:00:00Z',
              reason: 'Annual vacation'
            },
            createdAt: '2024-01-13T09:15:00Z',
            updatedAt: '2024-01-13T09:15:00Z',
            doneAt: '2024-01-13T16:30:00Z',
            orderType: {
              id: 3,
              code: 'vacation_request',
              name: 'Vacation Request',
              active: true,
              fields: {
                employee: { type: 'string', label: 'Employee', required: true },
                startDate: { type: 'datetime', label: 'Start Date', required: true },
                endDate: { type: 'datetime', label: 'End Date', required: true },
                reason: { type: 'string', label: 'Reason', required: false }
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          }
        ]
        
        setOrders(mockOrders)
        setError(null)
      } catch (err) {
        setError('Failed to fetch orders')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const createOrder = async (orderData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newOrder: Order = {
        id: orders.length + 1,
        code: `ORD-${1000 + orders.length + 1}`,
        state: 'to_execute',
        archived: false,
        data: orderData.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        orderType: {
          id: orderData.orderTypeId,
          code: 'new_order',
          name: 'New Order',
          active: true,
          fields: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
      
      setOrders(prev => [newOrder, ...prev])
      return newOrder
    } catch (err) {
      throw new Error('Failed to create order')
    }
  }

  const updateOrder = async (id: number, orderData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setOrders(prev => prev.map(order => 
        order.id === id 
          ? { ...order, ...orderData, updatedAt: new Date().toISOString() }
          : order
      ))
    } catch (err) {
      throw new Error('Failed to update order')
    }
  }

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder
  }
}