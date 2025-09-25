import { useState, useEffect } from 'react'
import { usersAPI } from '../services/api'
import { User } from '../types'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await usersAPI.getAll()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const createUser = async (userData: Partial<User>) => {
    try {
      const newUser = await usersAPI.create(userData)
      setUsers(prev => [...prev, newUser])
      return newUser
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create user')
    }
  }

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const updatedUser = await usersAPI.update(id, userData)
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user))
      return updatedUser
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update user')
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await usersAPI.delete(id)
      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const generateApiToken = async (id: number) => {
    try {
      const updatedUser = await usersAPI.generateApiToken(id)
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user))
      return updatedUser
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to generate API token')
    }
  }

  const clearApiToken = async (id: number) => {
    try {
      const updatedUser = await usersAPI.clearApiToken(id)
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user))
      return updatedUser
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to clear API token')
    }
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    generateApiToken,
    clearApiToken
  }
}