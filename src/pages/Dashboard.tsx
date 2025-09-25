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
import { useOrders } from '../hooks/useOrders'
import { useTasks } from '../hooks/useTasks'
import StatusBadge from '../components/StatusBadge'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { orders, isLoading: ordersLoading } = useOrders()
  const { tasks, isLoading: tasksLoading } = useTasks()

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.state === 'to_execute').length
  const inProgressOrders = orders.filter(o => o.state === 'in_progress').length
  const completedOrders = orders.filter(o => o.state === 'done').length
  const activeTasks = tasks.filter(t => t.assignee).length

  const stats = [
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
    },
    {
      name: 'Active Tasks',
      value: activeTasks.toString(),
      change: '+4%',
      changeType: 'positive' as const,
      icon: CheckSquare,
    },
    {
      name: 'Pending Orders',
      value: pendingOrders.toString(),
      change: '-8%',
      changeType: 'negative' as const,
      icon: Clock,
    },
    {
      name: 'Completed Orders',
      value: completedOrders.toString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: CheckCircle,
    },
  ]

  const recentOrders = orders.slice(0, 4)

  return (
    <>
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
                    <td className="table-cell text-gray-900">{order.orderType.name}</td>
                    <td className="table-cell">
                      <StatusBadge status={order.state} size="sm" />
                    </td>
                    <td className="table-cell text-gray-500">
                      {order.user ? `${order.user.name} ${order.user.lastName}` : 'Unassigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(ordersLoading || tasksLoading) && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
    </>
  )
}

export default Dashboard