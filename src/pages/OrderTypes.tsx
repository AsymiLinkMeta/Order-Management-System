import React, { useState } from 'react'
import { Plus, Search, Eye, Trash2, Upload, CheckCircle, XCircle } from 'lucide-react'
import { OrderType } from '../types'

const OrderTypes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showUpload, setShowUpload] = useState(false)

  // Mock data - in a real app, this would come from an API
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
        installDate: { type: 'datetime', label: 'Install Date', required: true }
      },
      printFormCode: 'new_customer_form',
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
      printFormCode: 'support_form',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 3,
      code: 'vacation_request',
      name: 'Vacation Request',
      active: false,
      fields: {
        employee: { type: 'string', label: 'Employee', required: true },
        startDate: { type: 'datetime', label: 'Start Date', required: true },
        endDate: { type: 'datetime', label: 'End Date', required: true },
        reason: { type: 'string', label: 'Reason', required: false }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]

  const filteredOrderTypes = orderTypes.filter(orderType =>
    orderType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orderType.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Name</th>
                  <th className="table-head">Code</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Fields</th>
                  <th className="table-head">Print Form</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrderTypes.map((orderType) => (
                  <tr key={orderType.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">{orderType.name}</div>
                    </td>
                    <td className="table-cell">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {orderType.code}
                      </code>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {orderType.active ? (
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
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-600">
                        {Object.keys(orderType.fields).length} fields
                      </span>
                    </td>
                    <td className="table-cell">
                      {orderType.printFormCode ? (
                        <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {orderType.printFormCode}
                        </code>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="table-cell text-gray-500">
                      {new Date(orderType.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-500">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowUpload(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Order Type</h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">YAML File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" accept=".yml,.yaml" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">YAML files only</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowUpload(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTypes