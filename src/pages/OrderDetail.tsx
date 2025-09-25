import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, User, FileText } from 'lucide-react'

const OrderDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>()

  // Mock data - in a real app, this would be fetched based on the code
  const order = {
    id: 1,
    code: code || 'ORD-1234',
    extCode: 'EXT-001',
    state: 'in_progress',
    archived: false,
    data: {
      customerName: 'John Doe',
      customerPhone: '+1234567890',
      customerEmail: 'john@example.com',
      customerCity: 'New York',
      customerStreet: 'Main Street',
      customerHouse: '123',
      installDate: '2024-02-01T10:00:00Z'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    estimatedExecDate: '2024-02-01T10:00:00Z',
    orderType: {
      id: 1,
      code: 'new_customer',
      name: 'New Customer',
      active: true,
      fields: {
        customerName: { type: 'string', label: 'Customer Name', required: true },
        customerPhone: { type: 'string', label: 'Customer Phone', required: true },
        customerEmail: { type: 'string', label: 'Customer Email', required: false },
        customerCity: { type: 'string', label: 'Customer City', required: true },
        customerStreet: { type: 'string', label: 'Customer Street', required: true },
        customerHouse: { type: 'string', label: 'Customer House', required: true },
        installDate: { type: 'datetime', label: 'Install Date', required: true }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    user: {
      id: 1,
      email: 'john@example.com',
      name: 'John',
      lastName: 'Doe',
      company: 'Example Corp',
      department: 'Sales',
      role: 'user' as const,
      blocked: false,
      external: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_execute': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'to_execute': return 'New'
      case 'in_progress': return 'In Progress'
      case 'done': return 'Completed'
      default: return status
    }
  }

  const formatFieldValue = (value: any, fieldType: string) => {
    if (value === null || value === undefined) return '—'
    
    switch (fieldType) {
      case 'datetime':
        return new Date(value).toLocaleString()
      case 'boolean':
        return value ? 'Yes' : 'No'
      default:
        return String(value)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/orders"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {order.code} - {order.orderType.name}
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.state)}`}>
                {getStatusText(order.state)}
              </span>
              {order.extCode && (
                <span className="text-sm text-gray-500">
                  External: {order.extCode}
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="btn btn-primary">
          <Edit className="h-4 w-4 mr-2" />
          Edit Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom Fields */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Order Data</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(order.orderType.fields).map(([fieldName, fieldDef]) => (
                  <div key={fieldName} className="space-y-1">
                    <label className="form-label">{fieldDef.label}</label>
                    <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded-md">
                      {formatFieldValue(order.data[fieldName], fieldDef.type)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Process Controls */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Business Process</h3>
            </div>
            <div className="card-content">
              <div className="flex space-x-3">
                <button className="btn btn-primary">
                  Start Process
                </button>
                <button className="btn btn-secondary">
                  View Process History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Order Information</h3>
            </div>
            <div className="card-content space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium">Order Code</div>
                  <div className="text-sm text-gray-600">{order.code}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {order.estimatedExecDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Due Date</div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.estimatedExecDate).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {order.user && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Assigned To</div>
                    <div className="text-sm text-gray-600">
                      {order.user.name} {order.user.lastName}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Actions</h3>
            </div>
            <div className="card-content space-y-2">
              <button className="btn btn-secondary w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </button>
              <button className="btn btn-secondary w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Print Order
              </button>
              <button className="btn btn-secondary w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Update Due Date
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail