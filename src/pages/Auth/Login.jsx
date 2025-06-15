// src/pages/Auth/Login.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authAction';
import { setUser } from '../../features/auth/authSlice';
import { Button, Input, Form, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = (values) => {
    const payload = {
      user_email: values.user_email,
      password: values.password,
    };

    dispatch(loginUser(payload))
      .unwrap()
      .then((response) => {
        if (response.success === "true") {
          const token = response.data.token;
          const user = response.data.user;
          const roleArray = user.user_roles;

          localStorage.setItem('token', token);
          localStorage.setItem('role', JSON.stringify(roleArray));
          navigate('/', { replace: true });
        } else {
          console.error("Login failed:", response.message);
            message.success(response.message)
        }
      })
      .catch((error) => {
        message.error("Login failed. Please check your credentials.");      });
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <Title level={2} className="text-center mb-6">Login</Title>
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item name="user_email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Login</Button>
          </Form.Item>
        </Form>

        <div className="text-center my-4">
          <Button type="default" onClick={handleGoogleLogin} block>
            Login with Google
          </Button>
        </div>

        <div className="text-center mt-4">
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;