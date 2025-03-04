import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  if (!token) {
    return <Navigate to="/" replace />;  // Redirect to home if not logged in
  }
  return role === "user" ? children : <Navigate to="/" replace />;
};

const ProtectedAdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  if (!token) {
    return <Navigate to="/" replace />;  // Redirect to home if not logged in
  }
  return role === "admin" ? children : <Navigate to="/" replace />;
};
