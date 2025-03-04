import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    userId: localStorage.getItem("userId"), // Add userId to initial state
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userId = action.payload.userId; // Store userId
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("userId", action.payload.userId); // Persist userId
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.userId = null; // Clear userId
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId"); // Remove userId
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;