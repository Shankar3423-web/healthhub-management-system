// src/Dashboards/Patient/History.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch medical history
        const historyRes = await fetch('http://localhost:5000/api/history/history', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        // Fetch prescriptions
        const prescRes = await fetch('http://localhost:5000/api/prescription/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        let historyData = [];
        let prescData = [];

        if (historyRes.ok) {
          historyData = await historyRes.json();
        }

        if (prescRes.ok) {
          prescData = await prescRes.json();
        }

        // Get received prescription IDs
        const receivedPrescriptions = new Set(
          JSON.parse(localStorage.getItem('patient_received_prescriptions') || '[]')
        );

        // Filter only received prescriptions
        const receivedPrescs = prescData.filter(p => receivedPrescriptions.has(p._id));

        // Merge data: history + received prescriptions
        const merged = [
          ...historyData.map(apt => ({ ...apt, type: 'appointment' })),
          ...receivedPrescs.map(p => ({
            type: 'prescription',
            doctorName: p.doctorName,
            date: p.issuedAt,
            prescription: p,
            status: 'Completed',
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setHistory(merged);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return <span style={{
        backgroundColor: '#e8f5e8',
        color: '#2e7d32',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: 'bold'
      }}>✅ Completed</span>;
    }
    return <span style={{
      backgroundColor: '#fff3e0',
      color: '#e65100',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 'bold'
    }}>🟡 Pending</span>;
  };

  const getDocumentStatus = (hasDocuments) => {
    return hasDocuments ? (
      <span style={{
        color: 'green',
        fontWeight: '500'
      }}>📄 Uploaded</span>
    ) : (
      <span style={{ color: '#999' }}>No documents</span>
    );
  };

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

        .history-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .history-header h3 { margin: 0; color: #0d47a1; }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          font-size: 0.95rem;
          color: #555;
        }
        .info-grid div strong {
          color: #0d47a1;
          width: 130px;
          display: inline-block;
        }
        .doc-status {
          margin-top: 8px;
          font-size: 0.9rem;
        }
        .empty { text-align: center; color: #777; margin-top: 40px; }
        .presc-view {
          margin-top: 10px;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 6px;
          border-left: 3px solid #1e88e5;
        }
        .presc-med {
          margin: 6px 0;
          font-size: 0.95rem;
        }
        .presc-med strong {
          color: #0d47a1;
        }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="header">
          <h1>Medical History</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Track your past appointments and received prescriptions.
          </p>
        </div>

        {loading ? (
          <p className="empty">Loading medical history...</p>
        ) : history.length > 0 ? (
          history.map((item, index) => (
            <div className="history-item" key={index}>
              <div className="history-header">
                <h3>Dr. {item.doctorName}</h3>
                {getStatusBadge('Completed')}
              </div>

              <div className="info-grid">
                <div><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</div>
                <div><strong>Type:</strong> {item.type === 'appointment' ? 'Consultation' : 'Prescription'}</div>
                {item.type === 'appointment' && (
                  <>
                    <div><strong>Fee:</strong> ₹{item.consultationFee}</div>
                    <div><strong>Paid:</strong> {item.paymentStatus === 'Paid' ? '✅ Yes' : '❌ No'}</div>
                  </>
                )}
              </div>

              {item.type === 'prescription' && (
                <div className="presc-view">
                  <strong>Prescription Details:</strong>
                  {item.prescription.medicines.map((med, idx) => (
                    <div className="presc-med" key={idx}>
                      {med.name} - {med.dosage}, {med.frequency} for {med.duration}
                      {med.instructions && ` (${med.instructions})`}
                    </div>
                  ))}
                  {item.prescription.notes && (
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '6px' }}>
                      <strong>Notes:</strong> {item.prescription.notes}
                    </div>
                  )}
                </div>
              )}

              {item.type === 'appointment' && (
                <div className="doc-status">
                  <strong>Documents:</strong> {getDocumentStatus(item.hasDocuments)}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="empty">No medical history found.</p>
        )}
      </div>
    </div>
  );
};

export default History;