// src/Dashboards/staff/StaffDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TodayAssignedRole from './TodayAssignedRole';
import ViewAppointments from './viewappointments'; // ✅ Correct import
import ViewDoctors from './viewdoctors'; // ✅ NEW: Import ViewDoctors

const API_BASE = 'http://localhost:5000';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard');
  const [staffProfile, setStaffProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Load user and validate role
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'staff') {
        const redirect = {
          admin: '/admin-dashboard',
          doctor: '/doctor-dashboard',
          patient: '/patient-dashboard',
        }[parsedUser.role] || '/login';
        navigate(redirect, { replace: true });
        return;
      }
      setUser(parsedUser);
    } catch (err) {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      navigate('/login', { replace: true });
    }

    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // ✅ Fetch staff profile using email
  useEffect(() => {
    const fetchStaffProfile = async () => {
      setLoadingProfile(true);
      setFetchError('');
      setStaffProfile(null);

      if (!user?.email) {
        setFetchError('User email not found. Please log in again.');
        setLoadingProfile(false);
        return;
      }

      try {
        const url = `${API_BASE}/api/staff/all`;
        const token = localStorage.getItem('authToken');

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'x-auth-token': token } : {}),
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}...`);
        }

        const staffList = await res.json();

        const myProfile = staffList.find(
          (staff) => staff.email?.toLowerCase() === user.email.toLowerCase()
        );

        if (myProfile) {
          setStaffProfile(myProfile);
          localStorage.setItem('staffId', myProfile.staffId);
          const fallbackData = {
            staffDesignation: myProfile.designation,
            staffDepartment: myProfile.department,
            staffContactNumber: myProfile.contactNumber,
            staffJoiningDate: myProfile.joiningDate ? new Date(myProfile.joiningDate).toLocaleDateString() : 'Not Set',
            staffBloodGroup: myProfile.bloodGroup,
            staffEmergencyContact: myProfile.emergencyContact,
            staffAddress: myProfile.address,
            staffQualification: myProfile.qualification,
            staffExperience: myProfile.experience,
            staffDob: myProfile.dob ? new Date(myProfile.dob).toLocaleDateString() : 'Not Set',
            staffAge: myProfile.age,
            staffGender: myProfile.gender,
          };
          Object.entries(fallbackData).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value);
          });
        } else {
          setFetchError(`❌ Profile not found for email: ${user.email}`);
        }
      } catch (err) {
        console.error('Failed to fetch staff profile:', err);
        if (err.message.includes('Failed to fetch')) {
          setFetchError('⚠️ Cannot connect to server. Is backend running at http://localhost:5000?');
        } else if (err.message.includes('401') || err.message.includes('403')) {
          setFetchError('🔐 Session expired. Please log in again.');
        } else {
          setFetchError('❌ ' + (err.message || 'Unknown error'));
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchStaffProfile();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const goToProfile = () => {
    setActiveSection('profile');
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Parse static data
  let patients = [];
  let doctors = [];
  let appointments = [];

  try {
    patients = JSON.parse(localStorage.getItem('patients') || '[]');
  } catch (e) { console.warn('Failed to parse patients'); }

  try {
    doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
  } catch (e) { console.warn('Failed to parse doctors'); }

  try {
    appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  } catch (e) { console.warn('Failed to parse appointments'); }

  const today = new Date().toISOString().split('T')[0];
  const todaysApps = appointments.filter((app) => app.date === today);
  const availableDoctors = doctors.filter((d) => d.status === 'available');

  const staffId = staffProfile?.staffId || localStorage.getItem('staffId') || 'N/A';

  // Render content
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        if (loadingProfile) {
          return (
            <div style={styles.contentCard}>
              <h3 style={styles.contentTitle}>👤 Staff Profile</h3>
              <p>🔄 Loading your profile from server...</p>
            </div>
          );
        }

        if (fetchError) {
          return (
            <div style={styles.contentCard}>
              <h3 style={styles.contentTitle}>👤 Staff Profile</h3>
              <p style={styles.error}>{fetchError}</p>
            </div>
          );
        }

        if (staffProfile) {
          return (
            <div style={styles.contentCard}>
              <h3 style={styles.contentTitle}>👤 Staff Profile</h3>
              <div style={styles.profileGrid}>
                <p><strong>Name:</strong> {staffProfile.name}</p>
                <p><strong>Email:</strong> {staffProfile.email}</p>
                <p><strong>Staff ID:</strong> {staffProfile.staffId}</p>
                <p><strong>Designation:</strong> {staffProfile.designation || 'Not Assigned'}</p>
                <p><strong>Department:</strong> {staffProfile.department || 'Not Assigned'}</p>
                <p><strong>Phone:</strong> {staffProfile.contactNumber || 'Not Provided'}</p>
                <p><strong>Age:</strong> {staffProfile.age || 'N/A'}</p>
                <p><strong>Gender:</strong> {staffProfile.gender || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {staffProfile.dob ? new Date(staffProfile.dob).toLocaleDateString() : 'Not Set'}</p>
                <p><strong>Blood Group:</strong> {staffProfile.bloodGroup || 'Not Set'}</p>
                <p><strong>Joining Date:</strong> {staffProfile.joiningDate ? new Date(staffProfile.joiningDate).toLocaleDateString() : 'Not Set'}</p>
                <p><strong>Qualification:</strong> {staffProfile.qualification || 'Not Set'}</p>
                <p><strong>Experience:</strong> {staffProfile.experience ? `${staffProfile.experience} years` : 'Not Set'}</p>
                <p><strong>Emergency Contact:</strong> {staffProfile.emergencyContact || 'Not Set'}</p>
                <p><strong>Address:</strong> {staffProfile.address || 'Not Set'}</p>
                <p><strong>Status:</strong>
                  <span style={{
                    marginLeft: '8px',
                    color: staffProfile.status === 'approved' ? '#388e3c' : '#f57c00',
                    fontWeight: 'bold'
                  }}>
                    {staffProfile.status?.charAt(0).toUpperCase() + staffProfile.status?.slice(1)}
                  </span>
                </p>
                <p><strong>Available Time:</strong> {staffProfile.availableTime || 'Not Set'}</p>
                <p><strong>Available Days:</strong> {staffProfile.availableDays?.join(', ') || 'Not Set'}</p>
              </div>
            </div>
          );
        }

        return <p>No profile data found.</p>;

      case 'assignedRole':
        return <TodayAssignedRole />;

      // ✅ Replace with ViewDoctors component
      case 'availableDoctors':
        return <ViewDoctors />;

      // ✅ Use ViewAppointments
      case 'bookedAppointments':
        return <ViewAppointments />;

      default:
        return (
          <div style={styles.contentCard}>
            <h3 style={styles.contentTitle}>🏡 Welcome, {user?.name}!</h3>
            <p>{greeting()}, you're logged in as <strong>{staffId}</strong>.</p>
            <p style={{ lineHeight: '1.6', marginTop: '10px' }}>
              <strong>Efficient. Organized. Empowered.</strong><br />
              Your dashboard, your command center — where healthcare coordination begins.
            </p>
          </div>
        );
    }
  };

  if (!user) {
    return <div style={styles.loader}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Staff Dashboard</h1>
          <p style={styles.greeting}>
            {greeting()}, <strong>{user.name}</strong>! (ID: <code style={styles.code}>{staffId}</code>)
          </p>
        </div>
        <button onClick={goToProfile} style={styles.profileBtn}>
          👤 My Profile
        </button>
      </header>

      {/* Layout */}
      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <h4 style={styles.sidebarTitle}>📋 Menu</h4>
          <ul style={styles.navList}>
            <li>
              <button
                onClick={() => setActiveSection('dashboard')}
                style={activeSection === 'dashboard' ? { ...styles.navBtn, ...styles.activeBtn } : styles.navBtn}
              >
                🏠 Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('assignedRole')}
                style={activeSection === 'assignedRole' ? { ...styles.navBtn, ...styles.activeBtn } : styles.navBtn}
              >
                📋 Today’s Assigned Role
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('availableDoctors')}
                style={activeSection === 'availableDoctors' ? { ...styles.navBtn, ...styles.activeBtn } : styles.navBtn}
              >
                👨‍⚕️ View Available Doctors
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('bookedAppointments')}
                style={activeSection === 'bookedAppointments' ? { ...styles.navBtn, ...styles.activeBtn } : styles.navBtn}
              >
                ✅ Check Booked Appointments
              </button>
            </li>
            <li>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                🔐 Logout
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 HealthHub. Caring for your team, one patient at a time. 💚</p>
      </footer>
    </div>
  );
};

// === STYLES ===
const styles = {
  container: {
    backgroundColor: '#e8f5e9',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#2e7d32',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  header: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  title: {
    margin: '0',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  greeting: {
    margin: '5px 0 0',
    fontSize: '15px',
    opacity: 0.9,
  },
  code: {
    backgroundColor: '#4caf50',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  profileBtn: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  layout: {
    display: 'flex',
    flex: 1,
    padding: '20px',
    gap: '20px',
    flexWrap: 'wrap',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    flexShrink: 0,
  },
  sidebarTitle: {
    margin: '0 0 15px',
    fontSize: '16px',
    color: '#1b5e20',
    borderBottom: '2px solid #a5d6a7',
    paddingBottom: '6px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navBtn: {
    display: 'block',
    width: '100%',
    padding: '12px',
    margin: '6px 0',
    backgroundColor: '#f1f8e9',
    color: '#2e7d32',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    transition: 'background 0.3s',
  },
  activeBtn: {
    backgroundColor: '#2e7d32',
    color: 'white',
    fontWeight: 'bold',
  },
  logoutBtn: {
    marginTop: '20px',
    backgroundColor: '#c62828',
    color: 'white',
    border: 'none',
    padding: '12px',
    width: '100%',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  mainContent: {
    flex: 1,
    minWidth: '300px',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    border: '1px solid #c8e6c9',
    minHeight: '300px',
  },
  contentTitle: {
    margin: '0 0 16px',
    color: '#1b5e20',
    fontSize: '20px',
    borderBottom: '2px solid #a5d6a7',
    paddingBottom: '8px',
  },
  list: {
    paddingLeft: '20px',
    margin: '12px 0',
  },
  listItem: {
    margin: '8px 0',
    lineHeight: '1.6',
  },
  quickStats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '25px',
    gap: '15px',
    flexWrap: 'wrap',
  },
  statBox: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#f1f8e9',
    borderRadius: '8px',
    width: '120px',
    fontSize: '14px',
    border: '1px solid #c8e6c9',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    fontSize: '15px',
  },
  footer: {
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#2e7d32',
    color: 'white',
    fontSize: '13px',
    marginTop: 'auto',
  },
  loader: {
    textAlign: 'center',
    padding: '60px',
    color: '#2e7d32',
    fontSize: '18px',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
};

export default StaffDashboard;