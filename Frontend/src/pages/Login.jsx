import React, { useState } from "react";
import './AuthPages.css';
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../utils/toast";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please provide email and password");
    setLoading(true);
    try {
      await login(email, password, redirectTo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container page-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        Don't have an account? <Link to="/signup">Create one</Link>
      </div>
    </div>
  );
};

export default Login;