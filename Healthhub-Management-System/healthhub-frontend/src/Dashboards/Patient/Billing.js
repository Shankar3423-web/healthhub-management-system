// src/Dashboards/Patient/Billing.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Billing = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/billing/appointments', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const handlePayment = async (apt) => {
    if (!window.confirm(`Pay ₹${apt.consultationFee} for Dr. ${apt.doctorName}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/billing/pay/${apt._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const updated = await res.json();
        setAppointments(appointments.map(a => a._id === apt._id ? updated : a));
        alert('Payment successful!');
      } else {
        alert('Payment failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const totalDue = appointments
    .filter(a => a.billingStatus !== 'Paid' && a.status !== 'Cancelled')
    .reduce((sum, a) => sum + a.consultationFee, 0);

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f5f8fa',
      minHeight: '100vh',
      padding: '30px',
    }}>
      <style>{`
        .container { max-width: 900px; margin: 0 auto; }
        .back-link { color: #1e88e5; text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .back-link:hover { text-decoration: underline; }
        .header h1 { color: #0d47a1; }

        .bill-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .bill-info h3 { margin: 0 0 6px; color: #0d47a1; }
        .bill-info p { margin: 5px 0; color: #555; font-size: 0.95rem; }
        .amount { font-size: 1.2rem; font-weight: bold; color: #0d47a1; }
        .status {
          font-size: 0.9rem;
          padding: 4px 12px;
          border-radius: 12px;
          background: #fff3e0; color: #e65100;
        }
        .status.paid { background: #e8f5e8; color: #2e7d32; }
        .pay-btn {
          background: #1e88e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;
        }
        .pay-btn:hover { background: #0d47a1; }
        .pay-btn[disabled] { background: #ccc; cursor: not-allowed; }
        .total { text-align: right; font-size: 1.2rem; font-weight: bold; margin-top: 20px; color: #0d47a1; }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="header">
          <h1>My Billing</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : appointments.length > 0 ? (
          <>
            {appointments.map((apt) => (
              <div className="bill-item" key={apt._id}>
                <div className="bill-info">
                  <h3>Dr. {apt.doctorName}</h3>
                  <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                  <p><strong>Fee:</strong> ₹{apt.consultationFee}</p>
                  <span className={`status ${apt.billingStatus === 'Paid' ? 'paid' : ''}`}>
                    {apt.status === 'Cancelled' ? 'Cancelled' : apt.billingStatus || 'Pending'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="amount">₹{apt.consultationFee}</div>
                  <button
                    className="pay-btn"
                    disabled={apt.billingStatus === 'Paid' || apt.status === 'Cancelled'}
                    onClick={() => handlePayment(apt)}
                  >
                    {apt.billingStatus === 'Paid' ? 'Paid' : 'Pay Now'}
                  </button>
                </div>
              </div>
            ))}

            <div className="total">
              Total Due: ₹{totalDue}
            </div>
          </>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Billing;