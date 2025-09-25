import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Users, 
  CheckSquare, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  const stats = [
    {
      name: 'Total Orders',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: 'Active Tasks',
      value: '56',
      change: '+4%',
      changeType: 'positive',
      icon: CheckSquare,
    },
    {
      name: 'Pending Orders',
      value: '23',
      change: '-8%',
      changeType: 'negative',
      icon: Clock,
    },
    {
      name: 'Completed Today',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: CheckCircle,
    },
  ]

  const recentOrders = [
    { code: 'ORD-1234', type: 'New Customer', status: 'in_progress', user: 'John Doe' },
    { code: 'ORD-1235', type: 'Support Request', status: 'to_execute', user: 'Jane Smith' },
    { code: 'ORD-1236', type: 'Vacation Request', status: 'done', user: 'Bob Johnson' },
    { code: 'ORD-1237', type: 'Pizza Order', status: 'in_progress', user: 'Alice Brown' },
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

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with your orders today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link
              to="/orders"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="card-content">
          <div className="overflow-hidden">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Order Code</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.code} className="table-row">
                    <td className="table-cell">
                      <Link
                        to={`/orders/${order.code}`}
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        {order.code}
                      </Link>
                    </td>
                    <td className="table-cell text-gray-900">{order.type}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500">{order.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/orders"
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="card-content">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-500">View and manage all orders</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/tasks"
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="card-content">
            <div className="flex items-center">
              <CheckSquare className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">My Tasks</h3>
                <p className="text-sm text-gray-500">View assigned tasks</p>
              </div>
            </div>
          </div>
        </Link>

        {user?.role === 'admin' && (
          <Link
            to="/users"
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="card-content">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-warning-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-500">Manage system users</p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Dashboard