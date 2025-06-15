// src/features/auth/authAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { post , get } from "../../service/axiosService";


// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await post("auth/login", userData);
      console.log("dataa",data)
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await post("auth/signup", userData);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Google Auth Login (redirect to Google login page)
export const googleAuthLogin = createAsyncThunk(
  "auth/googleAuthLogin",
  async (_, { rejectWithValue }) => {
    try {
      // Just redirect the user to Google auth
      window.location.href = "http://localhost:8000/auth/";
    } catch (error) {
      return rejectWithValue("Failed to initiate Google login");
    }
  }
);

// Google Auth Callback (handle after Google login)
export const googleAuthCallback = createAsyncThunk(
  "auth/googleAuthCallback",
  async (queryParams, { rejectWithValue }) => {
    try {
      const data = await get(`http://localhost:8000/auth/google/callback${queryParams}`);
      const { token } = data;

      if (token) {
        localStorage.setItem('token', token); // ✅ Save token locally
        return token; // ✅ return only the token
      } else {
        return rejectWithValue('No token received from Google login');
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch Profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await get('user/profile');
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);