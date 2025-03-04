import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./redux/store";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import AgentDashboard from "./components/AgentDashboard"; // Import AgentDashboard
import { logout } from "./redux/authSlice";

// Protected route for user role
const ProtectedUserRoute = ({ children }) => {
  const role = useSelector((state) => state.auth.role);
  return role === "user" ? children : <Navigate to="/" replace />;
};

// Protected route for admin role
const ProtectedAdminRoute = ({ children }) => {
  const role = useSelector((state) => state.auth.role);
  return role === "admin" ? children : <Navigate to="/" replace />;
};

// Protected route for agent role
const ProtectedAgentRoute = ({ children }) => {
  const role = useSelector((state) => state.auth.role);
  return role === "agent" ? children : <Navigate to="/" replace />;
};

// Handle logout
const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Clear auth state in Redux
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("role"); // Remove role from localStorage
  };

  React.useEffect(() => {
    handleLogout(); // Perform logout on component mount
  }, []);

  return <Navigate to="/" replace />; // Redirect to home after logout
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Route for User Role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedUserRoute>
                <Dashboard />
              </ProtectedUserRoute>
            }
          />

          {/* Protected Route for Admin Role */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          {/* Protected Route for Agent Role */}
          <Route
            path="/agent"
            element={
              <ProtectedAgentRoute>
                <AgentDashboard />
              </ProtectedAgentRoute>
            }
          />

          {/* Logout Route */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
