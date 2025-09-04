// src/dashboards/admin/AdminManagement.js
import { useState } from 'react';
import axios from 'axios';

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState('');
  const [formData, setFormData] = useState({});
  const [admins, setAdmins] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  const handleFetchForUpdate = async () => {
    const adminId = formData.adminId;
    if (!adminId) return alert('Enter Admin ID');

    try {
      const res = await axios.get('http://localhost:5000/api/admin/all');
      const admin = res.data.find(a => a.adminId === adminId);
      if (!admin) return alert('Admin not found');
      setFormData(admin);
      setEditMode(true);
    } catch (err) {
      alert('Fetch failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'add') {
        await axios.post('http://localhost:5000/api/admin/add', formData);
        alert('Admin added!');
      } else if (activeTab === 'update' && editMode) {
        await axios.put('http://localhost:5000/api/admin/update', formData);
        alert('Admin updated!');
      }
      setFormData({}); // Clears form → "Refresh"
      setEditMode(false);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchAdmins = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all');
      setAdmins(res.data);
    } catch (err) {
      alert('Fetch failed');
    } finally {
      setFetchLoading(false);
    }
  };

  const deleteAdmin = async () => {
    if (!formData.adminId) return alert('Enter Admin ID');
    if (!window.confirm(`Delete Admin ID: ${formData.adminId}?`)) return;

    try {
      await axios.delete('http://localhost:5000/api/admin/delete', { data: formData });
      alert('Admin deleted!');
      setFormData({});
    } catch (err) {
      alert('Delete failed');
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={styles.container}>
      {/* Professional Header with Tagline */}
      <div style={styles.header}>
        <h1 style={styles.title}>🔐 Admin Management System</h1>
        <p style={styles.tagline}>
          Centralized control for hospital administration — Secure, Efficient & Scalable
        </p>
      </div>

      {/* Action Buttons with Custom Colors */}
      <div style={styles.buttonGroup}>
        <button
          onClick={() => {
            setActiveTab(activeTab === 'add' ? '' : 'add');
            setFormData({});
          }}
          style={styles.btnAdd}
        >
          ➕ Add Admin
        </button>
        <button
          onClick={() => {
            setActiveTab(activeTab === 'update' ? '' : 'update');
            setFormData({});
            setEditMode(false);
          }}
          style={styles.btnUpdate}
        >
          ✏️ Update Admin
        </button>
        <button
          onClick={() => {
            setActiveTab(activeTab === 'delete' ? '' : 'delete');
            setFormData({});
          }}
          style={styles.btnDelete}
        >
          🗑️ Delete Admin
        </button>
        <button
          onClick={() => setActiveTab(activeTab === 'fetch' ? '' : 'fetch')}
          style={styles.btnFetch}
        >
          🔍 Fetch All Admins
        </button>
      </div>

      {/* Add Admin */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>Add Admin</h3>
          <input name="name" placeholder="Name" onChange={handleChange} required style={styles.input} />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} required style={styles.input} />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} required style={styles.input} />
          <input name="dob" placeholder="DOB" type="date" onChange={handleChange} style={styles.input} />
          <input name="age" value={formData.age || ''} readOnly style={styles.input} placeholder="Age" />
          <select name="gender" onChange={handleChange} style={styles.input}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="contact" placeholder="Contact" onChange={handleChange} style={styles.input} />
          <input name="address" placeholder="Address" onChange={handleChange} style={styles.input} />
          <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} style={styles.input} />
          <input name="emergencyContact" placeholder="Emergency Contact" onChange={handleChange} style={styles.input} />
          <select name="designation" onChange={handleChange} style={styles.input}>
            <option value="">Designation</option>
            <option value="Senior Admin">Senior Admin</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Database Operator">Database Operator</option>
          </select>
          <select name="department" onChange={handleChange} style={styles.input}>
            <option value="">Department</option>
            <option value="Administration">Administration</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
          </select>
          <input name="joiningDate" placeholder="Joining Date" type="date" onChange={handleChange} style={styles.input} />
          <input name="qualification" placeholder="Qualification" onChange={handleChange} style={styles.input} />
          <input name="experience" placeholder="Experience" onChange={handleChange} style={styles.input} />
          <input name="previousExperience" placeholder="Previous Experience" onChange={handleChange} style={styles.input} />
          <div style={styles.checkboxGroup}>
            {days.map(day => (
              <label key={day} style={styles.checkboxLabel}>
                <input type="checkbox" value={day} onChange={handleChange} name="availableDays" /> {day}
              </label>
            ))}
          </div>
          <input name="availableTime" placeholder="Available Time" onChange={handleChange} style={styles.input} />
          <button type="submit" style={styles.btnSubmit}>Submit & Refresh</button>
        </form>
      )}

      {/* Update Admin */}
      {activeTab === 'update' && (
        <div style={styles.form}>
          <h3>Update Admin</h3>
          {!editMode ? (
            <>
              <input name="adminId" placeholder="Enter Admin ID" onChange={handleChange} style={styles.input} />
              <button onClick={handleFetchForUpdate} style={styles.button}>Fetch Admin</button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <input name="adminId" value={formData.adminId} readOnly style={{ ...styles.input, backgroundColor: '#eee' }} />
              <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} style={styles.input} />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} />
              <input name="dob" type="date" value={formData.dob?.split('T')[0]} onChange={handleChange} style={styles.input} />
              <input name="age" value={formData.age} readOnly style={styles.input} />
              <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} style={styles.input} />
              <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={styles.input} />
              <input name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleChange} style={styles.input} />
              <input name="emergencyContact" placeholder="Emergency Contact" value={formData.emergencyContact} onChange={handleChange} style={styles.input} />
              <select name="designation" value={formData.designation} onChange={handleChange} style={styles.input}>
                <option value="">Designation</option>
                <option value="Senior Admin">Senior Admin</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Database Operator">Database Operator</option>
              </select>
              <select name="department" value={formData.department} onChange={handleChange} style={styles.input}>
                <option value="">Department</option>
                <option value="Administration">Administration</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
              </select>
              <input name="joiningDate" type="date" value={formData.joiningDate?.split('T')[0]} onChange={handleChange} style={styles.input} />
              <input name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} style={styles.input} />
              <input name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} style={styles.input} />
              <input name="previousExperience" placeholder="Previous Experience" value={formData.previousExperience} onChange={handleChange} style={styles.input} />
              <div style={styles.checkboxGroup}>
                {days.map(day => (
                  <label key={day} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={day}
                      checked={formData.availableDays?.includes(day)}
                      onChange={handleChange}
                      name="availableDays"
                    /> {day}
                  </label>
                ))}
              </div>
              <input name="availableTime" placeholder="Available Time" value={formData.availableTime} onChange={handleChange} style={styles.input} />
              <button type="submit" style={styles.button}>Update Admin</button>
              <button type="button" onClick={() => setEditMode(false)} style={{ ...styles.button, backgroundColor: '#95a5a6' }}>Cancel</button>
            </form>
          )}
        </div>
      )}

      {/* Delete Admin */}
      {activeTab === 'delete' && (
        <div style={styles.form}>
          <h3>Delete Admin</h3>
          <input name="adminId" placeholder="Enter Admin ID" onChange={handleChange} style={styles.input} />
          <button onClick={deleteAdmin} style={{ ...styles.button, backgroundColor: '#e74c3c' }}>Delete Admin</button>
        </div>
      )}

      {/* Fetch Admins */}
      {activeTab === 'fetch' && (
        <div style={styles.form}>
          <h3>All Admins</h3>
          <button onClick={fetchAdmins} disabled={fetchLoading} style={styles.button}>
            {fetchLoading ? 'Loading...' : 'Fetch Admins'}
          </button>
          {admins.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a._id}>
                    <td>{a.adminId}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.designation}</td>
                    <td>{a.department}</td>
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

// === Enhanced Styles ===
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#f7f9fc',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '25px',
    padding: '20px',
    background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
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
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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
    backgroundColor: '#3498db', // Blue
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
    backgroundColor: '#16a085', // Teal
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
    backgroundColor: '#f0f0f9',
    border: '1px solid #ddd',
    fontWeight: '600',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
};

export default AdminManagement;