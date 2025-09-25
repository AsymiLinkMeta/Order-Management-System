export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }
  return { isValid: true }
}

export const validateRequired = (value: any, fieldName: string): { isValid: boolean; message?: string } => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, message: `${fieldName} is required` }
  }
  return { isValid: true }
}

export const validateForm = (data: Record<string, any>, rules: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field]

    if (rule.required) {
      const validation = validateRequired(value, rule.label || field)
      if (!validation.isValid) {
        errors[field] = validation.message!
      }
    }

    if (rule.type === 'email' && value) {
      if (!validateEmail(value)) {
        errors[field] = 'Invalid email format'
      }
    }

    if (rule.type === 'password' && value) {
      const validation = validatePassword(value)
      if (!validation.isValid) {
        errors[field] = validation.message!
      }
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `Must be at least ${rule.minLength} characters`
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `Must be no more than ${rule.maxLength} characters`
    }
  })

  return errors
}