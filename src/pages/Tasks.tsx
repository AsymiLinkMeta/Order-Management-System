import React, { useState } from 'react'
import { Search, Clock, AlertCircle, CheckSquare, User, Calendar, ExternalLink } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import TaskForm from '../components/TaskForm'
import DataTable from '../components/DataTable'

const Tasks: React.FC = () => {
  const { user } = useAuth()
  const { tasks, isLoading, error, claimTask, completeTask } = useTasks()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'my' | 'unassigned'>('my')
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [taskForm, setTaskForm] = useState<any>(null)

  const myTasks = tasks.filter(task => task.assignee === user?.email)
  const unassignedTasks = tasks.filter(task => !task.assignee)

  const handleClaimTask = async (taskId: string) => {
    try {
      await claimTask(taskId)
    } catch (err) {
      console.error('Failed to claim task:', err)
    }
  }

  const handleTaskSubmit = async (formData: any) => {
    try {
      await completeTask(selectedTask.id, formData)
      setSelectedTask(null)
      setTaskForm(null)
    } catch (err) {
      console.error('Failed to submit task:', err)
    }
  }

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    // In a real app, this would fetch the task form from the API
    setTaskForm({
      fields: [
        {
          name: 'comment',
          type: 'text',
          label: 'Comments',
          required: false,
          editable: true
        }
      ]
    })
  }

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

  const columns = [
    {
      key: 'priority',
      label: 'Priority',
      render: (priority: number) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(priority)}`}>
          {getPriorityText(priority)}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Title',
      sortable: true,
      render: (name: string, task: any) => (
        <div>
          <button
            onClick={() => handleTaskClick(task)}
            className="font-medium text-primary-600 hover:text-primary-500 text-left"
          >
            {name}
          </button>
          <div className="text-sm text-gray-500">{task.entityCode}</div>
        </div>
      )
    },
    {
      key: 'processName',
      label: 'Process',
      sortable: true,
      render: (processName: string) => (
        <div className="text-sm text-gray-900">{processName}</div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (description: string) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {description || '—'}
        </div>
      )
    },
    {
      key: 'created',
      label: 'Created/Due',
      render: (_: any, task: any) => (
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
      )
    },
    ...(activeTab === 'unassigned' ? [{
      key: 'actions',
      label: 'Actions',
      render: (_: any, task: any) => (
        <button 
          onClick={() => handleClaimTask(task.id)}
          className="btn btn-primary text-xs"
        >
          Claim
        </button>
      )
    }] : [])
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading tasks</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

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
          <DataTable
            data={filteredTasks}
            columns={columns}
            searchable={false}
            emptyMessage={
              activeTab === 'my' 
                ? "You don't have any assigned tasks at the moment."
                : "There are no unclaimed tasks available."
            }
          />
        </div>
      </div>

      {/* Task Form Modal */}
      {selectedTask && taskForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => {
              setSelectedTask(null)
              setTaskForm(null)
            }} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <TaskForm
                  task={selectedTask}
                  formFields={taskForm.fields}
                  onSubmit={handleTaskSubmit}
                  onCancel={() => {
                    setSelectedTask(null)
                    setTaskForm(null)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks