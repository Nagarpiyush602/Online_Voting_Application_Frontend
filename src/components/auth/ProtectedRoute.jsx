import { Navigate } from "react-router-dom";
import { getToken, getUserRole } from "../../utils/auth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = getToken();
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "ADMIN" ? "/admin/dashboard" : "/active-election"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
