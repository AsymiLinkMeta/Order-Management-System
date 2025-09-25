import { supabase } from '../lib/supabase'
import { User, Order, OrderType, Task, Profile } from '../types'

export const authAPI = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}

export const usersAPI = {
  getAll: async (params?: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user:auth.users(email)
      `)
    if (error) throw error
    
    return data?.map(profile => ({
      id: profile.user_id,
      email: profile.user?.email,
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
    })) || []
  },
  
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user:auth.users(email)
      `)
      .eq('user_id', id)
      .single()
    if (error) throw error
    
    return {
      id: data.user_id,
      email: data.user?.email,
      name: data.name,
      lastName: data.last_name,
      middleName: data.middle_name,
      company: data.company,
      department: data.department,
      role: data.role,
      blocked: data.blocked,
      external: data.external,
      apiToken: data.api_token,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },
  
  create: async (userData: any) => {
    // First create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    })
    
    if (authError) throw authError
    if (!authData.user) throw new Error('Failed to create user')
    
    // Then create the profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        name: userData.name,
        last_name: userData.lastName,
        middle_name: userData.middleName,
        company: userData.company,
        department: userData.department,
        role: userData.role || 'user',
        blocked: userData.blocked || false,
        external: userData.external || false
      })
      .select()
      .single()
    
    if (profileError) throw profileError
    
    return {
      id: authData.user.id,
      email: authData.user.email,
      name: profileData.name,
      lastName: profileData.last_name,
      middleName: profileData.middle_name,
      company: profileData.company,
      department: profileData.department,
      role: profileData.role,
      blocked: profileData.blocked,
      external: profileData.external,
      apiToken: profileData.api_token,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at
    }
  },
  
  update: async (id: number, userData: any) => {
    const updateData: any = {
      name: userData.name,
      last_name: userData.lastName,
      middle_name: userData.middleName,
      company: userData.company,
      department: userData.department,
      role: userData.role,
      blocked: userData.blocked,
      external: userData.external
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', id)
      .select(`
        *,
        user:auth.users(email)
      `)
      .single()
    
    if (error) throw error
    
    return {
      id: data.user_id,
      email: data.user?.email,
      name: data.name,
      lastName: data.last_name,
      middleName: data.middle_name,
      company: data.company,
      department: data.department,
      role: data.role,
      blocked: data.blocked,
      external: data.external,
      apiToken: data.api_token,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },
  
  delete: async (id: number) => {
    // Delete the profile first
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', id)
    
    if (profileError) throw profileError
    
    // Then delete the auth user (this requires admin privileges)
    const { error: authError } = await supabase.auth.admin.deleteUser(id.toString())
    if (authError) throw authError
  },
  
  generateApiToken: async (id: number) => {
    const apiToken = crypto.randomUUID()
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ api_token: apiToken })
      .eq('user_id', id)
      .select(`
        *,
        user:auth.users(email)
      `)
      .single()
    
    if (error) throw error
    
    return {
      id: data.user_id,
      email: data.user?.email,
      name: data.name,
      lastName: data.last_name,
      middleName: data.middle_name,
      company: data.company,
      department: data.department,
      role: data.role,
      blocked: data.blocked,
      external: data.external,
      apiToken: data.api_token,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },
  
  clearApiToken: async (id: number) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ api_token: null })
      .eq('user_id', id)
      .select(`
        *,
        user:auth.users(email)
      `)
      .single()
    
    if (error) throw error
    
    return {
      id: data.user_id,
      email: data.user?.email,
      name: data.name,
      lastName: data.last_name,
      middleName: data.middle_name,
      company: data.company,
      department: data.department,
      role: data.role,
      blocked: data.blocked,
      external: data.external,
      apiToken: data.api_token,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },
  
  lookup: async (query: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user:auth.users(email)
      `)
      .or(`name.ilike.%${query}%,last_name.ilike.%${query}%,middle_name.ilike.%${query}%`)
      .limit(10)
    
    if (error) throw error
    
    return data?.map(profile => ({
      id: profile.user_id,
      text: `${profile.name} ${profile.last_name}`
    })) || []
  }
}

export const ordersAPI = {
  getAll: async (params?: any) => {
    // Mock implementation - replace with actual Supabase queries when orders table is created
    return []
  },
  
  getByCode: async (code: string) => {
    // Mock implementation
    return null
  },
  
  create: async (orderData: any) => {
    // Mock implementation
    return null
  },
  
  update: async (code: string, orderData: any) => {
    // Mock implementation
    return null
  },
  
  searchByCode: async (code: string) => {
    // Mock implementation
    return null
  },
  
  searchByExtCode: async (extCode: string) => {
    // Mock implementation
    return null
  }
}

export const orderTypesAPI = {
  // Mock implementations - replace with actual Supabase queries when order_types table is created
  getAll: async () => [],
  getById: async (id: number) => null,
  create: async (file: File) => null,
  activate: async (id: number) => null,
  dismiss: async (id: number) => null,
  delete: async (id: number) => null,
  lookup: async (query: string) => []
}

export const tasksAPI = {
  // Mock implementations - replace with actual task management system integration
  getAll: async (entityClass: string = 'order') => [],
  getById: async (id: string, processKey: string) => null,
  submit: async (id: string, formData: any, processKey: string) => null,
  claim: async (id: string, processKey: string) => null,
  cancel: async (id: string, processKey: string) => null
}

export const profilesAPI = {
  getAll: async (params?: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
    if (error) throw error
    return data || []
  },
  
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },
  
  create: async (profileData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    if (error) throw error
    return data
  },
  
  update: async (id: number, profileData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const printAPI = {
  // Mock implementations - replace with actual print service integration
  printOrder: async (orderCode: string, convertToPdf: boolean = false) => null,
  printMultipleOrders: async (orderCodes: string[], convertToPdf: boolean = false) => null
}

export const businessProcessAPI = {
  // Mock implementations - replace with actual business process integration
  getButtons: async (entityCode: string, entityType: string, entityClass: string) => ({ buttons: [], bp_running: false }),
  startProcess: async (bpCode: string, entityCode: string, entityType: string, entityClass: string) => null
}