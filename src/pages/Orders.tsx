import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Eye } from 'lucide-react'
import { Order } from '../types'

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - in a real app, this would come from an API
  const orders: Order[] = [
    {
      id: 1,
      code: 'ORD-1234',
      extCode: 'EXT-001',
      state: 'in_progress',
      archived: false,
      data: { customerName: 'John Doe', customerPhone: '+1234567890' },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      orderType: {
        id: 1,
        code: 'new_customer',
        name: 'New Customer',
        active: true,
        fields: {},
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
        role: 'user',
        blocked: false,
        external: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    },
    {
      id: 2,
      code: 'ORD-1235',
      state: 'to_execute',
      archived: false,
      data: { problemDescription: 'System issue', contractNumber: 12345 },
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
      orderType: {
        id: 2,
        code: 'support_request',
        name: 'Support Request',
        active: true,
        fields: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    },
    {
      id: 3,
      code: 'ORD-1236',
      state: 'done',
      archived: false,
      data: { employee: 'Jane Smith', vacationDays: 5 },
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      orderType: {
        id: 3,
        code: 'vacation_request',
        name: 'Vacation Request',
        active: true,
        fields: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    }
  ]

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderType.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.state === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all orders in the system
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="form-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="to_execute">New</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="card">
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Order Code</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Assigned To</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="table-cell">
                      <Link
                        to={`/orders/${order.code}`}
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        {order.code}
                      </Link>
                    </td>
                    <td className="table-cell">{order.orderType.name}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.state)}`}>
                        {getStatusText(order.state)}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell text-gray-500">
                      {order.user ? `${order.user.name} ${order.user.lastName}` : 'Unassigned'}
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/orders/${order.code}`}
                        className="text-primary-600 hover:text-primary-500"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders