import { useEffect, useState } from 'react';
import { Avatar, Drawer, Typography, Button, Divider } from 'antd';
import { UserOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import ChatInterface from '../pages/User/ChatInterface'; // Or replace with a dummy div if ChatInterface doesn't exist yet
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../features/auth/authAction';

const { Title, Text } = Typography;



const UserLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const profile = useSelector((state)=>(state.auth.profile?.profileData?.user));
  console.log("profile",profile)

  const roles = localStorage.getItem('roles')

  useEffect(()=>{
    dispatch(fetchProfile());
  },[dispatch])

  const dummyUser = {
    user_picture: profile?.user_picture,
    user_name: profile?.user_name,
    user_email: profile?.user_name,
    user_id: profile?.user_id,
    roles: profile?.roles,
    created_at: profile?.created_at,
  };


  const toggleProfileDrawer = () => {
    setProfileDrawerOpen(!profileDrawerOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      
      {/* Header with Avatar */}
      <div className="w-full flex justify-end p-4"
      //  bg-white shadow-md z-10"
      >
        <Avatar
          size="large"
          className="cursor-pointer bg-blue-500"
          icon={<UserOutlined />}
          src={dummyUser.user_picture}
          onClick={toggleProfileDrawer}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4">
        <ChatInterface />
        {/* Or just use: <div>Chat content goes here...</div> */}
      </main>

      {/* Sidebar / Profile Drawer */}
      <Drawer
        title="User Profile"
        placement="right"
        onClose={toggleProfileDrawer}
        open={profileDrawerOpen}
        width={320}
        closeIcon={<CloseOutlined />}
        footer={
          <div className="flex justify-end">
            <Button onClick={toggleProfileDrawer}>Close</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center mb-6">
          <Avatar
            size={80}
            icon={<UserOutlined />}
            src={dummyUser.user_picture}
            className="mb-4"
          />
          <Title level={4} className="mb-0">{dummyUser.user_name}</Title>
          <Text className="text-gray-500">{dummyUser.user_email}</Text>
        </div>

        <Divider />

        <div className="mb-4">
          <Text strong className="block text-gray-600">Email</Text>
          <Text>{dummyUser.user_email}</Text>
        </div>

        <div className="mb-4">
          <Text strong className="block text-gray-600">User ID</Text>
          <Text className="text-xs break-all">{dummyUser.user_id}</Text>
        </div>

        <div className="mb-4">
          <Text strong className="block text-gray-600">Roles</Text>
          <div className="flex gap-2 flex-wrap">
            {dummyUser.roles?.map(role => (
              <div key={role} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                {role}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <Text strong className="block text-gray-600">Created At</Text>
          <Text>{new Date(dummyUser.created_at).toLocaleDateString()}</Text>
        </div>

        <Divider />

        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="w-full"
        >
          Logout
        </Button>
      </Drawer>
    </div>
  );
};

export default UserLayout;