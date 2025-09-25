import React, { useState } from 'react'
import { CheckSquare, Clock, AlertTriangle, User, Calendar } from 'lucide-react'
import { Task } from '../types'

interface TaskWidgetProps {
  entityCode?: string
  entityType?: string
  entityClass?: string
}

const TaskWidget: React.FC<TaskWidgetProps> = ({ entityCode, entityType, entityClass }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Mock tasks for the widget
  const tasks: Task[] = [
    {
      id: '111111',
      name: 'Review Customer Data',
      assignee: 'demo',
      created: '2024-01-15T10:30:00Z',
      due: '2024-01-20T17:00:00Z',
      priority: 50,
      processName: 'Customer Review Process',
      processKey: 'customer_review',
      entityCode: entityCode || 'ORD-1234',
      entityUrl: `/orders/${entityCode}?task_id=111111`,
      description: 'Verify customer information and documentation'
    }
  ]

  const availableProcesses = [
    {
      name: 'Start Customer Onboarding',
      code: 'customer_onboarding',
      description: 'Begin the customer onboarding process',
      buttonClass: 'btn-primary'
    },
    {
      name: 'Request Support',
      code: 'support_request',
      description: 'Create a support ticket',
      buttonClass: 'btn-secondary'
    }
  ]

  if (!entityCode) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Process Control Buttons */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Business Processes</h3>
        </div>
        <div className="card-content">
          <div className="flex flex-wrap gap-2">
            {availableProcesses.map((process) => (
              <button
                key={process.code}
                className={`btn ${process.buttonClass}`}
                title={process.description}
              >
                {process.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      {tasks.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Active Tasks</h3>
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Created {new Date(task.created).toLocaleDateString()}</span>
                        </div>
                        {task.due && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Due {new Date(task.due).toLocaleDateString()}</span>
                          </div>
                        )}
                        {task.assignee && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>Assigned to {task.assignee}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        task.priority >= 75 ? 'bg-red-100 text-red-800' :
                        task.priority >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority >= 75 ? 'Urgent' : task.priority >= 50 ? 'High' : 'Medium'}
                      </span>
                      <button className="btn btn-primary text-xs">
                        Open Task
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Form (when a task is active) */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Task Form</h3>
        </div>
        <div className="card-content">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <CheckSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              No active task form. Start a business process or claim a task to see the form here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskWidget