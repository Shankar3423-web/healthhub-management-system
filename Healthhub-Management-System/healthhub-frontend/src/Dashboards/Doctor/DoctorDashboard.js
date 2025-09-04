// src/Dashboards/Doctor/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: 'Not Provided',
    doctorId: 'Not Provided',
    email: 'Not Provided',
    contact: 'Not Provided',
    specialization: 'Not Provided',
    experience: 'Not Provided',
    qualification: 'Not Provided',
    availableDays: 'Not Provided',
    availableTimings: 'Not Provided',
    consultationFee: 'Not Provided',
    address: 'Not Provided',
  });

  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  const navigate = useNavigate(); // ✅ Add navigate

  useEffect(() => {
    if (!token) {
      alert('Authentication token missing.');
      window.location.href = '/login';
      return;
    }

    if (!userStr) {
      alert('Session expired. Please log in.');
      window.location.href = '/login';
      return;
    }

    const user = JSON.parse(userStr);

    if (user.role !== 'doctor') {
      alert('Access denied. Doctor account required.');
      window.location.href = '/login';
      return;
    }

    // ✅ Extract doctor data directly from localStorage
    setDoctorData({
      name: user.name || 'Not Provided',
      doctorId: user.doctorId || 'Not Provided',
      email: user.email || 'Not Provided',
      contact: user.contact || 'Not Provided',
      specialization: user.specialization || 'Not Provided',
      experience: user.experience?.toString() || 'Not Provided',
      qualification: user.qualification || 'Not Provided',
      availableDays: Array.isArray(user.availableDays)
        ? user.availableDays.join(', ')
        : user.availableDays || 'Not Provided',
      availableTimings: user.availableTimings || 'Not Provided',
      consultationFee: user.consultationFee || 'Not Provided',
      address: user.address || 'Not Provided',
    });
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Optional: Clear other sensitive data
    // localStorage.clear(); // Use with caution

    // Redirect to login
    navigate('/login');
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body, html { font-family: 'Segoe UI', sans-serif; background: #f5f8fa; margin: 0; padding: 0; }
        .doctor-dashboard { display: flex; min-height: 100vh; }
        .sidebar { width: 250px; background: #1e88e5; color: white; padding: 20px; display: flex; flex-direction: column; }
        .sidebar .logo { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 30px; }
        .menu { list-style: none; flex: 1; margin-top: 20px; }
        .menu li { margin: 15px 0; }
        .menu li a { color: white; text-decoration: none; padding: 10px 15px; display: block; border-radius: 8px; }
        .menu li a:hover, .menu li a.active { background: #0d47a1; }

        .main-content { flex: 1; padding: 30px; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; margin-bottom: 30px; }
        .welcome-section h1 { font-size: 2.5rem; color: #0d47a1; }
        .highlight { color: #0288d1; font-weight: bold; }
        .profile-section { position: relative; display: inline-block; }
        .profile-button { background: #1e88e5; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; text-align: left; }
        .profile-dropdown { position: absolute; top: 60px; right: 0; width: 320px; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 1000; }
        .profile-header { background: #0d47a1; color: white; padding: 15px; text-align: center; }
        .profile-body { padding: 20px; font-size: 0.95rem; }
        .profile-body div { margin-bottom: 12px; }
        .profile-body strong { display: inline-block; width: 140px; color: #0d47a1; }
      `}</style>

      <div className="doctor-dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">HealthHub</div>
          <ul className="menu">
            <li><Link to="/doctor-dashboard" className="active">Home</Link></li>
            <li><Link to="/doctor/check-appointments">Check Appointments</Link></li>
            <li><Link to="/doctor/checkup-prescription">Checkup & Add Prescription</Link></li>
            <li><Link to="/doctor/history">History</Link></li>
            {/* ✅ Replace Link with button onClick */}
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  padding: '10px 15px',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                  borderRadius: '8px',
                }}
                onMouseOver={(e) => (e.target.style.background = '#0d47a1')}
                onMouseOut={(e) => (e.target.style.background = 'none')}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="top-bar">
            <div className="welcome-section">
              <h1>Welcome, <span className="highlight">Dr. {doctorData.name}</span>!</h1>
            </div>

            <div className="profile-section">
              <button
                className="profile-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <strong>Dr. {doctorData.name}</strong><br />
                <small>{doctorData.doctorId}</small>
              </button>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <h3>Dr. {doctorData.name}</h3>
                    <p>{doctorData.doctorId}</p>
                  </div>
                  <div className="profile-body">
                    <div><strong>Name:</strong> {doctorData.name}</div>
                    <div><strong>Doctor ID:</strong> {doctorData.doctorId}</div>
                    <div><strong>Email:</strong> {doctorData.email}</div>
                    <div><strong>Contact:</strong> {doctorData.contact}</div>
                    <div><strong>Specialization:</strong> {doctorData.specialization}</div>
                    <div><strong>Experience:</strong> {doctorData.experience} years</div>
                    <div><strong>Qualification:</strong> {doctorData.qualification}</div>
                    <div><strong>Available Days:</strong> {doctorData.availableDays}</div>
                    <div><strong>Timings:</strong> {doctorData.availableTimings}</div>
                    <div><strong>Consultation Fee:</strong> ₹{doctorData.consultationFee}</div>
                    <div><strong>Address:</strong> {doctorData.address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#333', margin: '20px auto 30px' }}>
            Manage your appointments, add prescriptions, and review patient history — all in one secure place.
          </p>

          <footer style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
            &copy; 2025 HealthHub. Your Trusted Healthcare Partner.
          </footer>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;