// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return setError('All fields are required.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      // 🔐 Special Shankar Login
      if (email === 'shankar13052005@gmail.com' && password === '123456') {
        const mockUser = {
          name: 'Shankar Admin',
          email: 'shankar13052005@gmail.com',
          role: 'admin',
          patientId: 'PID-SUPER',
          phone: '+91 9876543210',
          dob: '2005-05-13',
          gender: 'Male',
          bloodGroup: 'O+',
          address: 'Chennai, India',
          status: 'approved',
        };
        localStorage.setItem('authToken', token || 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        axios.defaults.headers.common['x-auth-token'] = token || 'mock-token';
        navigate('/admin-dashboard');
        return;
      }

      // 🚻 Approval check
      if (user.role !== 'patient' && user.status !== 'approved') {
        return setError('Your account is pending approval.');
      }

      // ✅ Save full user
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['x-auth-token'] = token;

      // Redirect
      switch (user.role) {
        case 'admin': navigate('/admin-dashboard'); break;
        case 'doctor': navigate('/doctor-dashboard'); break;
        case 'staff': navigate('/staff-dashboard'); break;
        case 'patient': navigate('/patient-dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        'Invalid email or password.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          background: linear-gradient(135deg, #d4f0f7, #a0e7ff);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .login-box {
          background: #ffffff;
          padding: 50px 40px;
          border-radius: 18px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 460px;
          text-align: center;
        }
        .login-header {
          font-size: 32px;
          font-weight: 700;
          color: #0077b6;
          margin-bottom: 8px;
        }
        .login-subtitle {
          font-size: 16px;
          color: #444;
          margin-bottom: 30px;
        }
        .error-message {
          background-color: #fbe8e8;
          color: #c80000;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .form-group {
          text-align: left;
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #2d3748;
          font-size: 14px;
        }
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: #0077b6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
        }
        .signup-link {
          text-align: center;
          margin-top: 20px;
          font-size: 15px;
          color: #555;
        }
        .signup-link a {
          color: #0077b6;
          font-weight: 600;
          text-decoration: none;
        }
      `}</style>

      <div className="login-box">
        <h1 className="login-header">🔐 HealthHub Login</h1>
        <p className="login-subtitle">Welcome back! Please log in to continue</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;