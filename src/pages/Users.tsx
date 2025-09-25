import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, Key, Shield, AlertCircle } from 'lucide-react'
import { useUsers } from '../hooks/useUsers'
import { useAuth } from '../hooks/useAuth'
import UserForm from '../components/UserForm'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'

const Users: React.FC = () => {
  const { user: currentUser } = useAuth()
  const { users, isLoading, error, createUser, updateUser, deleteUser, generateApiToken, clearApiToken } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [deletingUser, setDeletingUser] = useState<any>(null)
  const [tokenAction, setTokenAction] = useState<{ user: any; action: 'generate' | 'clear' } | null>(null)

  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData)
      setShowAddUser(false)
    } catch (err) {
      console.error('Failed to create user:', err)
    }
  }

  const handleUpdateUser = async (userData: any) => {
    try {
      await updateUser(editingUser.id, userData)
      setEditingUser(null)
    } catch (err) {
      console.error('Failed to update user:', err)
    }
  }

  const handleDeleteUser = async () => {
    try {
      await deleteUser(deletingUser.id)
      setDeletingUser(null)
    } catch (err) {
      console.error('Failed to delete user:', err)
    }
  }

  const handleTokenAction = async () => {
    try {
      if (tokenAction?.action === 'generate') {
        await generateApiToken(tokenAction.user.id)
      } else if (tokenAction?.action === 'clear') {
        await clearApiToken(tokenAction.user.id)
      }
      setTokenAction(null)
    } catch (err) {
      console.error('Failed to manage API token:', err)
    }
  }

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

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_: any, user: any) => (
        <div>
          <div className="font-medium text-gray-900">
            {user.name} {user.lastName}
          </div>
          {user.middleName && (
            <div className="text-sm text-gray-500">{user.middleName}</div>
          )}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (role: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      )
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, user: any) => (
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
      )
    },
    {
      key: 'apiToken',
      label: 'API Token',
      render: (apiToken: string) => (
        apiToken ? (
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">None</span>
        )
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, user: any) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setEditingUser(user)}
            className="text-primary-600 hover:text-primary-500"
            title="Edit user"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setTokenAction({ user, action: user.apiToken ? 'clear' : 'generate' })}
            className="text-primary-600 hover:text-primary-500"
            title={user.apiToken ? 'Clear API token' : 'Generate API token'}
          >
            <Key className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setDeletingUser(user)}
            className="text-red-600 hover:text-red-500"
            title="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading users</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

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
          <DataTable
            data={filteredUsers}
            columns={columns}
            searchable={false}
            emptyMessage="No users found"
          />
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowAddUser(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <UserForm
                  onSubmit={handleCreateUser}
                  onCancel={() => setShowAddUser(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setEditingUser(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <UserForm
                  user={editingUser}
                  onSubmit={handleUpdateUser}
                  onCancel={() => setEditingUser(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        title="Delete User"
        message={`Are you sure you want to delete ${deletingUser?.name} ${deletingUser?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeletingUser(null)}
      />

      {/* API Token Confirmation */}
      <ConfirmDialog
        isOpen={!!tokenAction}
        title={tokenAction?.action === 'generate' ? 'Generate API Token' : 'Clear API Token'}
        message={
          tokenAction?.action === 'generate'
            ? `Generate a new API token for ${tokenAction?.user?.name}? This will replace any existing token.`
            : `Clear the API token for ${tokenAction?.user?.name}? This will revoke access for API clients.`
        }
        confirmText={tokenAction?.action === 'generate' ? 'Generate' : 'Clear'}
        cancelText="Cancel"
        type={tokenAction?.action === 'clear' ? 'danger' : 'warning'}
        onConfirm={handleTokenAction}
        onCancel={() => setTokenAction(null)}
      />
    </div>
  )
}

export default Users