import React from "react";
import { Card, Tabs, Row, Col, Statistic, Tooltip } from "antd";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  DashboardOutlined, UserOutlined, MessageOutlined, 
  DollarOutlined, PercentageOutlined, FileOutlined, PieChartOutlined 
} from "@ant-design/icons";
import UserTable from "./UserTable"; // Assuming the converted component from the previous example

// Sample data - In a real app, this would come from your backend
const messageData = [
  { time: "00:00", messages: 23 },
  { time: "04:00", messages: 15 },
  { time: "08:00", messages: 45 },
  { time: "12:00", messages: 68 },
  { time: "16:00", messages: 72 },
  { time: "20:00", messages: 55 },
];

const userActivityData = [
  { day: "Mon", users: 120 },
  { day: "Tue", users: 150 },
  { day: "Wed", users: 180 },
  { day: "Thu", users: 190 },
  { day: "Fri", users: 160 },
  { day: "Sat", users: 140 },
  { day: "Sun", users: 130 },
];

// New data for revenue analytics
const revenueData = [
  { month: "Jan", revenue: 12500, expenses: 7800, profit: 4700 },
  { month: "Feb", revenue: 14200, expenses: 8100, profit: 6100 },
  { month: "Mar", revenue: 15800, expenses: 8300, profit: 7500 },
  { month: "Apr", revenue: 16900, expenses: 8600, profit: 8300 },
  { month: "May", revenue: 17500, expenses: 8900, profit: 8600 },
  { month: "Jun", revenue: 19200, expenses: 9200, profit: 10000 },
];

const subscriptionData = [
  { name: "Free Plan", value: 1450 },
  { name: "Basic Plan", value: 850 },
  { name: "Pro Plan", value: 430 },
  { name: "Enterprise", value: 123 },
];

const churnData = [
  { month: "Jan", rate: 3.2 },
  { month: "Feb", rate: 2.8 },
  { month: "Mar", rate: 3.1 },
  { month: "Apr", rate: 2.6 },
  { month: "May", rate: 2.4 },
  { month: "Jun", rate: 2.2 },
];

const customerAcquisitionData = [
  { month: "Jan", organic: 85, paid: 45, referral: 32 },
  { month: "Feb", organic: 92, paid: 55, referral: 39 },
  { month: "Mar", organic: 105, paid: 62, referral: 41 },
  { month: "Apr", organic: 120, paid: 75, referral: 48 },
  { month: "May", organic: 132, paid: 80, referral: 52 },
  { month: "Jun", organic: 145, paid: 95, referral: 61 },
];

const genderDistribution = [
  { name: "Female", value: 45 },
  { name: "Male", value: 42 },
  { name: "Other", value: 13 },
];

const locationData = [
  { country: "United States", users: 1250 },
  { country: "United Kingdom", users: 850 },
  { country: "Canada", users: 620 },
  { country: "Australia", users: 450 },
  { country: "Germany", users: 380 },
  { country: "Others", users: 720 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const totalRevenue = revenueData.reduce((total, item) => total + item.revenue, 0);
  const avgRevenuePerUser = Math.round(totalRevenue / 2853); // Using the total user count
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium text-gray-700">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value instanceof Object ? JSON.stringify(entry.value) : entry.value}
              {entry.dataKey === 'rate' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <DashboardOutlined className="text-2xl" />
        SaaS Analytics Dashboard
      </h1>
      
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="h-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Users</p>
              <UserOutlined className="text-lg text-gray-400" />
            </div>
            <Statistic value={2853} />
            <p className="text-xs text-green-600">+12% from last month</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="h-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Messages Today</p>
              <MessageOutlined className="text-lg text-gray-400" />
            </div>
            <Statistic value={1247} />
            <p className="text-xs text-gray-500">+4% from yesterday</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="h-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <DollarOutlined className="text-lg text-gray-400" />
            </div>
            <Statistic value={(revenueData[5].revenue / 1000).toFixed(1)} prefix="$" suffix="k" />
            <p className="text-xs text-green-600">+8.9% from last month</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="h-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <PercentageOutlined className="text-lg text-gray-400" />
            </div>
            <Statistic value={5.8} suffix="%" precision={1} />
            <p className="text-xs text-green-600">+0.6% from last month</p>
          </Card>
        </Col>
      </Row>
      
      <Tabs
        defaultActiveKey="revenue"
        className="mb-6"
        items={[
          {
            key: 'revenue',
            label: 'Revenue',
            children: (
              <div className="space-y-6">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card 
                      title={
                        <div className="flex items-center gap-2">
                          <FileOutlined />
                          <span>Revenue Overview</span>
                        </div>
                      }
                      bordered={false}
                    >
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={revenueData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke="#8884d8" 
                              name="Revenue"
                              strokeWidth={2}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="profit" 
                              stroke="#82ca9d" 
                              name="Profit"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card 
                      title={
                        <div className="flex items-center gap-2">
                          <PieChartOutlined />
                          <span>Subscription Distribution</span>
                        </div>
                      }
                      bordered={false}
                    >
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={subscriptionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {subscriptionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Key Revenue Metrics" bordered={false}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
                            <p className="text-2xl font-bold">${(revenueData[5].revenue / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-green-600">+8.9% growth</p>
                          </div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Avg. Revenue Per User</p>
                            <p className="text-2xl font-bold">${avgRevenuePerUser}</p>
                            <p className="text-xs text-green-600">+5.2% growth</p>
                          </div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Customer Lifetime Value</p>
                            <p className="text-2xl font-bold">$1,240</p>
                            <p className="text-xs text-green-600">+3.7% growth</p>
                          </div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Customer Acquisition Cost</p>
                            <p className="text-2xl font-bold">$125</p>
                            <p className="text-xs text-red-600">-2.5% lower</p>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Monthly Churn Rate" bordered={false}>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={churnData}>
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => `${value}%`} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Bar dataKey="rate" fill="#FF6B6B" name="Churn Rate" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: 'users',
            label: 'User Engagement',
            children: (
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title="Message Activity" bordered={false}>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={messageData}>
                          <XAxis dataKey="time" />
                          <YAxis />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="messages" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="User Activity by Day" bordered={false}>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userActivityData}>
                          <XAxis dataKey="day" />
                          <YAxis />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Bar dataKey="users" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'acquisition',
            label: 'Customer Acquisition',
            children: (
              <Card title="Customer Acquisition Channels" bordered={false}>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerAcquisitionData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="organic" stackId="a" fill="#8884d8" name="Organic" />
                      <Bar dataKey="paid" stackId="a" fill="#82ca9d" name="Paid" />
                      <Bar dataKey="referral" stackId="a" fill="#ffc658" name="Referral" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ),
          },
          {
            key: 'demographics',
            label: 'Demographics',
            children: (
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title="Gender Distribution" bordered={false}>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, value}) => `${name}: ${value}%`}
                          >
                            {genderDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Geographical Distribution" bordered={false}>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={locationData}>
                          <XAxis dataKey="country" />
                          <YAxis />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Bar dataKey="users" fill="#8884d8" name="Users" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />
      
      
    </div>
  );
};

export default AdminDashboard;