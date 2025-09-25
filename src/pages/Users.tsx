import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, Key, Shield } from 'lucide-react'
import { User } from '../types'

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddUser, setShowAddUser] = useState(false)

  // Mock data - in a real app, this would come from an API
  const users: User[] = [
    {
      id: 1,
      email: 'john.doe@example.com',
      name: 'John',
      lastName: 'Doe',
      middleName: 'Michael',
      company: 'Example Corp',
      department: 'IT',
      role: 'admin',
      blocked: false,
      external: false,
      apiToken: 'abc123...',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      email: 'jane.smith@example.com',
      name: 'Jane',
      lastName: 'Smith',
      company: 'Example Corp',
      department: 'Sales',
      role: 'user',
      blocked: false,
      external: false,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 3,
      email: 'bob.johnson@example.com',
      name: 'Bob',
      lastName: 'Johnson',
      company: 'Partner Corp',
      department: 'Support',
      role: 'vip',
      blocked: false,
      external: true,
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    }
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'vip': return 'bg-purple-100 text-purple-800'
      case 'user': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage system users and their permissions
          </p>
        </div>
        <button 
          onClick={() => setShowAddUser(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-content">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="card">
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Name</th>
                  <th className="table-head">Email</th>
                  <th className="table-head">Role</th>
                  <th className="table-head">Company</th>
                  <th className="table-head">Department</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">API Token</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">
                        {user.name} {user.lastName}
                      </div>
                      {user.middleName && (
                        <div className="text-sm text-gray-500">{user.middleName}</div>
                      )}
                    </td>
                    <td className="table-cell text-gray-600">{user.email}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell text-gray-600">{user.company}</td>
                    <td className="table-cell text-gray-600">{user.department}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {user.blocked && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Blocked
                          </span>
                        )}
                        {user.external && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            External
                          </span>
                        )}
                        {!user.blocked && !user.external && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      {user.apiToken ? (
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-gray-500">Active</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-500">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-primary-600 hover:text-primary-500">
                          <Key className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowAddUser(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-input mt-1" />
                    </div>
                    <div>
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-input mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Company</label>
                      <input type="text" className="form-input mt-1" />
                    </div>
                    <div>
                      <label className="form-label">Department</label>
                      <input type="text" className="form-input mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <select className="form-input mt-1">
                      <option value="user">User</option>
                      <option value="vip">VIP User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Password</label>
                    <input type="password" className="form-input mt-1" />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddUser(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users