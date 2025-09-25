import React, { useState } from 'react'
import { Search, FileText } from 'lucide-react'

interface OrderSearchProps {
  onSearch: (criteria: { field: string; value: string }) => void
}

const OrderSearch: React.FC<OrderSearchProps> = ({ onSearch }) => {
  const [searchField, setSearchField] = useState('code')
  const [searchValue, setSearchValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      onSearch({ field: searchField, value: searchValue.trim() })
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">Search Orders</h3>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Search By</label>
              <select
                className="form-input mt-1"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                <option value="code">Order Code</option>
                <option value="ext_code">External Code</option>
              </select>
            </div>
            <div>
              <label className="form-label">Value</label>
              <input
                type="text"
                className="form-input mt-1"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Enter ${searchField === 'code' ? 'order code' : 'external code'}`}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderSearch