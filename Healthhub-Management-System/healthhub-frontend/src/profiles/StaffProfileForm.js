// src/profiles/StaffProfileForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StaffProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from signup
  const { name: signupName, email: signupEmail, password: signupPassword } = location.state || {};

  const [formData, setFormData] = useState({
    name: signupName || '',
    email: signupEmail || '',
    gender: '',
    dob: '',
    age: '',
    contactNumber: '',
    designation: '',
    department: '',
    qualification: '',
    experience: '',
    joiningDate: '',
    availableDays: '',
    availableTime: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    password: '',
  });

  const [originalPassword, setOriginalPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Show loading during submit

  // Validate and set original password
  useEffect(() => {
    if (!signupName || !signupEmail || !signupPassword) {
      setError('Signup information missing. Please sign up again.');
      setTimeout(() => navigate('/signup'), 1500);
      return;
    }
    setOriginalPassword(signupPassword);
  }, [signupName, signupEmail, signupPassword, navigate]);

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      const calculatedAge = calculateAge(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        age: calculatedAge,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Show user it's submitting

    // Validate required fields
    if (!formData.contactNumber || !formData.designation || !formData.department || !formData.joiningDate) {
      setLoading(false);
      return alert('Please fill in all required fields.');
    }

    // Confirm password matches signup password
    if (formData.password !== originalPassword) {
      setError('Incorrect password. Please enter the password you used during signup.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/staff/submitProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('Profile submitted successfully! Awaiting approval.');
      navigate('/');
    } catch (err) {
      console.error('Error submitting profile:', err);
      setError(`Failed to submit profile: ${err.message}`);
      alert('Failed to submit profile. Please try again later.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Staff Profile Setup</h1>
      <p style={styles.tagline}>"Building a Healthier Team Together"</p>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Basic Information */}
        <fieldset style={styles.block}>
          <legend style={styles.legend}>🧾 Basic Information</legend>
          <div style={styles.row}>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              style={styles.input}
              placeholder="Full Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              style={styles.input}
              placeholder="Email Address"
            />
          </div>
          <div style={styles.row}>
            <div style={{ flex: '1' }}>
              <label style={styles.label}>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <input
              type="number"
              name="age"
              value={formData.age}
              readOnly
              style={styles.input}
              placeholder="Age"
            />
          </div>
          <div style={styles.row}>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              style={styles.input}
              placeholder="Contact Number *"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </fieldset>

        {/* Professional Details */}
        <fieldset style={styles.block}>
          <legend style={styles.legend}>💼 Professional Details</legend>
          <div style={styles.row}>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Designation *</option>
              <option value="Nurse">Nurse</option>
              <option value="Technician">Technician</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Lab Assistant">Lab Assistant</option>
            </select>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Department *</option>
              <option value="Radiology">Radiology</option>
              <option value="General">General</option>
              <option value="Pathology">Pathology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Physiotherapy">Physiotherapy</option>
            </select>
          </div>
          <div style={styles.row}>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Qualification</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Certification">Certification</option>
            </select>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              style={styles.input}
              placeholder="Experience (years)"
              min="0"
            />
          </div>
          <div style={styles.row}>
            <div style={{ flex: '1' }}>
              <label style={styles.label}>Date of Joining *</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Work Schedule */}
        <fieldset style={styles.block}>
          <legend style={styles.legend}>📅 Work Schedule</legend>
          <div style={styles.row}>
            <input
              type="text"
              name="availableDays"
              value={formData.availableDays}
              onChange={handleChange}
              style={styles.input}
              placeholder="Available Days (e.g., Mon, Wed)"
            />
            <input
              type="text"
              name="availableTime"
              value={formData.availableTime}
              onChange={handleChange}
              style={styles.input}
              placeholder="Available Time (e.g., 9am - 5pm)"
            />
          </div>
        </fieldset>

        {/* Other Information */}
        <fieldset style={styles.block}>
          <legend style={styles.legend}>🏠 Other Information</legend>
          <div style={styles.row}>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              style={styles.input}
              placeholder="Emergency Contact Number"
            />
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              style={styles.input}
              placeholder="Blood Group (e.g., A+)"
            />
          </div>
          <div style={styles.row}>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{ ...styles.input, height: '60px', width: '100%' }}
              placeholder="Full Address"
            />
          </div>
        </fieldset>

        {/* Password Confirmation */}
        <fieldset style={styles.block}>
          <legend style={styles.legend}>🔐 Confirm Identity</legend>
          <div style={styles.row}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Re-enter password to confirm and continue"
              style={styles.input}
              required
            />
          </div>
        </fieldset>

        <div style={styles.submitContainer}>
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

// === Corrected Styles (No invalid keys) ===
const styles = {
  pageContainer: {
    backgroundColor: '#fffafafa',
    minHeight: '100vh',
    padding: '40px 20px',
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: 'center',
    color: '#8b0000',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  tagline: {
    textAlign: 'center',
    color: '#c2185b',
    fontSize: '16px',
    fontStyle: 'italic',
    marginBottom: '30px',
  },
  error: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: '500',
  },
  form: {
    maxWidth: '960px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  block: {
    backgroundColor: '#fff5f5',
    borderRadius: '12px',
    padding: '25px 20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.08)',
    border: '1px solid #eec0c0',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  legend: {
    fontWeight: '600',
    fontSize: '18px',
    color: '#8b0000',
    marginBottom: '15px',
    padding: '0 10px',
    backgroundColor: 'transparent',
  },
  row: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddb1b1',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#333',
    outline: 'none',
    transition: 'border 0.3s',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    color: '#8b0000',
    fontSize: '14px',
  },
  submitContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  submitButton: {
    backgroundColor: '#8b0000',
    color: '#ffffff',
    padding: '14px 32px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
};

export default StaffProfileForm;