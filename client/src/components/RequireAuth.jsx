import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  } catch {
    return null;
  }
}

function RequireAuth({ children }) {
  const [user, setUser] = useState(readUser);
  const [wasAuthenticated, setWasAuthenticated] = useState(Boolean(user));

  useEffect(() => {
    const syncUser = () => {
      const next = readUser();
      if (next) setWasAuthenticated(true);
      setUser(next);
    };

    window.addEventListener("auth-user-updated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("auth-user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  if (!user) {
    return <Navigate to={wasAuthenticated ? "/" : "/login"} replace />;
  }

  return children;
}

export default RequireAuth;
