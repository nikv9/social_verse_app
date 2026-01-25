import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ auth, role, children }) => {
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
