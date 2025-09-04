// src/dashboards/admin/DoctorManagement.js
import { useState } from 'react';
import axios from 'axios';

const DoctorManagement = () => {
  const [activeTab, setActiveTab] = useState('');
  const [formData, setFormData] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // Tracks if we're in edit mode

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        availableDays: checked
          ? [...(prev.availableDays || []), value]
          : (prev.availableDays || []).filter((day) => day !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Step 1: Fetch doctor by ID for editing
  const handleFetchForUpdate = async () => {
    const doctorId = formData.doctorId;
    if (!doctorId) return alert('Please enter Doctor ID');

    try {
      const res = await axios.get('http://localhost:5000/api/doctor/all');
      const doctor = res.data.find(d => d.doctorId === doctorId);

      if (!doctor) {
        alert('Doctor not found');
        return;
      }

      setFormData(doctor);
      setEditMode(true);
    } catch (err) {
      alert('Failed to fetch doctor: ' + (err.response?.data?.message || err.message));
    }
  };

  // Step 2: Submit add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'add') {
        await axios.post('http://localhost:5000/api/doctor/add', formData);
        alert('✅ Doctor added successfully!');
        setFormData({}); // Reset form
        // Optional: Refresh the form fields (already does via state)
      } else if (activeTab === 'update' && editMode) {
        await axios.put('http://localhost:5000/api/doctor/update', formData);
        alert('✅ Doctor updated successfully!');
        setFormData({});
        setEditMode(false);
      }
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  // Fetch only approved doctors (pending ones are filtered at backend)
  const fetchDoctors = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/doctor/all');
      // Backend already returns only approved doctors
      setDoctors(res.data);
    } catch (err) {
      alert('❌ Failed to fetch doctors: ' + (err.response?.data?.message || err.message));
    } finally {
      setFetchLoading(false);
    }
  };

  // Delete doctor
  const deleteDoctor = async () => {
    if (!formData.doctorId) return alert('⚠️ Please enter Doctor ID');
    if (!window.confirm(`Are you sure you want to delete Doctor ID: ${formData.doctorId}?`)) return;

    try {
      await axios.delete('http://localhost:5000/api/doctor/delete', { data: formData });
      alert('✅ Doctor deleted successfully!');
      setFormData({});
    } catch (err) {
      alert('❌ Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={styles.container}>
      {/* Updated Header with Attractive Tagline */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏥 Doctor Management System</h1>
        <p style={styles.tagline}>Effortlessly manage doctors — Add, Update, Delete & Monitor</p>
      </div>

      {/* Action Buttons with Updated Colors */}
      <div style={styles.buttonGroup}>
        <button
          onClick={() => {
            setActiveTab(activeTab === 'add' ? '' : 'add');
            setFormData({});
          }}
          style={styles.btnAdd}
        >
          ➕ Add Doctor
        </button>
        <button
          onClick={() => {
            setActiveTab(activeTab === 'update' ? '' : 'update');
            setFormData({});
            setEditMode(false);
          }}
          style={styles.btnUpdate}
        >
          ✏️ Update Doctor
        </button>
        <button
          onClick={() => {
            setActiveTab(activeTab === 'delete' ? '' : 'delete');
            setFormData({});
          }}
          style={styles.btnDelete}
        >
          🗑️ Delete Doctor
        </button>
        <button
          onClick={() => setActiveTab(activeTab === 'fetch' ? '' : 'fetch')}
          style={styles.btnFetch}
        >
          🔍 Fetch All Doctors
        </button>
      </div>

      {/* Add Doctor */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>Add Doctor</h3>
          <input name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
          <input name="email" placeholder="Email Address" type="email" onChange={handleChange} required style={styles.input} />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} required style={styles.input} />
          <input name="dob" placeholder="Date of Birth" type="date" onChange={handleChange} style={styles.input} />
          <select name="gender" onChange={handleChange} style={styles.input}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="qualification" placeholder="Qualification (e.g., MBBS, MD)" onChange={handleChange} style={styles.input} />
          <input name="specialization" placeholder="Specialization (e.g., Cardiology)" onChange={handleChange} style={styles.input} />
          <input name="experience" placeholder="Years of Experience" onChange={handleChange} style={styles.input} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} style={styles.input} />
          <div style={styles.checkboxGroup}>
            <label>Available Days:</label>
            {days.map((day) => (
              <label key={day} style={styles.checkboxLabel}>
                <input type="checkbox" value={day} onChange={handleChange} name="availableDays" />
                {day}
              </label>
            ))}
          </div>
          <input name="availableTime" placeholder="Available Time (e.g., 9:00 AM - 5:00 PM)" onChange={handleChange} style={styles.input} />
          <input name="address" placeholder="Clinic/Hospital Address" onChange={handleChange} style={styles.input} />
          
          {/* ✅ Added: Consultation Fee Field */}
          <input
            name="consultationFee"
            placeholder="Consultation Fee (₹)"
            type="number"
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.btnSubmit}>Submit & Refresh</button>
        </form>
      )}

      {/* Update Doctor */}
      {activeTab === 'update' && (
        <div style={styles.form}>
          <h3>Update Doctor</h3>
          {!editMode ? (
            <>
              <input
                name="doctorId"
                placeholder="Enter Doctor ID (e.g., DOC-001)"
                value={formData.doctorId || ''}
                onChange={handleChange}
                style={styles.input}
              />
              <button onClick={handleFetchForUpdate} style={styles.button}>Fetch Doctor</button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                name="doctorId"
                value={formData.doctorId || ''}
                readOnly
                style={{ ...styles.input, backgroundColor: '#eee' }}
              />
              <input name="name" placeholder="Name" value={formData.name || ''} onChange={handleChange} style={styles.input} />
              <input name="email" placeholder="Email" type="email" value={formData.email || ''} onChange={handleChange} style={styles.input} />
              <input name="dob" placeholder="DOB" type="date" value={formData.dob?.split('T')[0] || ''} onChange={handleChange} style={styles.input} />
              <select name="gender" value={formData.gender || ''} onChange={handleChange} style={styles.input}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input name="qualification" placeholder="Qualification" value={formData.qualification || ''} onChange={handleChange} style={styles.input} />
              <input name="specialization" placeholder="Specialization" value={formData.specialization || ''} onChange={handleChange} style={styles.input} />
              <input name="experience" placeholder="Experience" value={formData.experience || ''} onChange={handleChange} style={styles.input} />
              <input name="phone" placeholder="Phone" value={formData.phone || ''} onChange={handleChange} style={styles.input} />
              <div style={styles.checkboxGroup}>
                <label>Available Days:</label>
                {days.map((day) => (
                  <label key={day} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={day}
                      checked={formData.availableDays?.includes(day)}
                      onChange={handleChange}
                      name="availableDays"
                    />
                    {day}
                  </label>
                ))}
              </div>
              <input name="availableTime" placeholder="Available Time" value={formData.availableTime || ''} onChange={handleChange} style={styles.input} />
              <input name="address" placeholder="Address" value={formData.address || ''} onChange={handleChange} style={styles.input} />
              
              {/* ✅ Added: Consultation Fee Field */}
              <input
                name="consultationFee"
                placeholder="Consultation Fee (₹)"
                type="number"
                value={formData.consultationFee || ''}
                onChange={handleChange}
                style={styles.input}
              />

              <button type="submit" style={styles.button}>Update Doctor</button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData({});
                }}
                style={{ ...styles.button, backgroundColor: '#95a5a6', marginLeft: '10px' }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {/* Delete Doctor */}
      {activeTab === 'delete' && (
        <div style={styles.form}>
          <h3>Delete Doctor</h3>
          <input
            name="doctorId"
            placeholder="Enter Doctor ID to Delete"
            value={formData.doctorId || ''}
            onChange={handleChange}
            style={styles.input}
          />
          <button onClick={deleteDoctor} style={{ ...styles.button, backgroundColor: '#e74c3c' }}>
            Delete Doctor
          </button>
        </div>
      )}

      {/* Fetch Doctors */}
      {activeTab === 'fetch' && (
        <div style={styles.form}>
          <h3>All Doctors</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Showing only <strong>approved doctors</strong>. Pending doctors must be approved in <strong>Requests</strong> tab.
          </p>
          <button onClick={fetchDoctors} disabled={fetchLoading} style={styles.button}>
            {fetchLoading ? 'Loading...' : 'Fetch Doctors'}
          </button>
          {doctors.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Doctor ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d._id}>
                    <td>{d.doctorId}</td>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td>{d.specialization}</td>
                    <td>{d.experience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

// === Updated Styles ===
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#f7f9fc',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '25px',
    padding: '15px',
    background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
    color: 'white',
    borderRadius: '10px',
  },
  title: {
    margin: '0',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  tagline: {
    margin: '8px 0 0',
    fontSize: '1.1rem',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
    justifyContent: 'center',
  },
  form: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    margin: '8px 0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    marginRight: '15px',
  },
  // Custom Button Styles
  btnAdd: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#27ae60', // Green
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  btnUpdate: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#3498db', // Blue (different from default)
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  btnDelete: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#e74c3c', // Red
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  btnFetch: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#8e44ad', // Purple
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  btnSubmit: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#16a085', // Teal for submit
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '15px',
    fontSize: '15px',
    width: '100%',
    boxShadow: '0 2px 6px rgba(22, 160, 133, 0.3)',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#3498db',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
};

export default DoctorManagement;