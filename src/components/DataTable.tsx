import React, { useState } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  onRowClick?: (row: any) => void
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  onRowClick
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    
    setSortConfig({ key, direction })
  }

  const getSortedData = () => {
    let sortableData = [...data]
    
    if (sortConfig) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    return sortableData
  }

  const getFilteredData = () => {
    const sortedData = getSortedData()
    
    if (!searchable || !searchTerm) {
      return sortedData
    }
    
    return sortedData.filter(row =>
      columns.some(column => {
        const value = row[column.key]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }

  const filteredData = getFilteredData()

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="table-head">
                  {column.sortable ? (
                    <button
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
                      <span>{column.label}</span>
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className={`table-row ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Search className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">{emptyMessage}</h3>
          {searchTerm && (
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default DataTable