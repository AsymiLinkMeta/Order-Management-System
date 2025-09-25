import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Eye, AlertCircle, Calendar, User as UserIcon } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { useProfiles } from '../hooks/useProfiles'
import { usePrint } from '../hooks/usePrint'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import OrderForm from '../components/OrderForm'
import CustomFieldFilter from '../components/CustomFieldFilter'
import ProfileManager from '../components/ProfileManager'
import OrderSearch from '../components/OrderSearch'
import PrintActions from '../components/PrintActions'
import { useAuth } from '../hooks/useAuth'

const Orders: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { orders, isLoading, error, createOrder } = useOrders()
  const { createProfile, updateProfile } = useProfiles()
  const { printMultipleOrders } = usePrint()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [customFieldFilters, setCustomFieldFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateOrder, setShowCreateOrder] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'filter' | 'search'>('filter')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderType.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.state === statusFilter
    const matchesOrderType = orderTypeFilter === 'all' || order.orderType.id.toString() === orderTypeFilter
    const matchesUser = userFilter === 'all' || 
                       (userFilter === 'empty' && !order.user) ||
                       (order.user && order.user.id.toString() === userFilter)
    
    // Apply custom field filters
    const matchesCustomFields = Object.entries(customFieldFilters).every(([fieldName, filter]) => {
      const fieldValue = order.data[fieldName]
      if (!filter.value) return true
      
      switch (filter.type) {
        case 'string':
          return fieldValue && fieldValue.toLowerCase().includes(filter.value.toLowerCase())
        case 'number':
          return fieldValue === filter.value
        case 'boolean':
          return fieldValue.toString() === filter.value
        case 'datetime':
          if (!fieldValue) return true
          const date = new Date(fieldValue)
          const fromDate = filter.value.from ? new Date(filter.value.from) : null
          const toDate = filter.value.to ? new Date(filter.value.to) : null
          return (!fromDate || date >= fromDate) && (!toDate || date <= toDate)
        default:
          return true
      }
    })
    
    return matchesSearch && matchesStatus && matchesOrderType && matchesUser && matchesCustomFields
  })

  const handleOrderSearch = async (criteria: { field: string; value: string }) => {
    try {
      // This would typically call the search API endpoint
      const searchResults = orders.filter(order => {
        if (criteria.field === 'code') {
          return order.code === criteria.value
        } else if (criteria.field === 'ext_code') {
          return order.extCode === criteria.value
        }
        return false
      })
      
      if (searchResults.length > 0) {
        navigate(`/orders/${searchResults[0].code}`)
      } else {
        alert(`Order not found with ${criteria.field}: ${criteria.value}`)
      }
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  const handleCreateOrder = async (orderData: any) => {
    try {
      const newOrder = await createOrder(orderData)
      setShowCreateOrder(false)
      navigate(`/orders/${newOrder.code}`)
    } catch (err) {
      console.error('Failed to create order:', err)
    }
  }

  const handlePrint = async (options: { convertToPdf: boolean; orderCodes: string[] }) => {
    try {
      await printMultipleOrders(options.orderCodes, options.convertToPdf)
    } catch (err) {
      console.error('Print failed:', err)
    }
  }

  const handleProfileSave = async (profileData: any) => {
    try {
      await createProfile(profileData)
    } catch (err) {
      console.error('Failed to save profile:', err)
    }
  }

  const uniqueOrderTypes = Array.from(new Set(orders.map(o => o.orderType.id)))
    .map(id => orders.find(o => o.orderType.id === id)?.orderType)
    .filter(Boolean)

  const uniqueUsers = Array.from(new Set(orders.map(o => o.user?.id).filter(Boolean)))
    .map(id => orders.find(o => o.user?.id === id)?.user)
    .filter(Boolean)

  const columns = [
    {
      key: 'select',
      label: '',
      render: (_: any, order: any) => (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          checked={selectedOrders.includes(order.code)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedOrders(prev => [...prev, order.code])
            } else {
              setSelectedOrders(prev => prev.filter(code => code !== order.code))
            }
          }}
        />
      )
    },
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
      key: 'extCode',
      label: 'External Code',
      render: (extCode: string) => extCode || '—'
    },
    {
      key: 'archived',
      label: 'Archived',
      render: (archived: boolean) => archived ? 'Yes' : 'No'
    },
    {
      key: 'estimatedExecDate',
      label: 'Due Date',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '—'
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
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('filter')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'filter'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Filter Records
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'search'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Search for Record
              </button>
            </nav>
          </div>

          {activeTab === 'filter' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">Order Type</label>
                  <select
                    className="form-input mt-1"
                    value={orderTypeFilter}
                    onChange={(e) => setOrderTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {uniqueOrderTypes.map(orderType => (
                      <option key={orderType!.id} value={orderType!.id.toString()}>
                        {orderType!.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-input mt-1"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="to_execute">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">User</label>
                  <select
                    className="form-input mt-1"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="empty">Unassigned</option>
                    {uniqueUsers.map(user => (
                      <option key={user!.id} value={user!.id.toString()}>
                        {user!.name} {user!.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button className="btn btn-primary w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </button>
                </div>
              </div>
              
              {/* Custom Field Filters */}
              {orderTypeFilter !== 'all' && (
                <CustomFieldFilter
                  orderType={uniqueOrderTypes.find(ot => ot!.id.toString() === orderTypeFilter)}
                  onFilterChange={setCustomFieldFilters}
                />
              )}
            </div>
          ) : (
            <OrderSearch onSearch={handleOrderSearch} />
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Orders</h3>
              <p className="text-sm text-gray-600">
                Found {filteredOrders.length} orders
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedOrders.length > 0 && (
                <PrintActions
                  orderCodes={selectedOrders}
                  onPrint={handlePrint}
                />
              )}
              {orderTypeFilter !== 'all' && user && (
                <ProfileManager
                  orderTypeId={parseInt(orderTypeFilter)}
                  userId={user.id}
                  fields={uniqueOrderTypes.find(ot => ot!.id.toString() === orderTypeFilter)?.fields || {}}
                  onSave={handleProfileSave}
                />
              )}
            </div>
          </div>
        </div>
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