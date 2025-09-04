// src/Dashboards/Patient/Prescriptions.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  // ✅ Load received prescription IDs
  const [receivedPrescriptions, setReceivedPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('patient_received_prescriptions');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (err) {
      console.error('Failed to load received prescriptions', err);
      return new Set();
    }
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/prescription/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setPrescriptions(data);
        }
      } catch (err) {
        console.error('Network error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [token]);

  // ✅ Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('patient_received_prescriptions', JSON.stringify([...receivedPrescriptions]));
    } catch (err) {
      console.error('Failed to save received prescriptions', err);
    }
  }, [receivedPrescriptions]);

  const handleMarkReceived = (prescriptionId) => {
    setReceivedPrescriptions(prev => new Set([...prev, prescriptionId]));
  };

  // ✅ Filter out received prescriptions
  const visiblePrescriptions = prescriptions.filter(p => !receivedPrescriptions.has(p._id));

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f5f8fa',
      minHeight: '100vh',
      padding: '30px',
    }}>
      <style>{`
        .container { max-width: 1000px; margin: 0 auto; }
        .back-link { color: #1e88e5; text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .back-link:hover { text-decoration: underline; }
        .header h1 { color: #0d47a1; }

        .presc-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .presc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .presc-header h3 { margin: 0; color: #0d47a1; }
        .presc-meta {
          font-size: 0.9rem;
          color: '#555';
          margin-bottom: 15px;
        }
        .med-list {
          margin: 10px 0;
        }
        .med-item {
          padding: 10px;
          background: #f9f9f9;
          border-left: 4px solid #1e88e5;
          margin-bottom: 8px;
          border-radius: 4px;
        }
        .med-name {
          font-weight: bold;
          color: #0d47a1;
        }
        .med-details {
          font-size: 0.95rem;
          color: #333;
          margin: 4px 0;
        }
        .notes {
          font-style: italic;
          color: #666;
          margin-top: 10px;
        }
        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: bold;
        }
        .status.active {
          background: #e3f2fd;
          color: #0d47a1;
        }
        .status.completed {
          background: #e8f5e8;
          color: #2e7d32;
        }
        .btn-received {
          background: #4caf50;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .btn-received:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .empty { text-align: center; color: #777; margin-top: 40px; }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="header">
          <h1>My Prescriptions</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            View all prescriptions issued by your doctors after appointments.
          </p>
        </div>

        {loading ? (
          <p className="empty">Loading prescriptions...</p>
        ) : visiblePrescriptions.length > 0 ? (
          visiblePrescriptions.map((p) => (
            <div className="presc-item" key={p._id}>
              <div className="presc-header">
                <h3>Prescribed by Dr. {p.doctorName}</h3>
                <span className={`status ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </div>

              <div className="presc-meta">
                <strong>Date:</strong> {new Date(p.issuedAt).toLocaleDateString()} &nbsp;|&nbsp;
                <strong>Appointment:</strong> #{p.appointmentId.toString().slice(-6)}
              </div>

              <div className="med-list">
                <strong>Medicines:</strong>
                {p.medicines.map((med, idx) => (
                  <div className="med-item" key={idx}>
                    <div className="med-name">{med.name}</div>
                    <div className="med-details">
                      <strong>Dosage:</strong> {med.dosage} &nbsp;|&nbsp;
                      <strong>Frequency:</strong> {med.frequency} &nbsp;|&nbsp;
                      <strong>Duration:</strong> {med.duration}
                    </div>
                    {med.instructions && (
                      <div className="med-details">
                        <strong>Instructions:</strong> {med.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {p.notes && (
                <div className="notes">
                  <strong>Doctor's Notes:</strong> {p.notes}
                </div>
              )}

              <div style={{ marginTop: '15px' }}>
                <button
                  className="btn-received"
                  onClick={() => handleMarkReceived(p._id)}
                  disabled={receivedPrescriptions.has(p._id)}
                >
                  {receivedPrescriptions.has(p._id) ? '✅ Received' : 'Mark as Received'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">No active prescriptions. All received prescriptions are moved to History.</p>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;