import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";

const AUTH_STORAGE_KEY = "nnc_auth";

const AuthContext = createContext(null);

const readStoredAuth = () => {
  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : { token: "", user: null };
  } catch {
    return { token: "", user: null };
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedAuth = readStoredAuth();

    if (storedAuth.token) {
      setAuthToken(storedAuth.token);
      setToken(storedAuth.token);
      setUser(storedAuth.user || null);
      api
        .get("/auth/me")
        .then((response) => {
          const nextUser = response.data.data;
          setUser(nextUser);
          window.localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ token: storedAuth.token, user: nextUser })
          );
        })
        .catch(() => {
          setAuthToken("");
          setToken("");
          setUser(null);
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
        })
        .finally(() => setIsReady(true));

      return;
    }

    setIsReady(true);
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const nextToken = response.data.data.token;
    const nextUser = response.data.data.user;

    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser })
    );

    return nextUser;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    const nextToken = response.data.data.token;
    const nextUser = response.data.data.user;

    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser })
    );

    return nextUser;
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/auth/logout");
      }
    } catch {
      // Ignore logout API errors and clear local session anyway.
    } finally {
      setAuthToken("");
      setToken("");
      setUser(null);
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        isReady,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
