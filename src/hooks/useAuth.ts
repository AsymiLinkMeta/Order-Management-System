import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { authAPI } from '../services/api'
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
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Get the user profile from the profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
          
          if (error) {
            console.error('Error fetching profile:', error)
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false
            })
            return
          }
          
          const user: User = {
            id: parseInt(session.user.id),
            email: session.user.email!,
            name: profile.name,
            lastName: profile.last_name,
            middleName: profile.middle_name,
            company: profile.company,
            department: profile.department,
            role: profile.role,
            blocked: profile.blocked,
            external: profile.external,
            apiToken: profile.api_token,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at
          }
          
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
      
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      if (!data.user) throw new Error('Login failed')
      
      // Get the user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single()
      
      if (profileError) throw profileError
      
      const user: User = {
        id: parseInt(data.user.id),
        email: data.user.email!,
        name: profile.name,
        lastName: profile.last_name,
        middleName: profile.middle_name,
        company: profile.company,
        department: profile.department,
        role: profile.role,
        blocked: profile.blocked,
        external: profile.external,
        apiToken: profile.api_token,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      })

      return user
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

  const logout = async () => {
    await supabase.auth.signOut()
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