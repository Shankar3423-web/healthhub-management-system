// src/Dashboards/Doctor/GivePrescription.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GivePrescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const { patient } = location.state || {};
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [notes, setNotes] = useState('');
  const [prescriptionAdded, setPrescriptionAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Move useEffect to the top — before any conditional return
  useEffect(() => {
    if (!patient) return; // ✅ Now safe: just exit early

    const checkPrescription = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/prescription/patient/${patient.patientId}/appointment/${patient.appointmentId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.exists) {
            setPrescriptionAdded(true);
          }
        }
      } catch (err) {
        console.error('Failed to check prescription', err);
      } finally {
        setLoading(false);
      }
    };

    checkPrescription();
  }, [token, patient]);

  // ✅ Now handle conditional render
  if (!patient) {
    return (
      <div style={containerStyle}>
        <p style={{ color: 'red' }}>No patient data found.</p>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>← Go Back</button>
      </div>
    );
  }

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload = {
      appointmentId: patient.appointmentId,
      medicines,
      notes,
    };

    try {
      const res = await fetch('http://localhost:5000/api/prescription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Failed: ' + error.msg);
        return;
      }

      setPrescriptionAdded(true);
      alert('Prescription saved successfully!');
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <p style={{ textAlign: 'center', color: '#555' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style>{formStyles}</style>

      <div style={headerStyle}>
        <h1>📝 Prescription for {patient.patientName}</h1>
        <p><strong>Patient ID:</strong> {patient.patientId}</p>
      </div>

      {prescriptionAdded ? (
        <div style={successMessageStyle}>
          <h2>✅ Prescription Added</h2>
          <p>The prescription has been successfully saved for this patient.</p>
          <button
            onClick={() => navigate('/doctor/checkup-prescription')}
            style={backButtonStyle}
          >
            ← Back to Patient List
          </button>
        </div>
      ) : (
        <>
          <div style={formSectionStyle}>
            <h2>Medicines</h2>
            {medicines.map((med, index) => (
              <div key={index} style={medicineRowStyle}>
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={med.name}
                  onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                  style={{ ...inputStyle, width: '25%' }}
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g., 500mg)"
                  value={med.dosage}
                  onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                  style={{ ...inputStyle, width: '15%' }}
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g., 2 times/day)"
                  value={med.frequency}
                  onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                  style={{ ...inputStyle, width: '20%' }}
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 7 days)"
                  value={med.duration}
                  onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                  style={{ ...inputStyle, width: '15%' }}
                />
                <input
                  type="text"
                  placeholder="Instructions (e.g., After meals)"
                  value={med.instructions}
                  onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                  style={{ ...inputStyle, width: '15%' }}
                />
                <button onClick={() => removeMedicine(index)} style={removeButtonStyle}>×</button>
              </div>
            ))}
            <button onClick={addMedicine} style={addMedButtonStyle}>+ Add Medicine</button>
          </div>

          <div style={formSectionStyle}>
            <h2>Additional Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Doctor's notes, follow-up advice, etc."
              style={textareaStyle}
            />
          </div>

          <div style={buttonGroupStyle}>
            <button onClick={() => navigate(-1)} style={cancelButtonStyle}>Cancel</button>
            <button onClick={handleSubmit} style={saveButtonStyle}>💾 Save Prescription</button>
          </div>
        </>
      )}
    </div>
  );
};

// Styles (unchanged)
const containerStyle = {
  fontFamily: 'Segoe UI, sans-serif',
  background: '#f5f8fa',
  minHeight: '100vh',
  padding: '30px',
};

const headerStyle = {
  marginBottom: '30px',
  color: '#0d47a1',
};

const formSectionStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const medicineRowStyle = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  marginBottom: '10px',
  flexWrap: 'wrap',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
};

const removeButtonStyle = {
  background: '#d32f2f',
  color: 'white',
  border: 'none',
  width: '40px',
  height: '40px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const addMedButtonStyle = {
  background: '#1e88e5',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const textareaStyle = {
  width: '100%',
  height: '120px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
  resize: 'vertical',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  marginTop: '30px',
};

const cancelButtonStyle = {
  background: '#999',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const saveButtonStyle = {
  background: '#4caf50',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const backButtonStyle = {
  ...cancelButtonStyle,
  display: 'inline-block',
  marginTop: '20px',
};

const successMessageStyle = {
  textAlign: 'center',
  padding: '40px',
  background: '#e8f5e8',
  borderRadius: '12px',
  margin: '20px 0',
  color: '#2e7d32',
};

const formStyles = `
  input:focus, textarea:focus { outline: 2px solid #1e88e5; }
`;

export default GivePrescription;