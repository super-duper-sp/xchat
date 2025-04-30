import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import { Spin, Typography } from "antd";

const { Text } = Typography;

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Processing login...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get params from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const roleString = urlParams.get('role');

        // Check if we have token and role in URL
        if (token && roleString) {
          setStatus("Authentication successful, redirecting...");
          
          // Parse and decode the role array
          const roleArray = JSON.parse(decodeURIComponent(roleString));
          
          // Store in localStorage
          localStorage.setItem('user', token); // Using 'user' key to match your other components
          localStorage.setItem('role', JSON.stringify(roleArray));
          
          // Update Redux state
          dispatch(setUser({ token, role: roleArray }));
          
          // Navigate based on role
          if (roleArray.some(role => role.toLowerCase() === 'admin')) {
            navigate('/admin', { replace: true });
          } else {
            navigate('/user', { replace: true });
          }
        } else {
          // Check if we have credentials in localStorage as fallback
          const storedToken = localStorage.getItem('user');
          const storedRoles = localStorage.getItem('role');

          if (storedToken && storedRoles) {
            setStatus("Using stored credentials...");
            
            const parsedRoles = JSON.parse(storedRoles);
            
            // Update Redux with stored values
            dispatch(setUser({ token: storedToken, role: parsedRoles }));
            
            // Navigate based on stored role
            if (parsedRoles.some(role => role.toLowerCase() === 'admin')) {
              navigate('/admin', { replace: true });
            } else {
              navigate('/user', { replace: true });
            }
          } else {
            setStatus("Authentication failed, redirecting to login...");
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        setStatus("Authentication error, redirecting to login...");
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Spin size="large" />
      <Text className="mt-4 text-lg">{status}</Text>
    </div>
  );
};

export default GoogleCallback;