import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Drawer, Typography, Button, Divider } from 'antd';
import { UserOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchProfile } from '../features/auth/authAction';
import { setUser } from '../features/auth/authSlice';
import ChatInterface from '../pages/User/ChatInterface';


const { Title, Text } = Typography;

const UserLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  
  // Get profile data from Redux store
  const { profileData, profileLoading } = useSelector(state => state.auth.profile);
  const user = profileData?.user || null;

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    dispatch(setUser({ token: null, role: null }));
    console.log('User logged out');
    // Redirect to login page after logout
    navigate('/login', { replace: true }, (navigated) => {
      if (navigated) console.log('Successfully navigated to login');
      else console.warn('Failed to navigate to login');
    });
  };
  
  const toggleProfileDrawer = () => {
    setProfileDrawerOpen(!profileDrawerOpen);
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 right-4 z-10">
        {!profileLoading && (
          <Avatar 
            className="cursor-pointer bg-blue-500 flex items-center justify-center hover:opacity-80 transition-opacity" 
            icon={<UserOutlined />} 
            src={user?.user_picture}
            onClick={toggleProfileDrawer}
          />
        )}
      </div>
      <ChatInterface/>

      {/* Profile Drawer */}
      <Drawer
        title="Profile"
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
        {user && (
          <>

            <div className="flex flex-col items-center mb-6">
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                src={user.user_picture}
                className="mb-4"
              />
              <Title level={4} className="mb-0">{user.user_name}</Title>
              <Text className="text-gray-500">{user.user_email}</Text>
            </div>
            
            <Divider />
            
            <div className="mb-4">
              <Text strong className="block text-gray-600">Email</Text>
              <Text>{user.user_email}</Text>
            </div>
            
            <div className="mb-4">
              <Text strong className="block text-gray-600">User ID</Text>
              <Text className="text-xs break-all">{user.user_id}</Text>
            </div>
            
            <div className="mb-4">
              <Text strong className="block text-gray-600">Roles</Text>
              <div className="flex gap-2 flex-wrap">
                {user.roles.map(role => (
                  <div key={role} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                    {role}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <Text strong className="block text-gray-600">Created At</Text>
              <Text>{new Date(user.created_at).toLocaleDateString()}</Text>
            </div>
            
            <Divider />
            
            
          </>
        )}
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