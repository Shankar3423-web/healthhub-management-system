import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;

    // Validation
    if (!name || !email || !password || !role) {
      return setError('All fields are required.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Registration failed');

      // ✅ 1. Store in localStorage (optional, for persistence)
      const userData = { name, email, role };
      localStorage.setItem('pendingProfile', JSON.stringify(userData));
      localStorage.setItem('tempSignupPassword', password);

      // ✅ 2. Pass data via state when navigating (CRITICAL FIX)
      const navigationState = {
        name,
        email,
        password, // This becomes `signupPassword` in DoctorProfileForm
      };

      // ✅ Redirect based on role with state
      switch (role) {
        case 'admin':
          navigate('/admin-profile', { state: navigationState });
          break;
        case 'doctor':
          navigate('/doctor-profile', { state: navigationState });
          break;
        case 'staff':
          navigate('/staff-profile', { state: navigationState });
          break;
        case 'patient':
          navigate('/patient-profile', { state: navigationState });
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <style>{`
        .signup-container {
          background: linear-gradient(135deg, #a0e7ff, #d4f0f7);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .signup-box {
          background: #ffffff;
          padding: 50px 40px;
          border-radius: 18px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 460px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .signup-box:hover {
          transform: translateY(-6px);
        }

        .signup-header {
          font-size: 32px;
          font-weight: 700;
          color: #0077b6;
          margin-bottom: 8px;
        }

        .signup-tagline {
          font-size: 16px;
          color: #444;
          margin-bottom: 30px;
        }

        .error-message {
          background-color: #fbe8e8;
          color: #c80000;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
          border: 1px solid #f5c2c2;
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

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          box-sizing: border-box;
          transition: border 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #0077b6;
          box-shadow: 0 0 0 2px rgba(0, 119, 182, 0.2);
          outline: none;
        }

        .signup-btn {
          width: 100%;
          background: #0077b6;
          color: white;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.3s, transform 0.2s;
        }

        .signup-btn:hover:not(:disabled) {
          background: #023e8a;
          transform: translateY(-2px);
        }

        .signup-btn:disabled {
          background: #90caf9;
          cursor: not-allowed;
          transform: none;
        }

        .loading-text:after {
          content: '...';
          margin-left: 8px;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          font-size: 15px;
          color: #555;
        }

        .login-link a {
          color: #0077b6;
          font-weight: 600;
          text-decoration: none;
        }

        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="signup-box">
        <h1 className="signup-header">🏥 HealthHub</h1>
        <p className="signup-tagline">Your Trusted Healthcare Partner — Sign Up to Get Started</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

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
              placeholder="Create a password (6+ characters)"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >
            {loading ? <span className="loading-text">Registering</span> : 'Sign Up & Continue'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;