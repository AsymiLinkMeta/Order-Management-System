import axios from 'axios'
import { User, Order, OrderType, Task, Profile } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    if (userData.apiToken) {
      config.headers.Authorization = `Bearer ${userData.apiToken}`
    }
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/sign_in', {
      user: { email, password }
    })
    return response.data
  },
  
  logout: async () => {
    await api.delete('/users/sign_out')
  }
}

export const ordersAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/orders', { params })
    return response.data.orders
  },
  
  getByCode: async (code: string) => {
    const response = await api.get(`/orders/${code}`)
    return response.data.order
  },
  
  create: async (orderData: any) => {
    const response = await api.post('/orders', { order: orderData })
    return response.data.order
  },
  
  update: async (code: string, orderData: any) => {
    const response = await api.put(`/orders/${code}`, { order: orderData })
    return response.data.order
  },
  
  searchByCode: async (code: string) => {
    const response = await api.get(`/orders/search_by/code?value=${code}`)
    return response.data
  },
  
  searchByExtCode: async (extCode: string) => {
    const response = await api.get(`/orders/search_by/ext_code?value=${extCode}`)
    return response.data
  }
}

export const usersAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/users', { params })
    return response.data.users
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`)
    return response.data.user
  },
  
  create: async (userData: any) => {
    const response = await api.post('/users', { user: userData })
    return response.data.user
  },
  
  update: async (id: number, userData: any) => {
    const response = await api.put(`/users/${id}`, { user: userData })
    return response.data.user
  },
  
  delete: async (id: number) => {
    await api.delete(`/users/${id}`)
  },
  
  generateApiToken: async (id: number) => {
    const response = await api.put(`/users/${id}/generate_api_token`)
    return response.data.user
  },
  
  clearApiToken: async (id: number) => {
    const response = await api.delete(`/users/${id}/clear_api_token`)
    return response.data.user
  },
  
  lookup: async (query: string) => {
    const response = await api.get(`/users/lookup?q=${query}`)
    return response.data
  }
}

export const orderTypesAPI = {
  getAll: async () => {
    const response = await api.get('/admin/order_types')
    return response.data.order_types
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/admin/order_types/${id}`)
    return response.data.order_type
  },
  
  create: async (file: File) => {
    const formData = new FormData()
    formData.append('order_type[file]', file)
    
    const response = await api.post('/admin/order_types', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  activate: async (id: number) => {
    const response = await api.put(`/admin/order_types/${id}/activate`)
    return response.data
  },
  
  dismiss: async (id: number) => {
    await api.delete(`/admin/order_types/${id}/dismiss`)
  },
  
  delete: async (id: number) => {
    await api.delete(`/admin/order_types/${id}`)
  },
  
  lookup: async (query: string) => {
    const response = await api.get(`/admin/order_types/lookup?q=${query}`)
    return response.data
  }
}

export const tasksAPI = {
  getAll: async (entityClass: string = 'order') => {
    const response = await api.get('/widget/tasks', {
      params: { entity_class: entityClass }
    })
    return response.data.tasks
  },
  
  getById: async (id: string, processKey: string) => {
    const response = await api.get(`/widget/tasks/${id}`, {
      params: { process_key: processKey }
    })
    return response.data
  },
  
  submit: async (id: string, formData: any, processKey: string) => {
    await api.put(`/widget/tasks/${id}/form`, {
      form_data: formData,
      process_key: processKey
    })
  },
  
  claim: async (id: string, processKey: string) => {
    await api.post(`/widget/tasks/${id}/claim`, {
      process_key: processKey
    })
  },
  
  cancel: async (id: string, processKey: string) => {
    await api.delete(`/widget/tasks/${id}`, {
      params: { process_key: processKey }
    })
  }
}

export const profilesAPI = {
  create: async (profileData: any) => {
    const response = await api.post('/profiles', { profile: profileData })
    return response.data.profile
  },
  
  update: async (id: number, profileData: any) => {
    const response = await api.put(`/profiles/${id}`, { profile: profileData })
    return response.data.profile
  }
}

export default api