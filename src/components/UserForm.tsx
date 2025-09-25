import React, { useState } from 'react'
import { User, UserRole } from '../types'

interface UserFormProps {
  user?: User
  onSubmit: (userData: Partial<User>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    middleName: user?.middleName || '',
    email: user?.email || '',
    company: user?.company || '',
    department: user?.department || '',
    role: user?.role || 'user' as UserRole,
    password: '',
    passwordConfirmation: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    
    if (!user) { // Creating new user
      if (!formData.password) newErrors.password = 'Password is required'
      if (formData.password !== formData.passwordConfirmation) {
        newErrors.passwordConfirmation = 'Passwords do not match'
      }
    } else if (formData.password && formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submitData: any = {
      name: formData.name,
      lastName: formData.lastName,
      middleName: formData.middleName || undefined,
      email: formData.email,
      company: formData.company,
      department: formData.department,
      role: formData.role
    }

    if (formData.password) {
      submitData.password = formData.password
      submitData.passwordConfirmation = formData.passwordConfirmation
    }

    try {
      await onSubmit(submitData)
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to save user' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`form-input mt-1 ${errors.name ? 'border-red-500' : ''}`}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="form-label">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`form-input mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={isLoading}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Middle Name</label>
        <input
          type="text"
          className="form-input mt-1"
          value={formData.middleName}
          onChange={(e) => handleChange('middleName', e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="form-label">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className={`form-input mt-1 ${errors.email ? 'border-red-500' : ''}`}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={isLoading}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`form-input mt-1 ${errors.company ? 'border-red-500' : ''}`}
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            disabled={isLoading}
          />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
        </div>

        <div>
          <label className="form-label">
            Department <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`form-input mt-1 ${errors.department ? 'border-red-500' : ''}`}
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            disabled={isLoading}
          />
          {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Role</label>
        <select
          className="form-input mt-1"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          disabled={isLoading}
        >
          <option value="user">User</option>
          <option value="vip">VIP User</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">
            Password {!user && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            className={`form-input mt-1 ${errors.password ? 'border-red-500' : ''}`}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            disabled={isLoading}
            placeholder={user ? 'Leave blank to keep current password' : ''}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label className="form-label">
            Confirm Password {!user && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            className={`form-input mt-1 ${errors.passwordConfirmation ? 'border-red-500' : ''}`}
            value={formData.passwordConfirmation}
            onChange={(e) => handleChange('passwordConfirmation', e.target.value)}
            disabled={isLoading}
          />
          {errors.passwordConfirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation}</p>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  )
}

export default UserForm