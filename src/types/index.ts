export interface User {
  id: number
  email: string
  name: string
  lastName: string
  middleName?: string
  company: string
  department: string
  role: 'user' | 'vip' | 'admin'
  blocked: boolean
  external: boolean
  apiToken?: string
  createdAt: string
  updatedAt: string
}

export interface OrderType {
  id: number
  code: string
  name: string
  active: boolean
  fields: Record<string, FieldDefinition>
  printFormCode?: string
  createdAt: string
  updatedAt: string
}

export interface FieldDefinition {
  type: 'string' | 'number' | 'boolean' | 'datetime' | 'json'
  label: string
  description?: string
  required?: boolean
  multiple?: boolean
  visible?: boolean
  editable?: boolean
}

export interface Order {
  id: number
  code: string
  extCode?: string
  bpId?: string
  bpState?: string
  state: 'to_execute' | 'in_progress' | 'done'
  doneAt?: string
  archived: boolean
  data: Record<string, any>
  estimatedExecDate?: string
  createdAt: string
  updatedAt: string
  orderType: OrderType
  user?: User
}

export interface Task {
  id: string
  name: string
  assignee?: string
  created: string
  due?: string
  priority: number
  processName: string
  processKey: string
  entityCode: string
  entityUrl: string
  description?: string
}

export interface Profile {
  id: number
  data: Record<string, any>
  orderTypeCode: string
  userEmail: string
}

export type OrderState = 'to_execute' | 'in_progress' | 'done'
export type UserRole = 'user' | 'vip' | 'admin'