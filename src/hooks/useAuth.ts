import { useState, useEffect } from 'react'
import { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        // In a real app, this would check for a valid token/session
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const user = JSON.parse(savedUser)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // Simulate login validation (accept any email/password for demo)
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create mock user based on email
      const firstName = email.split('@')[0].split('.')[0] || 'John'
      const lastName = email.split('@')[0].split('.')[1] || 'Doe'
      
      const mockUser: User = {
        id: 1,
        email,
        name: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        company: 'Example Corp',
        department: 'IT',
        role: 'admin',
        blocked: false,
        external: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem('user', JSON.stringify(mockUser))
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      })

      return mockUser
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false
      }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  }

  return {
    ...authState,
    login,
    logout
  }
}