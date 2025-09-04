import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from location.state or fallback to localStorage
  const fromState = location.state;
  const fromStorage = JSON.parse(localStorage.getItem('pendingProfile'));
  const tempPassword = localStorage.getItem('tempSignupPassword');

  const name = fromState?.name || fromStorage?.name || '';
  const email = fromState?.email || fromStorage?.email || '';
  const signupPassword = fromState?.password || tempPassword || '';

  const [formData, setFormData] = useState({
    name,
    email,
    dob: '',
    age: '',
    gender: '',
    qualification: '',
    specialization: '',
    experience: '',
    phone: '',
    availableDays: [], // Array for selected days
    availableTime: '',
    address: '',
    consultationFee: '', // 🔁 New field added here
    password: '', // Renamed from confirmPassword
  });

  const [originalPassword, setOriginalPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validate required data on load
  useEffect(() => {
    if (!name || !email || !signupPassword) {
      setError('Signup information missing. Please sign up again.');
      setTimeout(() => navigate('/signup'), 1500);
      return;
    }
    setOriginalPassword(signupPassword);
  }, [name, email, signupPassword, navigate]);

  const handleChange = (e) => {
    const { name: fieldName, value, checked } = e.target; // ✅ Removed unused 'type'

    if (fieldName === 'availableDays') {
      // Handle checkbox group
      setFormData((prev) => {
        const updatedDays = checked
          ? [...prev.availableDays, value]
          : prev.availableDays.filter((day) => day !== value);
        return { ...prev, availableDays: updatedDays };
      });
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  // Auto-calculate age from DOB
  useEffect(() => {
    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData((prev) => ({ ...prev, age }));
    }
  }, [formData.dob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Confirm password matches signup password
    if (formData.password !== originalPassword) {
      setError('Incorrect password. Please enter the password you used during signup.');
      return;
    }

    const payload = {
      ...formData,
      password: originalPassword, // Send original password
    };

    try {
      await axios.post('http://localhost:5000/api/doctor/profile-public', payload);

      setSuccessMessage('Profile submitted successfully! Awaiting admin approval.');

      // Redirect to home after success
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit profile';
      console.error('Submission Error:', errorMsg);
      setError(errorMsg);
    }
  };

  const styles = {
    container: {
      backgroundColor: '#f0fff0',
      padding: '30px',
      maxWidth: '900px',
      margin: '40px auto',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Segoe UI, sans-serif',
    },
    header: {
      textAlign: 'center',
      color: '#2e7d32',
      marginBottom: '10px',
      fontSize: '36px',
      fontWeight: '700',
    },
    tagline: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#1a5632',
      marginBottom: '25px',
      fontStyle: 'italic',
    },
    welcome: {
      backgroundColor: '#e8f5e8',
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '18px',
      color: '#1b5e20',
      marginBottom: '25px',
      border: '1px solid #a5d6a7',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px',
      marginBottom: '18px',
    },
    field: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    singleField: {
      marginBottom: '18px',
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      marginTop: '6px',
    },
    checkboxGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '6px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
    },
    checkbox: {
      marginRight: '5px',
    },
    button: {
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      marginTop: '15px',
    },
  };

  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={styles.container}>
      {/* Header */}
      <h1 style={styles.header}>🏥 HealthHub</h1>
      <p style={styles.tagline}>Your Trusted Healthcare Partner</p>

      {/* Welcome Message */}
      <div style={styles.welcome}>
        Welcome, <strong>Dr. {name.split(' ').pop()}</strong>! 👨‍⚕️<br />
        Please complete your profile to proceed.
      </div>

      {/* Show error */}
      {error && !successMessage && (
        <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Name & Email */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} readOnly style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} readOnly style={styles.input} />
          </div>
        </div>

        {/* DOB & Age */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label>Age:</label>
            <input type="number" name="age" value={formData.age} readOnly style={styles.input} />
          </div>
        </div>

        {/* Gender & Qualification */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.input}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={styles.field}>
            <label>Qualification:</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        {/* Specialization & Experience */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label>Specialization:</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label>Experience:</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        {/* Phone & Available Days */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label>Mobile Number:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label>Available Days:</label>
            <div style={styles.checkboxGroup}>
              {days.map((day) => (
                <label key={day} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.availableDays.includes(day)}
                    onChange={handleChange}
                    name="availableDays"
                    style={styles.checkbox}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Available Time & Consultation Fee */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label>Available Time:</label>
            <input
              type="text"
              name="availableTime"
              value={formData.availableTime}
              onChange={handleChange}
              placeholder="e.g., 9:00 AM - 5:00 PM"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label>Consultation Fee (₹):</label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              placeholder="Enter fee in INR"
              required
              style={styles.input}
            />
          </div>
        </div>

        {/* Address */}
        <div style={styles.singleField}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Password Field */}
        <div style={styles.singleField}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Re-enter password to confirm and continue"
            required
            style={styles.input}
          />
        </div>

        {/* Success Message */}
        {successMessage && (
          <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
            {successMessage}
          </p>
        )}

        <button type="submit" style={styles.button}>Submit for Approval</button>
      </form>
    </div>
  );
};

export default DoctorProfileForm;