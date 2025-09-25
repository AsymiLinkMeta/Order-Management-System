import React, { useState } from 'react'
import { Plus, Search, Eye, Trash2, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useOrderTypes } from '../hooks/useOrderTypes'
import { useAuth } from '../hooks/useAuth'
import OrderTypeUpload from '../components/OrderTypeUpload'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'

const OrderTypes: React.FC = () => {
  const { user } = useAuth()
  const { orderTypes, isLoading, error, uploadOrderType, activateOrderType, dismissOrderType, deleteOrderType } = useOrderTypes()
  const [searchTerm, setSearchTerm] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [viewingOrderType, setViewingOrderType] = useState<any>(null)
  const [deletingOrderType, setDeletingOrderType] = useState<any>(null)
  const [actionOrderType, setActionOrderType] = useState<{ orderType: any; action: 'activate' | 'dismiss' } | null>(null)

  const handleUpload = async (file: File) => {
    try {
      await uploadOrderType(file)
      setShowUpload(false)
    } catch (err) {
      console.error('Failed to upload order type:', err)
    }
  }

  const handleAction = async () => {
    try {
      if (actionOrderType?.action === 'activate') {
        await activateOrderType(actionOrderType.orderType.id)
      } else if (actionOrderType?.action === 'dismiss') {
        await dismissOrderType(actionOrderType.orderType.id)
      }
      setActionOrderType(null)
    } catch (err) {
      console.error('Failed to perform action:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteOrderType(deletingOrderType.id)
      setDeletingOrderType(null)
    } catch (err) {
      console.error('Failed to delete order type:', err)
    }
  }

  const filteredOrderTypes = orderTypes.filter(orderType =>
    orderType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orderType.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (name: string, orderType: any) => (
        <button
          onClick={() => setViewingOrderType(orderType)}
          className="font-medium text-primary-600 hover:text-primary-500 text-left"
        >
          {name}
        </button>
      )
    },
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (code: string) => (
        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
          {code}
        </code>
      )
    },
    {
      key: 'active',
      label: 'Status',
      sortable: true,
      render: (active: boolean) => (
        <div className="flex items-center space-x-2">
          {active ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">Active</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Inactive</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'fields',
      label: 'Fields',
      render: (fields: any) => (
        <span className="text-sm text-gray-600">
          {Object.keys(fields).length} fields
        </span>
      )
    },
    {
      key: 'printFormCode',
      label: 'Print Form',
      render: (printFormCode: string) => (
        printFormCode ? (
          <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {printFormCode}
          </code>
        ) : (
          <span className="text-sm text-gray-400">None</span>
        )
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, orderType: any) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setViewingOrderType(orderType)}
            className="text-primary-600 hover:text-primary-500"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {!orderType.active && (
            <button 
              onClick={() => setActionOrderType({ orderType, action: 'activate' })}
              className="text-green-600 hover:text-green-500"
              title="Activate order type"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          {!orderType.active && (
            <button 
              onClick={() => setActionOrderType({ orderType, action: 'dismiss' })}
              className="text-yellow-600 hover:text-yellow-500"
              title="Dismiss order type"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          <button 
            onClick={() => setDeletingOrderType(orderType)}
            className="text-red-600 hover:text-red-500"
            title="Delete order type"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading order types</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Types</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage order type definitions and their custom fields
          </p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="btn btn-primary"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload YAML
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-content">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search order types..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Order Types table */}
      <div className="card">
        <div className="card-content">
          <DataTable
            data={filteredOrderTypes}
            columns={columns}
            searchable={false}
            emptyMessage="No order types found"
          />
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowUpload(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <OrderTypeUpload
                  onUpload={handleUpload}
                  onCancel={() => setShowUpload(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Type Modal */}
      {viewingOrderType && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setViewingOrderType(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{viewingOrderType.name}</h3>
                  <div className="flex items-center space-x-2">
                    {!viewingOrderType.active && (
                      <>
                        <button
                          onClick={() => setActionOrderType({ orderType: viewingOrderType, action: 'activate' })}
                          className="btn btn-success text-sm"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => setActionOrderType({ orderType: viewingOrderType, action: 'dismiss' })}
                          className="btn btn-warning text-sm"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Code</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">{viewingOrderType.code}</div>
                      </div>
                      <div>
                        <label className="form-label">Print Form Code</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">
                          {viewingOrderType.printFormCode || 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Custom Fields</h4>
                    <div className="space-y-3">
                      {Object.entries(viewingOrderType.fields).map(([fieldName, fieldDef]: [string, any]) => (
                        <div key={fieldName} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{fieldDef.label}</h5>
                              <p className="text-sm text-gray-500">Field: {fieldName}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {fieldDef.type}
                              </span>
                              {fieldDef.required && (
                                <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                          {fieldDef.description && (
                            <p className="mt-2 text-sm text-gray-600">{fieldDef.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingOrderType}
        title="Delete Order Type"
        message={`Are you sure you want to delete the order type "${deletingOrderType?.name}"? Existing orders won't be affected.`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeletingOrderType(null)}
      />

      {/* Action Confirmation */}
      <ConfirmDialog
        isOpen={!!actionOrderType}
        title={actionOrderType?.action === 'activate' ? 'Activate Order Type' : 'Dismiss Order Type'}
        message={
          actionOrderType?.action === 'activate'
            ? `Activate the order type "${actionOrderType?.orderType?.name}"? This will make it available for creating new orders.`
            : `Dismiss the order type "${actionOrderType?.orderType?.name}"? This will permanently remove it from the system.`
        }
        confirmText={actionOrderType?.action === 'activate' ? 'Activate' : 'Dismiss'}
        cancelText="Cancel"
        type={actionOrderType?.action === 'dismiss' ? 'danger' : 'warning'}
        onConfirm={handleAction}
        onCancel={() => setActionOrderType(null)}
      />
    </div>
  )
}

export default OrderTypes