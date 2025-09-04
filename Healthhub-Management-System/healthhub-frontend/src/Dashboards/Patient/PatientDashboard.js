// src/components/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Not Provided',
    patientId: 'Not Provided',
    email: 'Not Provided',
    contact: 'Not Provided',
    dob: 'Not Provided',
    age: 'Not Provided',
    gender: 'Not Provided',
    bloodGroup: 'Not Provided',
    address: 'Not Provided',
    medicalProblem: 'Not Provided',
  });

  const navigate = useNavigate(); // ✅ Add navigate

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');

        if (!userStr) {
          alert('Not logged in.');
          window.location.href = '/login';
          return;
        }

        const user = JSON.parse(userStr);
        const { email } = user;

        if (!email) {
          alert('Email not found in session.');
          window.location.href = '/login';
          return;
        }

        if (!token) {
          alert('Authentication token missing.');
          window.location.href = '/login';
          return;
        }

        const response = await fetch('http://localhost:5000/api/patient/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Failed to load profile');
        }

        const data = await response.json();

        const dobFormatted = data.dob
          ? new Date(data.dob).toLocaleDateString()
          : 'Not Provided';

        setUserData({
          name: data.name || 'Not Provided',
          patientId: data.patientId || 'Not Provided',
          email: data.email || 'Not Provided',
          contact: data.contact || 'Not Provided',
          dob: dobFormatted,
          age: data.age?.toString() || 'Not Provided',
          gender: data.gender || 'Not Provided',
          bloodGroup: data.bloodGroup || 'Not Provided',
          address: data.address || 'Not Provided',
          medicalProblem: data.medicalProblem || 'Not Provided',
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
        alert('Could not load your profile. Please log in again.');
        window.location.href = '/login';
      }
    };

    fetchProfile();
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Redirect to login
    navigate('/login');
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body, html { font-family: 'Segoe UI', sans-serif; background: #f5f8fa; }
        .patient-dashboard { display: flex; min-height: 100vh; }
        .sidebar { width: 250px; background: #1e88e5; color: white; padding: 20px; display: flex; flex-direction: column; }
        .sidebar .logo { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 30px; }
        .menu { list-style: none; flex: 1; }
        .menu li { margin: 15px 0; }
        .menu li a { color: white; text-decoration: none; padding: 10px 15px; display: block; border-radius: 8px; }
        .menu li a:hover, .menu li a.active { background: #0d47a1; }
        .main-content { flex: 1; padding: 30px; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; margin-bottom: 30px; }
        .welcome-section h1 { font-size: 2.5rem; color: #0d47a1; }
        .highlight { color: #0288d1; font-weight: bold; }
        .profile-section { position: relative; display: inline-block; }
        .profile-button { background: #1e88e5; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; text-align: left; }
        .profile-dropdown { position: absolute; top: 60px; right: 0; width: 300px; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 1000; }
        .profile-header { background: #0d47a1; color: white; padding: 15px; text-align: center; }
        .profile-body { padding: 20px; font-size: 0.95rem; }
        .profile-body div { margin-bottom: 12px; }
        .profile-body strong { display: inline-block; width: 120px; color: #0d47a1; }
      `}</style>

      <div className="patient-dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">HealthHub</div>
          <ul className="menu">
            <li><Link to="/patient-dashboard" className="active">Home</Link></li>
            <li><Link to="/book-appointment">Book Appointment</Link></li>
            <li><Link to="/upload-files">Upload Files</Link></li>
            <li><Link to="/prescriptions">Prescriptions</Link></li>
            <li><Link to="/billing">Billing</Link></li>
            <li><Link to="/history">Medical History</Link></li>
            {/* ✅ Logout Button */}
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
                  fontSize: 'inherit',
                }}
                onMouseOver={(e) => (e.target.style.background = '#0d47a1')}
                onMouseOut={(e) => (e.target.style.background = 'transparent')}
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
              <h1>Welcome, <span className="highlight">{userData.name}</span>!</h1>
            </div>

            <div className="profile-section">
              <button
                className="profile-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <strong>{userData.name}</strong><br />
                <small>{userData.patientId}</small>
              </button>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <h3>{userData.name}</h3>
                    <p>{userData.patientId}</p>
                  </div>
                  <div className="profile-body">
                    <div><strong>Name:</strong> {userData.name}</div>
                    <div><strong>Patient ID:</strong> {userData.patientId}</div>
                    <div><strong>Email:</strong> {userData.email}</div>
                    <div><strong>Contact:</strong> {userData.contact}</div>
                    <div><strong>DOB:</strong> {userData.dob}</div>
                    <div><strong>Age:</strong> {userData.age}</div>
                    <div><strong>Gender:</strong> {userData.gender}</div>
                    <div><strong>Blood Group:</strong> {userData.bloodGroup}</div>
                    <div><strong>Address:</strong> {userData.address}</div>
                    <div><strong>Medical Issue:</strong> {userData.medicalProblem}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#333', margin: '20px auto 30px' }}>
            Your health journey starts here. Book appointments, upload files, view prescriptions, manage billing, and track your medical history — all in one secure place.
          </p>

          <footer style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
            &copy; 2025 HealthHub. Your Trusted Healthcare Partner.
          </footer>
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;