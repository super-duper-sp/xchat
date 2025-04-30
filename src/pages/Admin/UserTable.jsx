import React from "react";
import { Table, Avatar, Button, Tag, Space, Tooltip } from "antd";
import { 
  UserOutlined, 
  StopOutlined, 
  DollarOutlined, 
  EnvironmentOutlined, 
  SettingOutlined
} from "@ant-design/icons";

// Sample data - In a real app, this would come from your backend
const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "active",
    role: "admin",
    lastActive: "2 hours ago",
    messageCount: 145,
    responseRate: "95%",
    joinedDate: "Jan 15, 2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    plan: "Enterprise",
    totalSpent: "$1,450",
    lastPayment: "Apr 18, 2025",
    gender: "female",
    location: "New York, USA",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    status: "banned",
    role: "user",
    lastActive: "5 days ago",
    messageCount: 89,
    responseRate: "78%",
    joinedDate: "Mar 1, 2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    plan: "Basic",
    totalSpent: "$245",
    lastPayment: "Mar 28, 2025",
    gender: "male",
    location: "London, UK",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    status: "active",
    role: "moderator",
    lastActive: "Just now",
    messageCount: 256,
    responseRate: "92%",
    joinedDate: "Feb 10, 2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    plan: "Pro",
    totalSpent: "$780",
    lastPayment: "Apr 20, 2025",
    gender: "female",
    location: "Toronto, Canada",
  },
];

const UserTable = () => {
  const toggleUserBan = (userId) => {
    console.log(`Toggling ban for user ${userId}`);
  };

  const getRoleTag = (role) => {
    const colorMap = {
      admin: "blue",
      moderator: "purple",
      user: "default"
    };
    
    return <Tag color={colorMap[role]}>{role}</Tag>;
  };

  const getPlanTag = (plan) => {
    const colorMap = {
      "Free": "default",
      "Basic": "blue",
      "Pro": "purple",
      "Enterprise": "gold"
    };
    
    return <Tag color={colorMap[plan]}>{plan}</Tag>;
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />} 
            size="large"
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
            <div className="text-xs text-gray-400">{record.gender}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: (_, record) => getRoleTag(record.role),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag 
          icon={record.status === "active" ? <SettingOutlined /> : <StopOutlined />}
          color={record.status === "active" ? "success" : "error"}
          className="flex items-center gap-1"
        >
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <EnvironmentOutlined className="text-gray-500" />
          <span className="text-sm">{record.location}</span>
        </div>
      ),
    },
    {
      title: 'Subscription',
      key: 'subscription',
      render: (_, record) => getPlanTag(record.plan),
    },
    {
      title: 'Revenue',
      key: 'revenue',
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <DollarOutlined className="text-green-600" />
          <span>{record.totalSpent}</span>
          <Tooltip title={`Last payment: ${record.lastPayment}`}>
            <span className="text-xs text-gray-500 ml-1">
              Last: {record.lastPayment}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Stats',
      key: 'stats',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-sm">Messages: {record.messageCount}</div>
          <div className="text-sm text-gray-500">
            Response Rate: {record.responseRate}
          </div>
        </div>
      ),
    },
    {
      title: 'Joined',
      key: 'joined',
      dataIndex: 'joinedDate',
      render: (joinedDate) => (
        <span className="text-sm text-gray-500">{joinedDate}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type={record.status === "active" ? "danger" : "default"}
          size="small"
          onClick={() => toggleUserBan(record.id)}
        >
          {record.status === "active" ? "Ban User" : "Unban User"}
        </Button>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        pagination={false}
        className="w-full"
        size="middle"
      />
    </div>
  );
};

export default UserTable;