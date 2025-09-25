import { useState, useEffect } from 'react'
import { Task } from '../types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const mockTasks: Task[] = [
          {
            id: '111111',
            name: 'Process New Customer Application',
            assignee: 'demo',
            created: '2024-01-15T10:30:00Z',
            due: '2024-01-20T17:00:00Z',
            priority: 50,
            processName: 'New Customer Process',
            processKey: 'new_customer',
            entityCode: 'ORD-1234',
            entityUrl: '/orders/ORD-1234?task_id=111111',
            description: 'Review and approve new customer application'
          },
          {
            id: '111112',
            name: 'Handle Support Request',
            assignee: 'demo',
            created: '2024-01-14T14:20:00Z',
            due: '2024-01-16T12:00:00Z',
            priority: 75,
            processName: 'Support Process',
            processKey: 'support_request',
            entityCode: 'ORD-1235',
            entityUrl: '/orders/ORD-1235?task_id=111112',
            description: 'Investigate and resolve customer issue'
          }
        ]
        
        setTasks(mockTasks)
        setError(null)
      } catch (err) {
        setError('Failed to fetch tasks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const claimTask = async (taskId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, assignee: 'current_user' }
          : task
      ))
    } catch (err) {
      throw new Error('Failed to claim task')
    }
  }

  const completeTask = async (taskId: string, formData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (err) {
      throw new Error('Failed to complete task')
    }
  }

  return {
    tasks,
    isLoading,
    error,
    claimTask,
    completeTask
  }
}