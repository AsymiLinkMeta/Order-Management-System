import React from 'react'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: 'to_execute' | 'in_progress' | 'done'
  size?: 'sm' | 'md' | 'lg'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'to_execute':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: AlertCircle,
          text: 'New'
        }
      case 'in_progress':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: Clock,
          text: 'In Progress'
        }
      case 'done':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          text: 'Completed'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          text: status
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${config.color} ${sizeClasses[size]}`}>
      <Icon className={`${iconSizes[size]} mr-1`} />
      {config.text}
    </span>
  )
}

export default StatusBadge