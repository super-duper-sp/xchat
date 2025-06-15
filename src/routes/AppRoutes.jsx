import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useSelector } from 'react-redux';
import UserLayout from '../layouts/UserLayout';
import Login from '../pages/Auth/Login';
import GoogleCallback from '../pages/Auth/GoogleCallback';
import ChatInterface from '../pages/User/ChatInterface';
import NotFound from '../pages/Others/NotFound';
import Signup from '../pages/Auth/Signup';

const AppRoutes = () => {
  const roleFromLocalStorage = JSON.parse(localStorage.getItem('role'));

  
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
        <Route path="/google-callback" element={<GoogleCallback />} />

       
        {/* User routes */}
   
          <Route path="/" element={<UserLayout />}>
            <Route index element={<ChatInterface />} />
          </Route>


        {/* Catch-all for unknown paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfigProvider>
  );
};

export default AppRoutes;