// src/dashboards/admin/Requests.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('doctors'); // Controls which requests to show
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [staffRequests, setStaffRequests] = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctor requests
  const fetchDoctorRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctor/requests/pending');
      setDoctorRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch doctor requests:', err);
    }
  };

  // Fetch staff requests
  const fetchStaffRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/staff/requests/pending');
      setStaffRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch staff requests:', err);
    }
  };

  // Fetch admin requests
  const fetchAdminRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/requests/pending');
      setAdminRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch admin requests:', err);
    }
  };

  // Load all on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchDoctorRequests(), fetchStaffRequests(), fetchAdminRequests()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Approve Doctor
  const handleApproveDoctor = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/doctor/requests/approve/${id}`);
      setDoctorRequests(doctorRequests.filter(r => r._id !== id));
    } catch (err) {
      alert('Approval failed');
    }
  };

  // Reject Doctor
  const handleRejectDoctor = async (id, email) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctor/requests/reject/${id}`, { data: { email } });
      setDoctorRequests(doctorRequests.filter(r => r._id !== id));
    } catch (err) {
      alert('Rejection failed');
    }
  };

  // Approve Staff
  const handleApproveStaff = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/staff/requests/approve/${id}`);
      setStaffRequests(staffRequests.filter(r => r._id !== id));
    } catch (err) {
      alert('Approval failed');
    }
  };

  // Reject Staff
  const handleRejectStaff = async (id, email) => {
    try {
      await axios.delete(`http://localhost:5000/api/staff/requests/reject/${id}`, { data: { email } });
      setStaffRequests(staffRequests.filter(r => r._id !== id));
    } catch (err) {
      alert('Rejection failed');
    }
  };

  // Approve Admin
  const handleApproveAdmin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/requests/approve/${id}`);
      setAdminRequests(adminRequests.filter(r => r._id !== id));
    } catch (err) {
      alert('Approval failed');
    }
  };

  // Reject Admin
  const handleRejectAdmin = async (id, email) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/requests/reject/${id}`, { data: { email } });
      setAdminRequests(adminRequests.filter(r => r._id !== id));
    } catch (err) {
      alert('Rejection failed');
    }
  };

  if (loading) return <p style={styles.loading}>Loading pending requests...</p>;

  return (
    <div style={styles.container}>
      <h2>📋 Approval Requests</h2>

      {/* Tabs to switch between Doctor, Staff, and Admin requests */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('doctors')}
          style={activeTab === 'doctors' ? styles.activeTab : styles.tab}
        >
          🩺 Doctor Requests
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          style={activeTab === 'staff' ? styles.activeTab : styles.tab}
        >
          👥 Staff Requests
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          style={activeTab === 'admins' ? styles.activeTab : styles.tab}
        >
          🔐 Admin Requests
        </button>
      </div>

      {/* Doctor Requests Table */}
      {activeTab === 'doctors' && (
        <>
          {doctorRequests.length === 0 ? (
            <p>No pending doctor requests.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctorRequests.map(req => (
                  <tr key={req._id}>
                    <td>{req.name}</td>
                    <td>{req.email}</td>
                    <td>{req.specialization}</td>
                    <td>
                      <button
                        onClick={() => handleApproveDoctor(req._id)}
                        style={{ ...styles.btn, backgroundColor: '#4caf50' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectDoctor(req._id, req.email)}
                        style={{ ...styles.btn, backgroundColor: '#f44336' }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Staff Requests Table */}
      {activeTab === 'staff' && (
        <>
          {staffRequests.length === 0 ? (
            <p>No pending staff requests.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffRequests.map(req => (
                  <tr key={req._id}>
                    <td>{req.name}</td>
                    <td>{req.email}</td>
                    <td>{req.designation}</td>
                    <td>{req.department}</td>
                    <td>
                      <button
                        onClick={() => handleApproveStaff(req._id)}
                        style={{ ...styles.btn, backgroundColor: '#4caf50' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectStaff(req._id, req.email)}
                        style={{ ...styles.btn, backgroundColor: '#f44336' }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Admin Requests Table */}
      {activeTab === 'admins' && (
        <>
          {adminRequests.length === 0 ? (
            <p>No pending admin requests.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminRequests.map(req => (
                  <tr key={req._id}>
                    <td>{req.name}</td>
                    <td>{req.email}</td>
                    <td>{req.designation}</td>
                    <td>{req.department}</td>
                    <td>
                      <button
                        onClick={() => handleApproveAdmin(req._id)}
                        style={{ ...styles.btn, backgroundColor: '#4caf50' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectAdmin(req._id, req.email)}
                        style={{ ...styles.btn, backgroundColor: '#f44336' }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

// === Styles ===
const styles = {
  container: {
    padding: '20px',
  },
  loading: {
    textAlign: 'center',
    color: '#555',
    fontSize: '16px',
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
  activeTab: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#1a237e',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  btn: {
    padding: '8px 12px',
    border: 'none',
    color: 'white',
    margin: '2px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Requests;