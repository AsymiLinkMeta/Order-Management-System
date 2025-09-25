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
    // Simulate login
    const mockUser: User = {
      id: 1,
      email,
      name: 'John',
      lastName: 'Doe',
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