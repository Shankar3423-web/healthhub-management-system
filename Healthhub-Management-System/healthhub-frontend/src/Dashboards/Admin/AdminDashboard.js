// AdminDashboard.js - Fully self-contained with styles and navigation

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Added: for logout navigation
import PatientManagement from './PatientManagement';     // ✅ Already exists
import DoctorManagement from './DoctorManagement';       // ✅ Already imported
import Requests from './Requests';                       // ✅ Already imported
import StaffManagement from './StaffManagement';         // ✅ Already imported
import AdminManagement from './AdminManagement';         // ✅ Already imported
import AssignRole from './AssignRole';                   // ✅ NEW: Import AssignRole

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Controls which section is shown
  const navigate = useNavigate(); // ✅ Initialize navigate

  // === Inline CSS-in-JS Styles (All in one file) ===
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f4f6f9',
    },

    // Sidebar Styles
    sidebar: {
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: '#1a2238',
      color: '#eaeaea',
      padding: '20px 0',
      boxShadow: '2px 0 15px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
    },

    logo: {
      textAlign: 'center',
      fontSize: '1.7rem',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#9d2235',
      textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
    },

    navButton: {
      display: 'block',
      width: '90%',
      margin: '10px auto',
      padding: '14px 20px',
      backgroundColor: '#2d3748',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },

    navButtonHover: {
      backgroundColor: '#4a5568',
    },

    navButtonActive: {
      backgroundColor: '#9d2235',
      fontWeight: 'bold',
      borderLeft: '4px solid #ff6b6b',
    },

    // ✅ Style for Logout Button
    logoutButton: {
      marginTop: 'auto',
      display: 'block',
      width: '90%',
      margin: '20px auto',
      padding: '14px 20px',
      backgroundColor: '#c62828',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      textAlign: 'center',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'background 0.3s ease',
    },

    logoutButtonHover: {
      backgroundColor: '#b71c1c',
    },

    // Main Content Area
    mainContent: {
      marginLeft: '280px',
      padding: '30px',
      flex: 1,
      backgroundColor: '#f8f9fa',
    },

    pageTitle: {
      fontSize: '1.8rem',
      color: '#1a2238',
      marginBottom: '20px',
      fontWeight: '600',
      borderBottom: '2px solid #9d2235',
      paddingBottom: '8px',
    },

    section: {
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      minHeight: '500px',
    },
  };

  // === Navigation Menu Buttons ===
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'patients', label: 'Patient Management' },
    { id: 'doctors', label: 'Doctor Management' },
    { id: 'staff', label: 'Staff Management' },
    { id: 'requests', label: 'Approval Requests' },
    { id: 'admin', label: 'Admin Management' },
    { id: 'assignRole', label: 'Assign Role to Staff' }, // ✅ ADDED: New button
  ];

  // === Render Active Component ===
  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return <PatientManagement />;

      case 'doctors':
        return <DoctorManagement />;

      case 'staff':
        return <StaffManagement />;

      case 'requests':
        return <Requests />;

      case 'admin':
        return <AdminManagement />;

      case 'assignRole': // ✅ ADDED: Render AssignRole component
        return <AssignRole />;

      default:
        return (
          <div style={styles.section}>
            <h3>🏥 Welcome to HealthHub Admin Panel</h3>
            <p>Select a module from the sidebar to manage hospital data.</p>
            <div style={{ marginTop: '20px', fontSize: '0.95rem', color: '#555' }}>
              <strong>Quick Stats:</strong> "Hello Admin! Monitor and manage doctors, staff, and patients, and take quick action on pending approvals."
            </div>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      {/* === Sidebar with Navigation Buttons === */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🏥 HealthHub Admin</div>

        {navItems.map((item) => (
          <button
            key={item.id}
            style={{
              ...styles.navButton,
              ...(activeTab === item.id ? styles.navButtonActive : {}),
            }}
            onMouseEnter={(e) => {
              if (activeTab !== item.id) e.target.style.backgroundColor = '#4a5568';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== item.id) e.target.style.backgroundColor = '#2d3748';
            }}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}

        {/* ✅ Logout Button */}
        <button
          style={styles.logoutButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#c62828')}
          onClick={() => {
            // Clear auth data
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            // Redirect to login
            navigate('/login');
          }}
        >
          🔐 Logout
        </button>
      </aside>

      {/* === Main Content Area === */}
      <main style={styles.mainContent}>
        <h2 style={styles.pageTitle}>
          {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
        </h2>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;