// src/Dashboards/Doctor/AddPrescription.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AddPrescription = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctor/patients', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();

          // ✅ FRONTEND SAFETY: Force paymentStatus to 'Pending' if not truly 'Paid'
          const safeData = data.map(p => ({
            ...p,
            paymentStatus: p.paymentStatus === 'Paid' ? 'Paid' : 'Pending'
          }));

          setPatients(safeData);
        }
      } catch (err) {
        console.error('Failed to load patients', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [token]);

  const handleComplete = async (aptId) => {
    if (!window.confirm(`Mark ${selectedPatient.patientName}'s appointment as completed?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/doctor/appointments/complete/${aptId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        // ✅ Refetch to sync with backend
        const fetchRes = await fetch('http://localhost:5000/api/doctor/patients', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (fetchRes.ok) {
          const updatedPatients = await fetchRes.json();
          // ✅ Apply same safety
          const safeData = updatedPatients.map(p => ({
            ...p,
            paymentStatus: p.paymentStatus === 'Paid' ? 'Paid' : 'Pending'
          }));
          setPatients(safeData);
          const stillActive = safeData.find(p => p.appointmentId === selectedPatient.appointmentId);
          setSelectedPatient(stillActive ? { ...stillActive } : null);
        }

        alert('Appointment completed and moved to history');
      } else {
        const error = await res.json();
        alert('Error: ' + error.msg);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f5f8fa',
      minHeight: '100vh',
      padding: '30px',
    }}>
      <style>{`
        .container { max-width: 1200px; margin: 0 auto; display: flex; gap: 20px; }
        .back-link { color: #1e88e5; text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .back-link:hover { text-decoration: underline; }
        .header h1 { color: #0d47a1; }

        .patients-list {
          flex: 1;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
        }
        .patient-item {
          padding: 15px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }
        .patient-item:hover { background: #f5f5f5; }
        .patient-item.selected { background: #e3f2fd; }
        .patient-name { font-weight: bold; color: #0d47a1; }
        .patient-id { font-size: 0.9rem; color: '#555'; }

        .details-panel {
          flex: 2;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 25px;
        }
        .details-panel h2 { color: #0d47a1; margin-top: 0; }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .info-grid div strong {
          color: #0d47a1;
          width: 130px;
          display: inline-block;
        }
        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: bold;
          display: inline-block;
          margin-left: 10px;
        }
        .status-paid { background: #e8f5e8; color: #2e7d32; }
        .status-pending { background: #fff3e0; color: #e65100; }

        .actions { margin-top: 30px; }
        .btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px; font-size: 1rem; }
        .btn-prescribe { background: #4caf50; color: white; }
        .btn-docs { background: #1e88e5; color: white; }
        .btn-complete { background: #d32f2f; color: white; }
        .empty { text-align: center; color: #777; }
      `}</style>

      <div className="container">
        <Link to="/doctor-dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="patients-list">
          <h2>Patient List</h2>
          {loading ? (
            <p className="empty">Loading patients...</p>
          ) : patients.length > 0 ? (
            patients.map((p) => (
              <div
                className={`patient-item ${selectedPatient?.appointmentId === p.appointmentId ? 'selected' : ''}`}
                key={p.appointmentId}
                onClick={() => handleSelectPatient(p)}
              >
                <div className="patient-name">{p.patientName}</div>
                <div className="patient-id">ID: {p.patientId}</div>
                <div>Problem: {p.medicalProblem}</div>
              </div>
            ))
          ) : (
            <p className="empty">No patients booked.</p>
          )}
        </div>

        <div className="details-panel">
          {selectedPatient ? (
            <>
              <h2>Patient Details</h2>
              <div className="info-grid">
                <div><strong>Name:</strong> {selectedPatient.patientName}</div>
                <div><strong>Patient ID:</strong> {selectedPatient.patientId}</div>
                <div><strong>Contact:</strong> {selectedPatient.contact}</div>
                <div><strong>Age:</strong> {selectedPatient.age}</div>
                <div><strong>Gender:</strong> {selectedPatient.gender}</div>
                <div><strong>Medical Issue:</strong> {selectedPatient.medicalProblem}</div>
                <div><strong>Appointment Date:</strong> {new Date(selectedPatient.date).toLocaleDateString()}</div>
                <div>
                  <strong>Fee:</strong> ₹{selectedPatient.consultationFee}
                  <span className={`status-badge ${selectedPatient.paymentStatus === 'Paid' ? 'status-paid' : 'status-pending'}`}>
                    {selectedPatient.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn btn-prescribe"
                  onClick={() =>
                    navigate('/doctor/give-prescription', {
                      state: { patient: selectedPatient },
                    })
                  }
                >
                  Add Prescription
                </button>

                <button
                  className="btn btn-docs"
                  onClick={() =>
                    navigate('/doctor/uploaded-files', {
                      state: { patient: selectedPatient },
                    })
                  }
                >
                  Check Uploaded Documents
                </button>

                <button
                  className="btn btn-complete"
                  onClick={() => handleComplete(selectedPatient.appointmentId)}
                >
                  Complete
                </button>
              </div>
            </>
          ) : (
            <p className="empty">Select a patient to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPrescription;