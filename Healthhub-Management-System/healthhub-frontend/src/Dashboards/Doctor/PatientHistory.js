// src/Dashboards/Doctor/PatientHistory.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctor/history', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          // ✅ Safety: Ensure only 'Paid' shows as paid
          const safeData = data.map(item => ({
            ...item,
            paymentStatus: item.paymentStatus === 'Paid' ? 'Paid' : 'Pending'
          }));
          setHistory(safeData);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f5f8fa',
      minHeight: '100vh',
      padding: '30px',
    }}>
      <style>{`
        .container { max-width: 1200px; margin: 0 auto; }
        .back-link { color: #1e88e5; text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .back-link:hover { text-decoration: underline; }
        h1 { color: #0d47a1; }

        .table { width: 100%; background: white; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .table th { background: #e3f2fd; color: #0d47a1; }
        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: bold;
        }
        .status-paid { background: #e8f5e8; color: #2e7d32; }
        .status-pending { background: #fff3e0; color: #e65100; }
        .status-yes { background: #e8f5e8; color: #2e7d32; }
        .status-no { background: #ffebee; color: #c62828; }
        .empty { text-align: center; color: #777; padding: 40px; }
      `}</style>

      <div className="container">
        <Link to="/doctor-dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>📋 Patient History</h1>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : history.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th>Date</th>
                <th>Medical Issue</th>
                <th>Fee</th>
                <th>Paid</th>
                <th>Prescription Issued</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h._id}>
                  <td>{h.patientName}</td>
                  <td>{h.patientId}</td>
                  <td>{new Date(h.date).toLocaleDateString()}</td>
                  <td>{h.medicalProblem}</td>
                  <td>₹{h.consultationFee}</td>
                  <td>
                    <span className={`status-badge status-${h.paymentStatus === 'Paid' ? 'paid' : 'pending'}`}>
                      {h.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${h.prescriptionIssued ? 'yes' : 'no'}`}>
                      {h.prescriptionIssued ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty">No completed appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;