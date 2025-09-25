import React, { useState } from 'react'
import { Plus, X, Calendar } from 'lucide-react'

interface CustomFieldFilterProps {
  orderType: any
  onFilterChange: (filters: Record<string, any>) => void
}

const CustomFieldFilter: React.FC<CustomFieldFilterProps> = ({ orderType, onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [selectedField, setSelectedField] = useState('')

  const addFilter = () => {
    if (!selectedField || activeFilters[selectedField]) return

    const fieldDef = orderType.fields[selectedField]
    const newFilter = {
      type: fieldDef.type,
      label: fieldDef.label,
      value: fieldDef.type === 'datetime' ? { from: '', to: '' } : ''
    }

    const newFilters = { ...activeFilters, [selectedField]: newFilter }
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
    setSelectedField('')
  }

  const removeFilter = (fieldName: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[fieldName]
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const updateFilterValue = (fieldName: string, value: any) => {
    const newFilters = {
      ...activeFilters,
      [fieldName]: { ...activeFilters[fieldName], value }
    }
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const renderFilterInput = (fieldName: string, filter: any) => {
    switch (filter.type) {
      case 'string':
        return (
          <input
            type="text"
            className="form-input"
            value={filter.value}
            onChange={(e) => updateFilterValue(fieldName, e.target.value)}
            placeholder={`Filter by ${filter.label}`}
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            className="form-input"
            value={filter.value}
            onChange={(e) => updateFilterValue(fieldName, e.target.valueAsNumber || '')}
            placeholder={`Filter by ${filter.label}`}
          />
        )
      
      case 'boolean':
        return (
          <select
            className="form-input"
            value={filter.value}
            onChange={(e) => updateFilterValue(fieldName, e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        )
      
      case 'datetime':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">From</label>
              <input
                type="datetime-local"
                className="form-input"
                value={filter.value.from}
                onChange={(e) => updateFilterValue(fieldName, { ...filter.value, from: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">To</label>
              <input
                type="datetime-local"
                className="form-input"
                value={filter.value.to}
                onChange={(e) => updateFilterValue(fieldName, { ...filter.value, to: e.target.value })}
              />
            </div>
          </div>
        )
      
      default:
        return (
          <input
            type="text"
            className="form-input"
            value={filter.value}
            onChange={(e) => updateFilterValue(fieldName, e.target.value)}
            placeholder={`Filter by ${filter.label}`}
          />
        )
    }
  }

  if (!orderType) return null

  const availableFields = Object.entries(orderType.fields).filter(
    ([fieldName]) => !activeFilters[fieldName]
  )

  return (
    <div className="space-y-4">
      {/* Add Filter */}
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <label className="form-label">Add Custom Field Filter</label>
          <select
            className="form-input mt-1"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option value="">Select field...</option>
            {availableFields.map(([fieldName, fieldDef]) => (
              <option key={fieldName} value={fieldName}>
                {fieldDef.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={addFilter}
          disabled={!selectedField}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Active Filters */}
      {Object.entries(activeFilters).map(([fieldName, filter]) => (
        <div key={fieldName} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="form-label">{filter.label}</label>
            <button
              onClick={() => removeFilter(fieldName)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {renderFilterInput(fieldName, filter)}
        </div>
      ))}
    </div>
  )
}

export default CustomFieldFilter