import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
  user: null,
  isLoading: false,
  isAuthorized: false,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signup", credentials);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Signup failed" }
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials, {
        withCredentials: true,
      });
      sessionStorage.setItem("$INVACCESS", res.data.access);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Login failed" });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/logout", {
        withCredentials: true,
      });

      sessionStorage.removeItem("$INVACCESS");

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Logout failed" }
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forget-pass", credentials);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to send reset link" }
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", credentials);
      sessionStorage.setItem("$INVTEMP", res.data.temp);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "OTP verification failed" }
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (credentials, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("$INVTEMP");
      const res = await axiosInstance.patch(
        `/auth/set-pass/${token}`,
        credentials
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Password update failed" }
      );
    }
  }
);

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/refresh", {
        withCredentials: true,
      });
      sessionStorage.setItem("$INVACCESS", res.data.access);
      return res.data;
    } catch (error) {
      sessionStorage.removeItem("$INVACCESS")
      return rejectWithValue(
        error.response?.data || { error: "Account refresh failed" }
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        "/admin/update-profile",
        credentials,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile Update Failed");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthorized = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthorized = !!action.payload.access;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthorized = false;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthorized = !!action.payload.access;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") && action.type.startsWith("auth/"),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") && action.type.startsWith("auth/"),
        (state, action) => {
          state.isLoading = false;
          if (
            action.type === "auth/login/rejected" ||
            action.type === "auth/refresh/rejected"
          ) {
            state.user = null;
            state.isAuthorized = false;
          }
        }
      );
    builder.addMatcher(
      (action) =>
        action.type.endsWith("/fulfilled") && action.type.startsWith("auth/"),
      (state) => {
        state.isLoading = false;
      }
    );
  },
});

export default authSlice.reducer;
