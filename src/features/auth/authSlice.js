// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, googleAuthLogin, googleAuthCallback, fetchProfile } from "./authAction";

const initialState = {

  currentLoggedUser :
  {  token: null,
    role: null
  },


  user: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",

  profile: {
    profileData: null,
    profileLoading: false,
    profileError: null,
  }

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log('Inside reducer, received:', action.payload);
      state.currentLoggedUser.token = action.payload.token;
      state.currentLoggedUser.role = action.payload.role;
    },
    logoutUser(state) {
      state.token = null;
      state.role = null;
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed";
      })


      // Google Callback
      .addCase(googleAuthCallback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleAuthCallback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(googleAuthCallback.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Google login failed";
      })

       // FETCH PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.profile.profileLoading = true;
        state.profile.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile.profileLoading = false;
        state.profile.profileData = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profile.profileLoading = false;
        state.profile.profileError = action.payload;
      });

  },
});

export const { logout, resetAuthState , setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;