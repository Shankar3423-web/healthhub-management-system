// src/Dashboards/staff/viewappointments.js
import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

// ✅ Must start with uppercase
const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      setAppointments([]);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('❌ Authentication failed. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const url = `${API_BASE}/api/appointments/view/all`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Endpoint not found. Contact admin.');
          } else if (res.status === 401) {
            throw new Error('Session expired. Please log in again.');
          } else {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}`);
          }
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setAppointments(data);
        } else {
          setError('📭 No appointments have been booked yet.');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('❌ ' + (err.message || 'Failed to load appointments'));
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>📅 All Booked Appointments</h3>
        <p>🔄 Loading appointment data from server...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📅 All Booked Appointments</h3>

      {error ? (
        <div style={styles.errorBox}>
          <strong>{error}</strong>
        </div>
      ) : (
        <ul style={styles.list}>
          {appointments.map((app, index) => (
            <li key={index} style={styles.item}>
              <strong>📋 {app.patientName}</strong> (ID: {app.patientId}) |
              <strong> 🩺 Dr. {app.doctorName}</strong> ({app.doctorSpecialization}) |
              <strong> 📅 {new Date(app.date).toLocaleDateString()}</strong> @{' '}
              {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} |
              <span style={app.status === 'Booked' ? styles.statusBooked : styles.statusOther}>
                {app.status}
              </span> |
              💵 ₹{app.consultationFee}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// === STYLES ===
const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    border: '1px solid #c8e6c9',
    minHeight: '300px',
  },
  title: {
    margin: '0 0 16px',
    color: '#1b5e20',
    fontSize: '20px',
    borderBottom: '2px solid #a5d6a7',
    paddingBottom: '8px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    padding: '14px',
    margin: '6px 0',
    backgroundColor: '#f1f8e9',
    borderRadius: '8px',
    border: '1px solid #c8e6c9',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#2e7d32',
  },
  statusBooked: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  statusOther: {
    color: '#c62828',
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '16px',
    borderRadius: '6px',
    fontSize: '0.95rem',
  },
};

export default ViewAppointments;