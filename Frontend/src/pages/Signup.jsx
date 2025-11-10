import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import { useLocation } from 'react-router-dom';
import './AuthPages.css';

const Signup = () => {
  const { register } = useAuth();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error('Please fill all fields');
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register(name, email, password, location.state?.from?.pathname || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container page-container">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </label>

        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>

        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </label>

        <label>
          <span>Confirm</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" />
        </label>

        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
      </form>
    </div>
  );
};

export default Signup;