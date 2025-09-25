import React, { useState } from 'react'
import { Settings, Eye, EyeOff } from 'lucide-react'

interface ProfileManagerProps {
  orderTypeId: number
  userId: number
  fields: Record<string, any>
  onSave: (profileData: any) => void
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ 
  orderTypeId, 
  userId, 
  fields, 
  onSave 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [columnSettings, setColumnSettings] = useState<Record<string, boolean>>(() => {
    const defaultSettings: Record<string, boolean> = {}
    Object.keys(fields).forEach(field => {
      defaultSettings[field] = true
    })
    return defaultSettings
  })

  const handleToggleColumn = (fieldName: string) => {
    setColumnSettings(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const handleSave = () => {
    const profileData = {
      user_id: userId,
      order_type_id: orderTypeId,
      data: Object.entries(columnSettings).reduce((acc, [field, show]) => {
        acc[field] = {
          ...fields[field],
          show
        }
        return acc
      }, {} as Record<string, any>)
    }
    onSave(profileData)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary text-sm"
      >
        <Settings className="h-4 w-4 mr-1" />
        Display Fields
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Column Settings</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(fields).map(([fieldName, fieldDef]) => (
                <label key={fieldName} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={columnSettings[fieldName]}
                    onChange={() => handleToggleColumn(fieldName)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{fieldDef.label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileManager