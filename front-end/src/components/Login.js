import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const { user, error, login, loading } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.is_superuser) {
        navigate('/dashboard/admin');
      } else if (!user.is_approved) {
        setPending(true);
      } else if (user.role === 'student') {
        navigate('/dashboard/students');
      } else if (user.role === 'teacher') {
        navigate('/dashboard/teachers');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(false);
    const result = await login(username, password);
    if (!result.success) {
      // error is handled by context
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pending && <p style={{ color: 'orange' }}>Your account is pending admin approval. Please wait.</p>}
      <p style={{ marginTop: 20 }}>
        Don&apos;t have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login; 