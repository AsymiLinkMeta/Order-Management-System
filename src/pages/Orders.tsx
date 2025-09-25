import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Eye, AlertCircle } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import OrderForm from '../components/OrderForm'

const Orders: React.FC = () => {
  const navigate = useNavigate()
  const { orders, isLoading, error, createOrder } = useOrders()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateOrder, setShowCreateOrder] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderType.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.state === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateOrder = async (orderData: any) => {
    try {
      const newOrder = await createOrder(orderData)
      setShowCreateOrder(false)
      navigate(`/orders/${newOrder.code}`)
    } catch (err) {
      console.error('Failed to create order:', err)
    }
  }

  const columns = [
    {
      key: 'code',
      label: 'Order Code',
      sortable: true,
      render: (value: string) => (
        <Link
          to={`/orders/${value}`}
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          {value}
        </Link>
      )
    },
    {
      key: 'orderType',
      label: 'Type',
      sortable: true,
      render: (orderType: any) => orderType.name
    },
    {
      key: 'state',
      label: 'Status',
      sortable: true,
      render: (state: string) => <StatusBadge status={state as any} />
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      key: 'user',
      label: 'Assigned To',
      render: (user: any) => user ? `${user.name} ${user.lastName}` : 'Unassigned'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, order: any) => (
        <Link
          to={`/orders/${order.code}`}
          className="text-primary-600 hover:text-primary-500"
        >
          <Eye className="h-4 w-4" />
        </Link>
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading orders</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

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
        <button 
          onClick={() => setShowCreateOrder(true)}
          className="btn btn-primary"
        >
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

      {/* Orders Table */}
      <div className="card">
        <div className="card-content">
          <DataTable
            data={filteredOrders}
            columns={columns}
            searchable={false}
            emptyMessage="No orders found. Try adjusting your search or filter criteria."
            onRowClick={(order) => navigate(`/orders/${order.code}`)}
          />
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowCreateOrder(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <OrderForm
                  onSubmit={handleCreateOrder}
                  onCancel={() => setShowCreateOrder(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders