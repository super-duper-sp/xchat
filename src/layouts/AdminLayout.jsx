import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../features/auth/authAction';

const { Sider, Content, Header } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(()=>{
    dispatch(fetchProfile())
  }, [dispatch])

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider 
        width={240} 
        collapsible 
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="bg-gray-900"
        theme="dark"
      >
        <div className="flex items-center px-4 py-6 text-white">
          <RobotOutlined className="text-xl mr-2" />
          {!collapsed && <span className="text-xl font-semibold">Chatbot Admin</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="bg-gray-900"
        >
          <Menu.Item key="/admin" icon={<DashboardOutlined />}>
            <NavLink to="/admin">Dashboard</NavLink>
          </Menu.Item>
          <Menu.Item key="/admin/user" icon={<UserOutlined />}>
            <NavLink to="/admin/user">Users</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      
      {/* Main Content */}
      <Layout className="bg-gray-100">
        <Header className="px-4 py-0 flex items-center bg-white shadow-sm" style={{ height: 64 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className="mr-auto"
          />
          <div className="flex items-center">
            <span className="mr-4">Admin User</span>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>
        <Content className="p-6 m-5 overflow-y-auto bg-white rounded-lg shadow-sm">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;