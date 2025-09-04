// src/profiles/AdminProfileForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from signup
  const { name: signupName, email: signupEmail, password: signupPassword } = location.state || {};

  const [formData, setFormData] = useState({
    name: signupName || '',
    email: signupEmail || '',
    dob: '',
    age: '',
    contact: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    designation: '',
    department: '',
    joiningDate: '',
    qualification: '',
    experience: '',
    previousExperience: '',
    availableDays: '',
    availableTime: '',
    password: '', // For confirmation
  });

  const [originalPassword, setOriginalPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Validate and auto-fill on mount
  useEffect(() => {
    if (!signupName || !signupEmail || !signupPassword) {
      setError('Signup information missing. Please sign up again.');
      setTimeout(() => navigate('/signup'), 1500);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      name: signupName,
      email: signupEmail,
    }));
    setOriginalPassword(signupPassword);
  }, [signupName, signupEmail, signupPassword, navigate]);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === 'dob') {
      updatedFormData.age = calculateAge(value);
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    // Validate password
    if (formData.password !== originalPassword) {
      setError('Password does not match. Please enter the password used during signup.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/submit-admin-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const error = await res.json();
        setError(error.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Could not submit form. Is the server running?');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Profile Setup</h2>
      <p style={styles.subheader}>"Empowering Leadership, One Admin at a Time"</p>

      {submitted ? (
        <div style={styles.success}>
          <p>
            <strong>✅ Submitted!</strong> Please wait for admin approval to enjoy features like 
            <strong> dashboard analytics, patient management, doctor coordination, and more</strong>.
          </p>
          <p style={{ marginTop: '20px' }}>
            You'll gain full access once your account is verified.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={styles.okButton}
          >
            OK
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Basic Information */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>🧾 Basic Information</h3>
            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Full Name</label>
                <input type="text" name="name" value={formData.name} readOnly style={styles.input} />
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Email Address</label>
                <input type="email" name="email" value={formData.email} readOnly style={styles.input} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Age</label>
                <input type="number" name="age" value={formData.age} readOnly style={styles.input} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., +1 234 567 890"
                  required
                />
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Full residential address"
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., +1 234 567 890"
                />
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>💼 Professional Details</h3>
            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Designation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Senior Admin">Senior Admin</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Database Operator">Database Operator</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Operations Lead">Operations Lead</option>
                </select>
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Administration">Administration</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Data Management">Data Management</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Qualification</label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="MBA">MBA</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="BCA">BCA</option>
                  <option value="Diploma in IT">Diploma in IT</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., 5"
                />
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Previous Work Experience</label>
                <input
                  type="text"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., Hospital X, Admin Lead"
                />
              </div>
            </div>
          </section>

          {/* Work Schedule */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>📅 Work Schedule</h3>
            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Available Days</label>
                <input
                  type="text"
                  name="availableDays"
                  value={formData.availableDays}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., Mon, Wed, Fri"
                />
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Available Time</label>
                <input
                  type="text"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>
            </div>
          </section>

          {/* Password Confirmation */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>🔐 Confirm Identity</h3>
            <div style={styles.row}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Re-enter Password</label>
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
            </div>
          </section>

          {/* Submit */}
          <div style={styles.submitContainer}>
            <button type="submit" style={styles.button}>
              Submit for Approval
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

// === Professional Inline Styles ===
const styles = {
  container: {
    maxWidth: '960px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '12px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#fffdf5', // Light whitish with soft yellow tint
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #ffeaa7',
  },
  header: {
    textAlign: 'center',
    color: '#8b4513', // Warm brown
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subheader: {
    textAlign: 'center',
    color: '#d3a428', // Golden yellow
    fontStyle: 'italic',
    fontSize: '16px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    backgroundColor: '#fdf8e9', // Softer yellow background
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #ffe5b4',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
  },
  sectionTitle: {
    color: '#8b4513',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  row: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  inputBox: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '500',
    color: '#5d4037',
    marginBottom: '6px',
    fontSize: '14px',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid #dcd0a0',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#333',
    outline: 'none',
    transition: 'border 0.3s',
    minHeight: '48px',
  },
  button: {
    padding: '14px 28px',
    fontSize: '16px',
    backgroundColor: '#8b4513',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    alignSelf: 'center',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    marginTop: '15px',
    fontWeight: '500',
  },
  success: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#2e7d32',
    fontSize: '16px',
    lineHeight: '1.6',
    backgroundColor: '#f9fbe7',
    borderRadius: '10px',
    border: '1px solid #dce775',
    margin: '20px 0',
  },
  okButton: {
    marginTop: '25px',
    padding: '12px 30px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  },
  submitContainer: {
    textAlign: 'center',
  },
};

export default AdminProfileForm;