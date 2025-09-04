import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const heroImage = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

  const containerStyle = {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
    color: 'white',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 1,
  };

  // Colored Header
  const headerStyle = {
    position: 'relative',
    zIndex: 3,
    padding: '16px 40px',
    backgroundColor: 'rgba(13, 71, 161, 0.95)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  };

  const titleStyleHeader = {
    fontSize: '1.7rem',
    fontWeight: '700',
    margin: 0,
    color: 'white',
    letterSpacing: '0.5px',
  };

  const buttonStyleHeader = {
    padding: '10px 22px',
    fontSize: '0.95rem',
    borderRadius: '25px',
    border: '2px solid rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const buttonHoverStyle = {
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(255, 255, 255, 0.25)',
    border: '2px solid white',
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    padding: '100px 20px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '3.8rem',
    fontWeight: '800',
    marginBottom: '16px',
    textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
    animation: 'fadeIn 1.4s ease-out',
  };

  const subtitleStyle = {
    fontSize: '1.4rem',
    maxWidth: '800px',
    margin: '0 auto 50px',
    textShadow: '1px 1px 6px rgba(0,0,0,0.7)',
    animation: 'fadeIn 1.8s ease-out',
    lineHeight: '1.6',
  };

  // Unified section style
  const sectionStyle = {
    position: 'relative',
    zIndex: 2,
    padding: '30px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  };

  const sectionTitleStyle = {
    fontSize: '2.3rem',
    color: 'white',
    marginBottom: '30px',
    fontWeight: '700',
    textShadow: '1px 1px 8px rgba(0,0,0,0.7)',
  };

  const boxContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px', // Reduced gap
  };

  const boxStyle = {
    flex: '1 1 230px',
    maxWidth: '280px',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    lineHeight: '1.6',
  };

  const boxIconStyle = {
    fontSize: 0, // Hide text
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const boxTitleStyle = {
    fontSize: '1.15rem',
    color: '#0d47a1',
    fontWeight: '600',
    marginBottom: '10px',
  };

  const boxContentStyle = {
    fontSize: '0.9rem',
    color: '#444',
    lineHeight: '1.55',
  };

  // Footer
  const footerStyle = {
    backgroundColor: '#0d47a1',
    color: 'white',
    textAlign: 'center',
    padding: '28px 20px',
    fontSize: '1.05rem',
    fontWeight: '500',
    position: 'relative',
    zIndex: 2,
    borderTop: '1px solid rgba(255,255,255,0.1)',
  };

  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .box:hover {
      transform: translateY(-6px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .box {
      cursor: default;
    }
  `;

  // Icons as inline SVGs
  const IconCalendar = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 8px' }}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#1e88e5" strokeWidth="2" />
      <path d="M3 10H21" stroke="#1e88e5" strokeWidth="2" />
      <path d="M8 2V6" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 2V6" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 16H10" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 16H16" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 12H14" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const IconRecords = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 8px' }}>
      <path d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L14 2Z" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12H15" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 16H15" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const IconTeam = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 8px' }}>
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13C16.8604 3.35031 17.6208 3.85071 18.1638 4.55123C18.7068 5.25174 19.0016 6.1128 19 7C19 9.20914 17.2091 11 15 11C14.0932 11 13.2432 10.732 12.5463 10.256" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconUser = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 8px' }}>
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconBook = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 8px' }}>
      <path d="M8 2V6" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 2V6" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10H21" stroke="#1e88e5" strokeWidth="2" />
      <rect x="3" y="6" width="18" height="14" rx="2" stroke="#1e88e5" strokeWidth="2" />
      <path d="M9 14H9.01" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 14H15.01" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 18H9.01" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 18H15.01" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const IconTrack = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 8px' }}>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1e88e5" strokeWidth="2" />
      <path d="M12 6V12L16 14" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <>
      <style>{animationStyles}</style>

      <div style={containerStyle}>
        <div style={overlayStyle}></div>

        {/* Header */}
        <header style={headerStyle}>
          <h2 style={titleStyleHeader}>Health Hub Management System</h2>
          <div>
            <button
              style={buttonStyleHeader}
              onClick={() => navigate('/signup')}
              onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'none',
                boxShadow: 'none',
                border: '2px solid rgba(255,255,255,0.4)',
              })}
            >
              Signup
            </button>
            <button
              style={buttonStyleHeader}
              onClick={() => navigate('/login')}
              onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'none',
                boxShadow: 'none',
                border: '2px solid rgba(255,255,255,0.4)',
              })}
            >
              Login
            </button>
          </div>
        </header>

        {/* Hero */}
        <div style={contentStyle}>
          <h1 style={titleStyle}>Welcome to HealthHub</h1>
          <p style={subtitleStyle}>
            Revolutionizing healthcare management with cutting-edge technology and compassionate care.
          </p>
        </div>

        {/* Why HealthHub? */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Why HealthHub?</h2>
          <div style={boxContainerStyle}>
            <div className="box" style={boxStyle}>
              <div style={boxIconStyle}><IconCalendar /></div>
              <h3 style={boxTitleStyle}>Efficient Appointments</h3>
              <p style={boxContentStyle}>
                Book, manage, and track doctor appointments seamlessly — no more missed visits or double bookings.
              </p>
            </div>
            <div className="box" style={boxStyle}>
              <div style={boxIconStyle}><IconRecords /></div>
              <h3 style={boxTitleStyle}>Centralized Records</h3>
              <p style={boxContentStyle}>
                Securely store and access patient history, prescriptions, and reports in one unified system.
              </p>
            </div>
            <div className="box" style={boxStyle}>
              <div style={boxIconStyle}><IconTeam /></div>
              <h3 style={boxTitleStyle}>Doctor Coordination</h3>
              <p style={boxContentStyle}>
                Enables smooth communication between doctors, patients, and staff for better care outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section style={{ ...sectionStyle, paddingTop: '20px', paddingBottom: '60px' }}>
          <h2 style={sectionTitleStyle}>How to Use</h2>
          <div style={boxContainerStyle}>
            <div className="box" style={boxStyle}>
              <div style={boxIconStyle}><IconUser /></div>
              <h3 style={boxTitleStyle}>1. Create Account</h3>
              <p style={boxContentStyle}>
                Sign up as a patient or doctor to access personalized features and services.
              </p>
            </div>
            <div className="box" style={boxStyle}>
              <div style={boxIconStyle}><IconBook /></div>
              <h3 style={boxTitleStyle}>2. Book Appointment</h3>
              <p style={boxContentStyle}>
                Choose a doctor, select a date, and describe your issue — all in minutes.
              </p>
            </div>
            <div className="box" style={boxStyle}>
              <div style={boxIconStyle}><IconTrack /></div>
              <h3 style={boxTitleStyle}>3. Manage & Track</h3>
              <p style={boxContentStyle}>
                View your appointments, medical records, and receive timely reminders.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={footerStyle}>
          © 2025 Health Hub Management System. Empowering healthcare through technology.
        </footer>
      </div>
    </>
  );
};

export default HomePage;