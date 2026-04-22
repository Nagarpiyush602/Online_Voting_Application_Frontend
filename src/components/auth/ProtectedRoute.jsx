import { Navigate } from "react-router-dom";
import { getToken, getUserRole } from "../../utils/auth";
import AccessDeniedPage from "../../pages/AccessDeniedPage";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = getToken();
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <AccessDeniedPage />;
  }

  return children;
};

export default ProtectedRoute;
