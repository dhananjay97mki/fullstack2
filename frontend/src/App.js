import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Router>
      {user && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['normal']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/store-dashboard" element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <StoreOwnerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={
            user ? (
              user.role === 'admin' ? <Navigate to="/admin" /> :
              user.role === 'store_owner' ? <Navigate to="/store-dashboard" /> :
              <Navigate to="/dashboard" />
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/unauthorized" element={
            <div className="text-center">
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
