// src/Dashboards/Doctor/CheckAppointments.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CheckAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user.email) {
        console.error('No user email found');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/doctor/appointments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        } else {
          const error = await res.json();
          console.error('API Error:', error.msg);
        }
      } catch (err) {
        console.error('Network error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, user.email]);

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f5f8fa',
      minHeight: '100vh',
      padding: '30px',
    }}>
      <style>{`
        .container { max-width: 1100px; margin: 0 auto; }
        .back-link { color: #1e88e5; text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .back-link:hover { text-decoration: underline; }
        .header h1 { color: #0d47a1; }

        .appointment-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .patient-info h3 { margin: 0 0 8px; color: #0d47a1; }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          font-size: 0.95rem;
          color: #555;
        }
        .info-grid div strong {
          color: #0d47a1;
          width: 140px;
          display: inline-block;
        }
        .date-box {
          background: #e3f2fd;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
          color: #0d47a1;
        }
        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: bold;
          margin-top: 8px;
        }
        .status.booked { background: #e8f5e8; color: #2e7d32; }
        .empty { text-align: center; color: #777; margin-top: 40px; }
      `}</style>

      <div className="container">
        <Link to="/doctor-dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="header">
          <h1>My Appointments</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            View all patients who have booked appointments with you.
          </p>
        </div>

        {loading ? (
          <p className="empty">Loading appointments...</p>
        ) : appointments.length > 0 ? (
          appointments.map((apt) => (
            <div className="appointment-card" key={apt.appointmentId}>
              <div className="patient-info">
                <h3>{apt.patientName}</h3>
                <div className="info-grid">
                  <div><strong>Patient ID:</strong> {apt.patientId}</div>
                  <div><strong>Contact:</strong> {apt.contact}</div>
                  <div><strong>Age:</strong> {apt.age}</div>
                  <div><strong>Gender:</strong> {apt.gender}</div>
                  <div><strong>Medical Issue:</strong> {apt.medicalProblem}</div>
                  <div><strong>Fee:</strong> ₹{apt.consultationFee}</div>
                </div>
                <div className="status booked">Booked</div>
              </div>
              <div className="date-box">
                <div>Date</div>
                <div style={{ fontSize: '1.4rem' }}>
                  {new Date(apt.date).toLocaleDateString('en-US', { day: '2-digit' })}
                </div>
                <div>
                  {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">No appointments booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default CheckAppointments;