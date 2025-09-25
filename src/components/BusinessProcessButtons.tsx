import React, { useState } from 'react'
import { Play, AlertCircle, CheckCircle } from 'lucide-react'

interface BusinessProcessButtonsProps {
  entityCode: string
  entityType: string
  entityClass: string
  onProcessStart: (processCode: string) => Promise<void>
}

const BusinessProcessButtons: React.FC<BusinessProcessButtonsProps> = ({
  entityCode,
  entityType,
  entityClass,
  onProcessStart
}) => {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock process definitions based on entity type
  const getAvailableProcesses = () => {
    switch (entityType) {
      case 'new_customer':
        return [
          {
            name: 'New Customer',
            title: 'Start Creating Customer',
            class: 'btn btn-primary',
            bp_code: 'new_customer',
            fa_class: ['fas', 'user']
          }
        ]
      case 'support_request':
        return [
          {
            name: 'Support Request',
            title: 'Fill Support Request',
            class: 'btn btn-warning',
            bp_code: 'support_request',
            fa_class: ['fas', 'headset']
          }
        ]
      case 'relocate_customer':
        return [
          {
            name: 'Relocate Customer',
            title: 'Start Relocating Customer',
            class: 'btn btn-secondary',
            bp_code: 'relocate_customer',
            fa_class: ['fas', 'truck']
          }
        ]
      case 'vacation_request':
        return [
          {
            name: 'Vacation Request',
            title: 'Fill Vacation Request',
            class: 'btn btn-success',
            bp_code: 'vacation_request',
            fa_class: ['fas', 'calendar']
          }
        ]
      default:
        return []
    }
  }

  const handleProcessStart = async (processCode: string) => {
    try {
      setIsLoading(processCode)
      setError(null)
      await onProcessStart(processCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start process')
    } finally {
      setIsLoading(null)
    }
  }

  const processes = getAvailableProcesses()

  if (processes.length === 0) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="text-center py-4">
            <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              No business processes available to start.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">Business Processes</h3>
        <p className="text-sm text-gray-600">Available actions for this {entityClass}</p>
      </div>
      <div className="card-content">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {processes.map((process) => (
            <button
              key={process.bp_code}
              onClick={() => handleProcessStart(process.bp_code)}
              disabled={isLoading === process.bp_code}
              className={`${process.class} ${isLoading === process.bp_code ? 'opacity-50' : ''}`}
              title={process.title}
            >
              {isLoading === process.bp_code ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Starting...
                </div>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {process.name}
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BusinessProcessButtons