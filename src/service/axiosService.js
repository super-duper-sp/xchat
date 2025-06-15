// src/services/axiosService.js
import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/', // Base URL for your API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the token in every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request
    console.log('Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });

    const token = localStorage.getItem('token') ;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for logging
axiosInstance.interceptors.response.use(
  (response) => {
    // Log the response
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    // Log the error
    console.error('Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Generic request handler for all HTTP methods
const request = async (method, url, data = null) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    // You can handle errors globally here if needed, e.g., redirecting to login on 401
    throw error.response ? error.response.data : error.message;
  }
};

// HTTP methods
const get = (url) => request('get', url);
const post = (url, data) => request('post', url, data);
const put = (url, data) => request('put', url, data);
const del = (url) => request('delete', url);

export { get, post, put, del };