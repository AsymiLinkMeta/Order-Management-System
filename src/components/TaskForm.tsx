import React, { useState } from 'react'
import { Task } from '../types'
import { Calendar, User, AlertCircle } from 'lucide-react'

interface TaskFormProps {
  task: Task
  formFields?: any[]
  onSubmit: (formData: any) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  formFields = [], 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    formFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to submit form' })
    }
  }

  const renderField = (field: any) => {
    const value = formData[field.name] || ''

    switch (field.type) {
      case 'string':
        return (
          <input
            type="text"
            className={`form-input mt-1 ${errors[field.name] ? 'border-red-500' : ''}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            disabled={isLoading || !field.editable}
            placeholder={field.placeholder}
          />
        )
      
      case 'text':
        return (
          <textarea
            className={`form-input mt-1 min-h-[100px] ${errors[field.name] ? 'border-red-500' : ''}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            disabled={isLoading || !field.editable}
            rows={field.rows || 3}
            placeholder={field.placeholder}
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            className={`form-input mt-1 ${errors[field.name] ? 'border-red-500' : ''}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.valueAsNumber || '')}
            disabled={isLoading || !field.editable}
          />
        )
      
      case 'boolean':
      case 'checkbox':
        return (
          <div className="mt-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                disabled={isLoading || !field.editable}
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
          </div>
        )
      
      case 'datetime':
        return (
          <input
            type="datetime-local"
            className={`form-input mt-1 ${errors[field.name] ? 'border-red-500' : ''}`}
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value ? new Date(e.target.value).toISOString() : '')}
            disabled={isLoading || !field.editable}
          />
        )
      
      case 'select':
        return (
          <select
            className={`form-input mt-1 ${errors[field.name] ? 'border-red-500' : ''}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            disabled={isLoading || !field.editable}
          >
            {field.nullable && <option value="">Select...</option>}
            {field.choices?.map((choice: any, index: number) => (
              <option key={index} value={Array.isArray(choice) ? choice[0] : choice}>
                {Array.isArray(choice) ? choice[1] : choice}
              </option>
            ))}
          </select>
        )
      
      case 'static':
        return (
          <div 
            className="mt-1 p-3 bg-gray-50 rounded-md"
            dangerouslySetInnerHTML={{ __html: field.html || '' }}
          />
        )
      
      default:
        return (
          <input
            type="text"
            className={`form-input mt-1 ${errors[field.name] ? 'border-red-500' : ''}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            disabled={isLoading || !field.editable}
          />
        )
    }
  }

  const renderGroup = (group: any) => (
    <div key={group.name} className="space-y-4">
      {group.label && (
        <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
          {group.label}
        </h4>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {group.fields?.map((field: any) => (
          field.type === 'group' ? renderGroup(field) : (
            <div key={field.name} className="space-y-1">
              {field.label && (
                <label className="form-label">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {field.description && (
                <p className="text-xs text-gray-500">{field.description}</p>
              )}
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
              <p className="text-sm text-gray-500">{task.processName}</p>
            </div>
          </div>
        </div>
        
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map(field => 
              field.type === 'group' ? renderGroup(field) : (
                <div key={field.name} className="space-y-1">
                  {field.label && (
                    <label className="form-label">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}
                  {field.description && (
                    <p className="text-xs text-gray-500">{field.description}</p>
                  )}
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="text-sm text-red-600">{errors[field.name]}</p>
                  )}
                </div>
              )
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TaskForm