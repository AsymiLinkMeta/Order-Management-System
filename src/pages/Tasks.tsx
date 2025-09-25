import React, { useState } from 'react'
import { Search, Clock, AlertCircle, CheckSquare, User, Calendar } from 'lucide-react'
import { Task } from '../types'

const Tasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'my' | 'unassigned'>('my')

  // Mock data - in a real app, this would come from an API
  const myTasks: Task[] = [
    {
      id: '111111',
      name: 'Process New Customer Application',
      assignee: 'demo',
      created: '2024-01-15T10:30:00Z',
      due: '2024-01-20T17:00:00Z',
      priority: 50,
      processName: 'New Customer Process',
      processKey: 'new_customer',
      entityCode: 'ORD-1234',
      entityUrl: '/orders/ORD-1234?task_id=111111',
      description: 'Review and approve new customer application'
    },
    {
      id: '111112',
      name: 'Handle Support Request',
      assignee: 'demo',
      created: '2024-01-14T14:20:00Z',
      due: '2024-01-16T12:00:00Z',
      priority: 75,
      processName: 'Support Process',
      processKey: 'support_request',
      entityCode: 'ORD-1235',
      entityUrl: '/orders/ORD-1235?task_id=111112',
      description: 'Investigate and resolve customer issue'
    }
  ]

  const unassignedTasks: Task[] = [
    {
      id: '111113',
      name: 'Review Vacation Request',
      created: '2024-01-15T08:00:00Z',
      due: '2024-01-18T17:00:00Z',
      priority: 25,
      processName: 'Vacation Process',
      processKey: 'vacation_request',
      entityCode: 'ORD-1236',
      entityUrl: '/orders/ORD-1236?task_id=111113',
      description: 'Approve or reject vacation request'
    },
    {
      id: '111114',
      name: 'Process Pizza Order',
      created: '2024-01-15T12:00:00Z',
      priority: 50,
      processName: 'Pizza Order Process',
      processKey: 'pizza_order',
      entityCode: 'ORD-1237',
      entityUrl: '/orders/ORD-1237?task_id=111114'
    }
  ]

  const getPriorityColor = (priority: number) => {
    if (priority >= 75) return 'bg-red-100 text-red-800'
    if (priority >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getPriorityText = (priority: number) => {
    if (priority >= 75) return 'Urgent'
    if (priority >= 50) return 'High'
    return 'Medium'
  }

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null
    
    const due = new Date(dueDate)
    const now = new Date()
    const diffMs = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `expired (${Math.abs(diffDays)}d past due date)`
    } else if (diffDays === 0) {
      return 'due today'
    } else {
      return `${diffDays}d to due date`
    }
  }

  const currentTasks = activeTab === 'my' ? myTasks : unassignedTasks
  const filteredTasks = currentTasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.entityCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your assigned tasks and claim new ones
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-primary-100 text-primary-800 px-3 py-2 rounded-lg">
          <CheckSquare className="h-4 w-4" />
          <span className="font-medium">{myTasks.length}/{myTasks.length + unassignedTasks.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-content">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('my')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'my'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My tasks ({myTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('unassigned')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'unassigned'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unclaimed tasks ({unassignedTasks.length})
          </button>
        </nav>
      </div>

      {/* Tasks table */}
      <div className="card">
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Priority</th>
                  <th className="table-head">Title</th>
                  <th className="table-head">Process</th>
                  <th className="table-head">Description</th>
                  <th className="table-head">Created/Due</th>
                  {activeTab === 'unassigned' && <th className="table-head">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="table-row cursor-pointer hover:bg-gray-50">
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">{task.name}</div>
                      <div className="text-sm text-gray-500">{task.entityCode}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">{task.processName}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {task.description || '—'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.created).toLocaleDateString()}</span>
                        </div>
                        {task.due && (
                          <div className={`text-xs mt-1 ${
                            formatDueDate(task.due)?.includes('expired') ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {formatDueDate(task.due)}
                          </div>
                        )}
                      </div>
                    </td>
                    {activeTab === 'unassigned' && (
                      <td className="table-cell">
                        <button className="btn btn-primary text-xs">
                          Claim
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'my' 
                  ? "You don't have any assigned tasks at the moment."
                  : "There are no unclaimed tasks available."
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowUpload(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Order Type YAML</h3>
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
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="text-sm text-blue-800">
                      <strong>Example YAML structure:</strong>
                      <pre className="mt-2 text-xs bg-blue-100 p-2 rounded overflow-x-auto">
{`order_type:
  code: my_order_type
  name: My Order Type
  fields:
    field_name:
      type: string
      label: Field Label
      required: true`}
                      </pre>
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
                      Upload & Validate
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

export default Tasks