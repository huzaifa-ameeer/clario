import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  };

  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;
