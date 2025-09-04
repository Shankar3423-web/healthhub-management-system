// src/Dashboards/staff/viewdoctors.js
import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

// ✅ Must start with uppercase
const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      setDoctors([]);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('❌ Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const url = `${API_BASE}/api/doctors/view/all`;
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
            throw new Error('🔐 Session expired. Please log in again.');
          } else {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}...`);
          }
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        } else {
          setError('📭 No doctors are currently available.');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('❌ ' + (err.message || 'Failed to load doctor list'));
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>👨‍⚕️ Available Doctors</h3>
        <p>🔄 Loading doctor list from server...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>👨‍⚕️ Available Doctors</h3>

      {error ? (
        <div style={styles.errorBox}>
          <strong>{error}</strong>
        </div>
      ) : (
        <ul style={styles.list}>
          {doctors.map((doc, index) => (
            <li key={index} style={styles.item}>
              <strong>🧑‍⚕️ {doc.name}</strong> (ID: {doc.doctorId}) |
              <strong> {doc.specialization}</strong> |
              <strong> 💰 ₹{doc.consultationFee}</strong> |
              <strong> 📅 {doc.availableDays?.join(', ')}</strong> |
              <strong> ⏰ {doc.availableTime}</strong>
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
  errorBox: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '16px',
    borderRadius: '6px',
    fontSize: '0.95rem',
  },
};

export default ViewDoctors;