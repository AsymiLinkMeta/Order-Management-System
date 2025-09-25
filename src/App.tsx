import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Users from './pages/Users'
import OrderTypes from './pages/OrderTypes'
import Tasks from './pages/Tasks'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:code" element={<OrderDetail />} />
        <Route path="/users" element={<Users />} />
        <Route path="/order-types" element={<OrderTypes />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Layout>
  )
}

export default App