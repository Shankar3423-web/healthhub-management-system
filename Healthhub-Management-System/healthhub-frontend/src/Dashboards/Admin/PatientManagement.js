// src/components/AdminDashboard.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [showController, setShowController] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  // Add Patient Form State
  const [addData, setAddData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    address: '',
    medicalProblem: '',
    dob: '',
    age: '', // Will be auto-calculated
    gender: '',
    contact: '',
    bloodGroup: '',
  });

  // Delete Patient
  const [deleteId, setDeleteId] = useState('');

  // Update Patient
  const [updateId, setUpdateId] = useState('');
  const [updateData, setUpdateData] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Fetch Patients
  const [patients, setPatients] = useState([]);

  // ========================
  // Auto Calculate Age
  // ========================
  const calculateAge = (dob) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Update DOB and auto-calculate age
  const handleDobChange = (e) => {
    const dob = e.target.value;
    const calculatedAge = calculateAge(dob);
    setAddData({
      ...addData,
      dob,
      age: calculatedAge, // Auto-fill age
    });
  };

  // ========================
  // 1. ADD PATIENT
  // ========================
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, address, medicalProblem } = addData;

    if (!name || !email || !password || !address || !medicalProblem || !addData.dob) {
      alert('All fields are required, including Date of Birth.');
      return;
    }

    try {
      // 1. Create user (hashed password)
      await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        role: 'patient',
      });

      // 2. Create patient profile
      await axios.post('http://localhost:5000/api/patients', {
        ...addData,
      });

      alert('✅ Patient added successfully!');
      // Reset form → "Refresh"
      setAddData({
        name: '',
        email: '',
        password: '',
        role: 'patient',
        address: '',
        medicalProblem: '',
        dob: '',
        age: '',
        gender: '',
        contact: '',
        bloodGroup: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error adding patient: ' + (err.response?.data?.msg || 'Network error'));
    }
  };

  // ========================
  // 2. DELETE PATIENT
  // ========================
  const handleDelete = async () => {
    if (!deleteId) return alert('Please enter Patient ID');

    if (!window.confirm(`Delete patient ${deleteId}? This cannot be undone.`)) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/patients/${deleteId}`);
      alert(res.data.message);
      setDeleteId('');
      if (activeTab === 'fetch') fetchPatients();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || 'Not found'));
    }
  };

  // ========================
  // 3. UPDATE PATIENT
  // ========================
  const handleFetchToUpdate = async () => {
    if (!updateId) return alert('Enter Patient ID');
    setLoadingUpdate(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/patients/id/${updateId}`);
      if (res.data) {
        setUpdateData(res.data);
      } else {
        alert('Patient not found');
      }
    } catch (err) {
      alert('Patient not found');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/patients/${updateId}`, updateData);
      alert('✅ Patient updated successfully!');
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  // ========================
  // 4. FETCH ALL PATIENTS
  // ========================
  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setPatients(res.data);
    } catch (err) {
      alert('Failed to fetch patients');
    }
  };

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
      if (tab === 'fetch') fetchPatients();
      if (tab === 'update') setUpdateData(null);
    }
  };

  return (
    <div className="admin-container">
      <style>{`
        .admin-container {
          background: linear-gradient(135deg, #f0f8ff, #e6f7ff);
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 30px;
        }

        .admin-header {
          text-align: center;
          color: #0077b6;
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        }

        .admin-subtitle {
          text-align: center;
          color: #444;
          font-size: 1.2rem;
          margin-bottom: 30px;
          font-style: italic;
        }

        .controller-btn {
          display: block;
          width: 320px;
          margin: 25px auto;
          padding: 14px;
          background: linear-gradient(135deg, #0077b6, #005f86);
          color: white;
          font-size: 18px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0, 119, 182, 0.2);
        }

        .controller-btn:hover {
          background: linear-gradient(135deg, #005f86, #004666);
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(0, 119, 182, 0.3);
        }

        .tabs {
          max-width: 800px;
          margin: 30px auto;
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 13px 22px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .tab-btn:nth-child(1) { background-color: #27ae60; color: white; } /* Add - Green */
        .tab-btn:nth-child(2) { background-color: #e74c3c; color: white; } /* Delete - Red */
        .tab-btn:nth-child(3) { background-color: #3498db; color: white; } /* Update - Blue */
        .tab-btn:nth-child(4) { background-color: #8e44ad; color: white; } /* Fetch - Purple */

        .tab-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .section {
          background: white;
          margin: 25px auto;
          padding: 30px;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          border: 1px solid #f0f0f0;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 11px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          transition: border 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #0077b6;
          outline: none;
        }

        .two-columns {
          display: flex;
          gap: 20px;
        }

        .two-columns .form-group {
          flex: 1;
        }

        .action-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .action-btn.delete {
          background-color: #e74c3c;
          color: white;
        }

        .action-btn.update {
          background-color: #2980b9;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
          font-size: 14px;
        }

        table th, table td {
          padding: 14px;
          border-bottom: 1px solid #eee;
          text-align: left;
        }

        table th {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          color: #2c3e50;
          font-weight: 600;
          border-top: 2px solid #ddd;
        }

        table tr:hover {
          background-color: #f5f9ff;
          transition: background 0.2s;
        }

        table td {
          color: #34495e;
        }
      `}</style>

      {/* Updated Header with Professional Tagline */}
      <h1 className="admin-header">🏥 HealthHub Admin Dashboard</h1>
      <p className="admin-subtitle">
        Empowering healthcare management — Secure, Efficient & Patient-Centric
      </p>

      <button className="controller-btn" onClick={() => setShowController(!showController)}>
        {showController ? '🔽 Hide' : '🔼 Show'} Patient Data Controller
      </button>

      {showController && (
        <div className="tabs">
          <button className="tab-btn" onClick={() => toggleTab('add')}>➕ Add Patient</button>
          <button className="tab-btn" onClick={() => toggleTab('delete')}>🗑️ Delete Patient</button>
          <button className="tab-btn" onClick={() => toggleTab('update')}>✏️ Update Patient</button>
          <button className="tab-btn" onClick={() => toggleTab('fetch')}>📋 Fetch All Patients</button>
        </div>
      )}

      {/* =============== ADD PATIENT =============== */}
      {activeTab === 'add' && (
        <div className="section">
          <h2>➕ Add New Patient</h2>
          <form onSubmit={handleAddSubmit}>
            <div className="two-columns">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={addData.name}
                  onChange={(e) => setAddData({ ...addData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={addData.email}
                  onChange={(e) => setAddData({ ...addData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="two-columns">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={addData.password}
                  onChange={(e) => setAddData({ ...addData, password: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={addData.role}
                  disabled
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                >
                  <option value="patient">Patient</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={addData.address}
                onChange={(e) => setAddData({ ...addData, address: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Medical Problem</label>
              <input
                type="text"
                value={addData.medicalProblem}
                onChange={(e) => setAddData({ ...addData, medicalProblem: e.target.value })}
                required
              />
            </div>

            <div className="two-columns">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={addData.dob}
                  onChange={handleDobChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={addData.age}
                  readOnly
                  placeholder="Auto-calculated"
                  style={{ backgroundColor: '#f5f5f5', color: '#555' }}
                />
              </div>
            </div>

            <div className="two-columns">
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={addData.gender}
                  onChange={(e) => setAddData({ ...addData, gender: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input
                  type="tel"
                  value={addData.contact}
                  onChange={(e) => setAddData({ ...addData, contact: e.target.value })}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select
                value={addData.bloodGroup}
                onChange={(e) => setAddData({ ...addData, bloodGroup: e.target.value })}
                required
              >
                <option value="">Select</option>
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

            <button type="submit" className="action-btn">
              Submit & Refresh
            </button>
          </form>
        </div>
      )}

      {/* =============== DELETE PATIENT =============== */}
      {activeTab === 'delete' && (
        <div className="section">
          <h2>🗑️ Delete Patient</h2>
          <div className="form-group">
            <label>Patient ID (e.g., PT-1)</label>
            <input
              type="text"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value.toUpperCase())}
              placeholder="Enter patient ID"
            />
          </div>
          <button className="action-btn delete" onClick={handleDelete}>
            Delete Patient
          </button>
        </div>
      )}

      {/* =============== UPDATE PATIENT =============== */}
      {activeTab === 'update' && (
        <div className="section">
          <h2>✏️ Update Patient</h2>
          <div className="form-group">
            <label>Enter Patient ID</label>
            <input
              type="text"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value.toUpperCase())}
              placeholder="PT-1"
            />
            <button className="action-btn" onClick={handleFetchToUpdate} disabled={loadingUpdate}>
              {loadingUpdate ? 'Loading...' : 'Load Data'}
            </button>
          </div>

          {updateData && (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateSubmit(); }}>
              <div className="form-group">
                <label>Patient ID</label>
                <input type="text" value={updateData.patientId} disabled />
              </div>

              <div className="two-columns">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={updateData.name}
                    onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={updateData.email}
                    onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={updateData.address}
                  onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Medical Problem</label>
                <input
                  type="text"
                  value={updateData.medicalProblem}
                  onChange={(e) => setUpdateData({ ...updateData, medicalProblem: e.target.value })}
                />
              </div>

              <div className="two-columns">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={updateData.dob?.split('T')[0]}
                    onChange={(e) => setUpdateData({ ...updateData, dob: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={updateData.age}
                    onChange={(e) => setUpdateData({ ...updateData, age: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="two-columns">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={updateData.gender}
                    onChange={(e) => setUpdateData({ ...updateData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact</label>
                  <input
                    type="tel"
                    value={updateData.contact}
                    onChange={(e) => setUpdateData({ ...updateData, contact: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Blood Group</label>
                <select
                  value={updateData.bloodGroup}
                  onChange={(e) => setUpdateData({ ...updateData, bloodGroup: e.target.value })}
                >
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

              <button type="submit" className="action-btn update">Save Changes</button>
            </form>
          )}
        </div>
      )}

      {/* =============== FETCH ALL PATIENTS =============== */}
      {activeTab === 'fetch' && (
        <div className="section">
          <h2>📋 All Patients</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Age</th>
                <th>Blood Group</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((p) => (
                  <tr key={p._id}>
                    <td>{p.patientId}</td>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.contact}</td>
                    <td>{p.age}</td>
                    <td>{p.bloodGroup}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#777', fontStyle: 'italic' }}>
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;