import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, User, FileText, Settings } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import StatusBadge from '../components/StatusBadge'
import TaskWidget from '../components/TaskWidget'

const OrderDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>()
  const { orders, isLoading } = useOrders()

  const order = orders.find(o => o.code === code)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The order with code "{code}" could not be found.
        </p>
        <Link to="/orders" className="mt-4 btn btn-primary">
          Back to Orders
        </Link>
      </div>
    )
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
              <StatusBadge status={order.state} />
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Process Widget */}
          <TaskWidget 
            entityCode={order.code}
            entityType={order.orderType.code}
            entityClass="order"
          />

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
                  <div className="text-sm font-medium">Type</div>
                  <div className="text-sm text-gray-600">{order.orderType.name}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium">Code</div>
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