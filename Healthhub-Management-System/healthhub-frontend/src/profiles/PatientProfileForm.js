// src/components/PatientProfileForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientProfileForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [medicalProblem, setMedicalProblem] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Read data from localStorage
    const pending = JSON.parse(localStorage.getItem('pendingProfile'));
    if (!pending || pending.role !== 'patient') {
      setError('Access denied. Please sign up first.');
      return;
    }
    setName(pending.name);
    setEmail(pending.email);
    setAddress(pending.address || '');
    setMedicalProblem(pending.medicalProblem || '');
  }, []);

  // Calculate age when DOB changes
  useEffect(() => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge('');
    }
  }, [dob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Required fields
    if (!dob || !gender || !contact || !bloodGroup || !address || !medicalProblem || !confirmPassword) {
      return setError('All fields are required.');
    }
    if (!/^[0-9]{10}$/.test(contact)) {
      return setError('Contact must be a 10-digit number.');
    }
    // 🔐 Password match check
    const originalPassword = localStorage.getItem('tempSignupPassword');
    if (confirmPassword !== originalPassword) {
      return setError('Password did not match.');
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const patientData = {
        name,
        email,
        address,
        medicalProblem,
        dob,
        age,
        gender,
        contact,
        bloodGroup,
        password: confirmPassword,
      };

      const res = await axios.post('http://localhost:5000/api/patients', patientData);

      if (res.data.message?.includes('success') || res.status === 201) {
        setMessage('🎉 Patient profile created successfully!');
        // ✅ Cleanup
        localStorage.removeItem('pendingProfile');
        localStorage.removeItem('tempSignupPassword');
      } else {
        setError('Failed to save profile.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Network error. Could not submit form.');
    } finally {
      setLoading(false);
    }
  };

  // Show access denied if no pending data
  if (error && !name) {
    return (
      <div className="profile-container">
        <div className="error-box">
          <h2>🔒 Access Denied</h2>
          <p>You must sign up first to create a profile.</p>
          <button onClick={() => navigate('/signup')} className="btn-primary">
            Go to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <style>{`
        .profile-container {
          background: linear-gradient(135deg, #e6f7ff, #f0f9ff);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-family: 'Segoe UI', Arial, sans-serif;
        }
        .profile-box {
          background: white;
          width: 100%;
          max-width: 560px;
          padding: 45px;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        .profile-header {
          text-align: center;
          color: #0077b6;
          margin-bottom: 20px;
          font-size: 28px;
          font-weight: 700;
        }
        .profile-subtitle {
          text-align: center;
          color: #555;
          font-size: 15px;
          margin-bottom: 25px;
        }
        .input-group {
          margin-bottom: 20px;
          text-align: left;
        }
        .input-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }
        .input-group input,
        .input-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          box-sizing: border-box;
        }
        .input-group input:disabled {
          background-color: #f5f5f5;
          color: #555;
          cursor: not-allowed;
        }
        .input-group input:focus,
        .input-group select:focus {
          border-color: #0077b6;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 119, 182, 0.2);
        }
        .two-columns {
          display: flex;
          gap: 16px;
        }
        .two-columns .input-group {
          flex: 1;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background-color: #0077b6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.3s;
        }
        .submit-btn:hover:not(:disabled) {
          background-color: #023e8a;
        }
        .submit-btn:disabled {
          background-color: #90caf9;
          cursor: not-allowed;
        }
        .message {
          margin-top: 15px;
          text-align: center;
          font-weight: bold;
          padding: 15px;
          border-radius: 8px;
          font-size: 16px;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .error-box {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
        }
        .error-box h2 {
          color: #c80000;
        }
        .btn-primary {
          background-color: #0077b6;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 15px;
        }
        .btn-primary:hover {
          background-color: #023e8a;
        }
        .login-btn {
          display: block;
          width: 80%;
          margin: 20px auto;
          padding: 12px;
          background-color: #28a745;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .login-btn:hover {
          background-color: #218838;
        }
        .success-tagline {
          font-style: italic;
          color: #155724;
          margin: 10px 0;
          font-size: 15px;
        }
      `}</style>

      <div className="profile-box">
        <h1 className="profile-header">🩺 HealthHub - Patient Profile</h1>
        <p className="profile-subtitle">Welcome, {name}! Please complete your medical profile.</p>

        {error && <div className="message error">{error}</div>}

        {message && (
          <div className="message success">
            {message}
            <p className="success-tagline">Your data has been securely saved. Login to access your patient dashboard and manage your health journey.</p>
            <button
              className="login-btn"
              onClick={() => {
                navigate('/login');
              }}
            >
              🔐 Login to Dashboard
            </button>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit}>
            {/* Name & Email */}
            <div className="two-columns">
              <div className="input-group">
                <label>Name</label>
                <input type="text" value={name} disabled />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} disabled />
              </div>
            </div>

            {/* Address & Medical Problem */}
            <div className="two-columns">
              <div className="input-group">
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  required
                />
              </div>
              <div className="input-group">
                <label>Medical Problem</label>
                <input
                  type="text"
                  value={medicalProblem}
                  onChange={(e) => setMedicalProblem(e.target.value)}
                  placeholder="e.g., Diabetes, Asthma"
                  required
                />
              </div>
            </div>

            {/* DOB & Age */}
            <div className="two-columns">
              <div className="input-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Age</label>
                <input type="text" value={age || ''} readOnly placeholder="Auto-calculated" />
              </div>
            </div>

            {/* Gender & Contact */}
            <div className="two-columns">
              <div className="input-group">
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="10-digit number"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div className="input-group">
              <label>Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter the password to confirm and continue"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PatientProfileForm;