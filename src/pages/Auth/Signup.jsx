import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authAction';
import { Button, Input, Form, Typography, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;


const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { role } = useSelector((state) => state.auth.currentLoggedUser);

 
  const handleSignup = async (values) => {
    const payload = {
      user_name: values.user_name,
      user_email: values.user_email,
      password: values.password,
      roles: [values.role],
    };

    await dispatch(registerUser(payload))
      .then((response) => {
        console.log("Register Response:", response?.payload?.message);
        message.success(response?.payload?.message || 'Registration successful!', 3); // 3 seconds popup
        form.resetFields()

      })
      .catch((error) => {
        console.log("Register Error:", error);
        message.error(error.message || 'Registration failed!', 3);
      });
  };

  useEffect(() => {
    message.success("This is a test success message!", 3);
  }, []); // This will show a toast as soon as the component renders

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:8000/auth/';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <Title level={2} className="text-center mb-6">Sign Up</Title>
        <Form form={form} layout="vertical" onFinish={handleSignup}>
          <Form.Item name="user_name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="user_email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select defaultValue="User">
              <Select.Option value="User">User</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Register</Button>
          </Form.Item>
        </Form>

        <div className="text-center my-4">
          <Button type="default" onClick={handleGoogleSignup} block>
            Sign Up with Google
          </Button>
        </div>

        <div className="text-center mt-4">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;