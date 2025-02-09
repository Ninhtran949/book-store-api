import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    address: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginForm.username, loginForm.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(
        signupForm.name,
        signupForm.phone,
        signupForm.address,
        signupForm.password
      );
      setIsLogin(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <div className="auth-form-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Phone Number"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            />
            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
          </form>
          <p className="toggle" onClick={() => setIsLogin(false)}>
            Don't have an account? Sign Up
          </p>
        </div>
      ) : (
        <div className="auth-form-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              value={signupForm.name}
              onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={signupForm.phone}
              onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
            />
            <input
              type="text"
              placeholder="Address"
              value={signupForm.address}
              onChange={(e) => setSignupForm({...signupForm, address: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
            />
            <button type="submit">Sign Up</button>
            {error && <p className="error">{error}</p>}
          </form>
          <p className="toggle" onClick={() => setIsLogin(true)}>
            Already have an account? Login
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;