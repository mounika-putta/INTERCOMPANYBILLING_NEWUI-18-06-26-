import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser,sendNotificationforForgetPassword  } from '../services/LoginApi';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      debugger;
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Login error');
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await sendNotificationforForgetPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send password reset email." }
      );
    }
  }
);
const initialState = {
  user: sessionStorage.getItem('userName')
    ? {
        name: sessionStorage.getItem('name'),
        userName: sessionStorage.getItem('userName'),
        role: sessionStorage.getItem('roleName'),
        companyId: sessionStorage.getItem('companyId'),
        useremail: sessionStorage.getItem('email'),
        screenList: JSON.parse(sessionStorage.getItem('screenList') || '[]'),
      }
    : null,
  loading: false,
  loginError: null,
  forgotError: null
};

const loginSlice = createSlice({
  name: 'auth',
  initialState, // use the above initialState
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loginError = null;
      sessionStorage.clear(); // clear all stored session
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        
        sessionStorage.setItem('Name', action.payload.name);
        sessionStorage.setItem('userName', action.payload.userName);
        sessionStorage.setItem('roleName', action.payload.role);
        sessionStorage.setItem('loginTime', action.payload.loginTime);
        sessionStorage.setItem('userId', action.payload.userId);
        sessionStorage.setItem('password', action.payload.password);
        sessionStorage.setItem('companyId', action.payload.companyId);
        sessionStorage.setItem('useremail', action.payload.email);
        sessionStorage.setItem('token', action.payload.token);
        sessionStorage.setItem('screenList', JSON.stringify(action.payload.screenList));

      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      });
       builder
      // existing login reducers
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotError = action.payload?.message || "Something went wrong.";
      });
  },
});



export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
