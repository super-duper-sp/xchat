import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useSelector } from 'react-redux';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/SignUp';
import UserTable from '../pages/Admin/UserTable';
import GoogleCallback from '../pages/Auth/GoogleCallback';
import ChatInterface from '../pages/User/ChatInterface';
import NotFound from '../pages/Others/NotFound';

const AppRoutes = () => {
  const roleFromRedux = useSelector((state) => state.auth?.user?.user_roles?.[0]?.toLowerCase());
  const roleFromLocalStorage = JSON.parse(localStorage.getItem('role'))?.[0]?.toLowerCase();
  const role = roleFromRedux || roleFromLocalStorage;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/google-callback" element={<GoogleCallback />} />

        {/* Conditionally render Admin routes */}
        {role === 'admin' ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="user" element={<UserTable />} />
          </Route>
        ) : role === 'user' ? (
          // Conditionally render User routes
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<ChatInterface />} />
          </Route>
        ) : (
          // Redirect if the role is not recognized or user is unauthenticated
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfigProvider>
  );
};

export default AppRoutes;