export const formatDate = (date: string | Date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString()
}

export const formatDateTime = (date: string | Date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString()
}

export const formatCurrency = (amount: number, currency = 'USD') => {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const formatBoolean = (value: boolean) => {
  return value ? 'Yes' : 'No'
}

export const formatFieldValue = (value: any, fieldType: string) => {
  if (value === null || value === undefined) return '—'
  
  switch (fieldType) {
    case 'datetime':
      return formatDateTime(value)
    case 'boolean':
      return formatBoolean(value)
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value
    case 'json':
      try {
        return JSON.stringify(JSON.parse(value), null, 2)
      } catch {
        return String(value)
      }
    default:
      return String(value)
  }
}

export const getRelativeTime = (date: string | Date) => {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays}d ago`
  } else if (diffHours > 0) {
    return `${diffHours}h ago`
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ago`
  } else {
    return 'Just now'
  }
}

export const getDueStatus = (dueDate?: string) => {
  if (!dueDate) return null
  
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return {
      text: `expired (${Math.abs(diffDays)}d past due date)`,
      type: 'expired' as const
    }
  } else if (diffDays === 0) {
    return {
      text: 'due today',
      type: 'due-today' as const
    }
  } else if (diffDays <= 3) {
    return {
      text: `${diffDays}d to due date`,
      type: 'due-soon' as const
    }
  } else {
    return {
      text: `${diffDays}d to due date`,
      type: 'normal' as const
    }
  }
}