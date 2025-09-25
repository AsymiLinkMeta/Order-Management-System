import React, { useState } from 'react'
import { OrderType, Order } from '../types'
import { Calendar, User, FileText } from 'lucide-react'

interface OrderFormProps {
  orderType?: OrderType
  order?: Order
  onSubmit: (data: any) => void
  onCancel: () => void
}

const OrderForm: React.FC<OrderFormProps> = ({ orderType, order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, any>>(order?.data || {})
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | undefined>(orderType)

  // Mock order types for selection
  const orderTypes: OrderType[] = [
    {
      id: 1,
      code: 'new_customer',
      name: 'New Customer',
      active: true,
      fields: {
        customerName: { type: 'string', label: 'Customer Name', required: true },
        customerPhone: { type: 'string', label: 'Customer Phone', required: true },
        customerEmail: { type: 'string', label: 'Customer Email', required: false },
        customerCity: { type: 'string', label: 'Customer City', required: true },
        installDate: { type: 'datetime', label: 'Install Date', required: true }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      code: 'support_request',
      name: 'Support Request',
      active: true,
      fields: {
        problemDescription: { type: 'string', label: 'Problem Description', required: true },
        contractNumber: { type: 'number', label: 'Contract Number', required: false },
        callBack: { type: 'boolean', label: 'Callback Required', required: false }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      orderTypeId: selectedOrderType?.id,
      data: formData
    })
  }

  const renderField = (fieldName: string, fieldDef: any) => {
    const value = formData[fieldName] || ''

    switch (fieldDef.type) {
      case 'string':
        return (
          <input
            type="text"
            className="form-input mt-1"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            required={fieldDef.required}
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            className="form-input mt-1"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.valueAsNumber || '')}
            required={fieldDef.required}
          />
        )
      
      case 'boolean':
        return (
          <div className="mt-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={!!value}
                onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
          </div>
        )
      
      case 'datetime':
        return (
          <input
            type="datetime-local"
            className="form-input mt-1"
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value ? new Date(e.target.value).toISOString() : '')}
            required={fieldDef.required}
          />
        )
      
      case 'json':
        return (
          <textarea
            className="form-input mt-1 min-h-[100px]"
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder="Enter valid JSON"
            required={fieldDef.required}
          />
        )
      
      default:
        return (
          <input
            type="text"
            className="form-input mt-1"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            required={fieldDef.required}
          />
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              {order ? 'Edit Order' : 'Create New Order'}
            </h3>
          </div>
          <div className="card-content space-y-6">
            {/* Order Type Selection */}
            {!order && (
              <div>
                <label className="form-label">Order Type</label>
                <select
                  className="form-input mt-1"
                  value={selectedOrderType?.id || ''}
                  onChange={(e) => {
                    const orderType = orderTypes.find(ot => ot.id === parseInt(e.target.value))
                    setSelectedOrderType(orderType)
                    setFormData({}) // Reset form data when order type changes
                  }}
                  required
                >
                  <option value="">Select order type...</option>
                  {orderTypes.filter(ot => ot.active).map(orderType => (
                    <option key={orderType.id} value={orderType.id}>
                      {orderType.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dynamic Fields */}
            {selectedOrderType && (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Order Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedOrderType.fields).map(([fieldName, fieldDef]) => (
                    <div key={fieldName} className="space-y-1">
                      <label className="form-label">
                        {fieldDef.label}
                        {fieldDef.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {fieldDef.description && (
                        <p className="text-xs text-gray-500">{fieldDef.description}</p>
                      )}
                      {renderField(fieldName, fieldDef)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
                Additional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">External Code</label>
                  <input
                    type="text"
                    className="form-input mt-1"
                    placeholder="Optional external reference"
                  />
                </div>
                <div>
                  <label className="form-label">Estimated Execution Date</label>
                  <input
                    type="datetime-local"
                    className="form-input mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!selectedOrderType}
          >
            {order ? 'Update Order' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderForm