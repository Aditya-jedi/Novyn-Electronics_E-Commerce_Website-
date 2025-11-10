import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";

const AuthContext = createContext();

const AUTH_KEY = "novyn_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setToken(parsed.token || null);
        setUser(parsed.user || null);
      }
    } catch (err) {
      console.warn("Failed to read auth from storage", err);
    }
    setInitialized(true);
  }, []);

  const persist = useCallback((tok, usr) => {
    setToken(tok || null);
    setUser(usr || null);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ token: tok, user: usr }));
    } catch (err) {
      console.warn("Failed to persist auth", err);
    }
  }, []);

  const clear = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (err) {
      void err;
    }
    setInitialized(true);
  }, []);

  // Helper to call backend with Authorization header when available
  const authFetch = useCallback(
    (url, opts = {}) => {
      const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return fetch(url, Object.assign({}, opts, { headers }));
    },
    [token]
  );

  const login = async (email, password, redirectTo = null) => {
    try {
      const res = await fetch(`/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Login failed";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        toast.error(errorMessage);
        return false;
      }

      const data = await res.json();

      // sanitize returned user
      if (data.user && data.user.password) delete data.user.password;

      const usr = Object.assign({}, data.user, { role: data.user?.isAdmin ? "admin" : "user" });
      persist(data.token, usr);
      toast.success("Logged in successfully");
      // honor redirectTo if provided (from ProtectedRoute), otherwise admin or home
      if (redirectTo) navigate(redirectTo);
      else if (usr.role === "admin") navigate("/admin");
      else navigate("/");
      return true;
    } catch (err) {
      console.error("Login error", err);
      toast.error("Login failed. Check console for details.");
      return false;
    }
  };

  const register = async (name, email, password, redirectTo = null) => {
    try {
      const res = await fetch(`/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Registration failed";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        toast.error(errorMessage);
        return false;
      }

      const data = await res.json();

      if (data.user && data.user.password) delete data.user.password;
      const usr = Object.assign({}, data.user, { role: data.user?.isAdmin ? "admin" : "user" });
      persist(data.token, usr);
      toast.success("Account created and logged in");
      if (redirectTo) navigate(redirectTo);
      else navigate("/");
      return true;
    } catch (err) {
      console.error("Register error", err);
      toast.error("Registration failed. Check console for details.");
      return false;
    }
  };

  const logout = () => {
    clear();
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, authFetch, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);