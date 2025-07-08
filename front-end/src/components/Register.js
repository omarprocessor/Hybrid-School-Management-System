import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    requested_role: 'student',
    gender: 'M'
  });
  const [classrooms, setClassrooms] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch classrooms for dropdown
    fetch(`${API}/classrooms/`)
      .then(res => res.json())
      .then(data => setClassrooms(data))
      .catch(() => setClassrooms([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    // Prepare payload
    const payload = { ...form };
    if (form.requested_role !== 'student') {
      delete payload.gender;
    }
    try {
      const res = await fetch(`${API}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Registration failed');
      setSuccess(true);
      setForm({ username: '', email: '', password: '', requested_role: 'student', gender: 'M' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      {success ? (
        <p style={{ color: 'green' }}>Registration successful! Please wait for admin approval.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <select name="requested_role" value={form.requested_role} onChange={handleChange} required>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {form.requested_role === 'student' && (
            <>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </>
          )}
          <button type="submit">Register</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p style={{ marginTop: 20 }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register; 