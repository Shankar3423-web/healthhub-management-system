// src/components/BookAppointment.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [problem, setProblem] = useState(''); // New state for problem description
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/appointment/doctors', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        } else {
          setError('Failed to load doctors');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/appointment/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error('Failed to load appointments');
      }
    };

    fetchDoctors();
    fetchAppointments();
  }, [token]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDate('');
    setProblem('');
    setError('');
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !problem.trim()) {
      setError('Please select a doctor, enter your problem, and select a date');
      return;
    }

    const date = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setError('Please select a current or future date');
      return;
    }

    // Check if doctor is available on selected day
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (!selectedDoctor.availableDays.includes(day)) {
      setError(`Doctor is not available on ${day}s`);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/appointment/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          date: appointmentDate,
          problem, // Include problem in request
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setAppointments([result, ...appointments]);
        setAppointmentDate('');
        setProblem('');
        setError('');
        alert('Appointment booked successfully!');
      } else {
        setError(result.msg || 'Booking failed');
      }
    } catch (err) {
      setError('Network error. Try again.');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/appointment/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setAppointments(appointments.filter(a => a._id !== id));
        alert('Appointment cancelled');
      } else {
        alert('Failed to cancel');
      }
    } catch (err) {
      alert('Network error');
    }
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
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #0d47a1; font-size: 2.2rem; }
        .back-link { color: #1e88e5; text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .back-link:hover { text-decoration: underline; }

        .doctor-list {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding: 10px 0;
          margin-bottom: 30px;
        }
        .doctor-card {
          min-width: 200px;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }
        .doctor-card:hover, .doctor-card.selected {
          border-color: #1e88e5;
          box-shadow: 0 4px 12px rgba(30, 136, 229, 0.2);
        }
        .doctor-card h3 { margin: 0 0 8px; color: #0d47a1; font-size: 1.1rem; }
        .doctor-card p { margin: 5px 0; font-size: 0.9rem; color: #555; }

        .details-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        .details-row {
          display: flex;
          margin-bottom: 12px;
          font-size: 1rem;
        }
        .details-row strong {
          width: 150px;
          color: #0d47a1;
        }

        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
        }
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .book-btn {
          background: #1e88e5;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .book-btn:hover {
          background: #0d47a1;
        }

        .error {
          color: #d32f2f;
          margin: 10px 0;
          font-size: 0.95rem;
        }

        .appointments-list {
          margin-top: 40px;
        }
        .appointment-item {
          background: white;
          padding: 18px;
          border-radius: 10px;
          margin-bottom: 12px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .appointment-info {
          flex: 1;
        }
        .appointment-info h3 {
          margin: 0 0 6px;
          color: #0d47a1;
        }
        .appointment-info p {
          margin: 3px 0;
          color: #555;
          font-size: 0.95rem;
        }
        .cancel-btn {
          background: #d32f2f;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }
        .cancel-btn:hover {
          background: #c62828;
        }
      `}</style>

      <div className="container">
        <Link to="/patient-dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="header">
          <h1>Book an Appointment</h1>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Doctor Selection */}
        <h2>Select a Doctor</h2>
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="doctor-list">
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <div
                  key={doc._id}
                  className={`doctor-card ${selectedDoctor?._id === doc._id ? 'selected' : ''}`}
                  onClick={() => handleDoctorSelect(doc)}
                >
                  <h3>{doc.name}</h3>
                  <p><strong>Specialization:</strong> {doc.specialization}</p>
                  <p><strong>Experience:</strong> {doc.experience} years</p>
                  <p><strong>Fee:</strong> ₹{doc.consultationFee}</p>
                </div>
              ))
            ) : (
              <p>No doctors available.</p>
            )}
          </div>
        )}

        {/* Doctor Details & Booking Form */}
        {selectedDoctor && (
          <div className="details-section">
            <h2>Doctor Details</h2>
            <div className="details-row"><strong>Name:</strong> {selectedDoctor.name}</div>
            <div className="details-row"><strong>Specialization:</strong> {selectedDoctor.specialization}</div>
            <div className="details-row"><strong>Qualification:</strong> {selectedDoctor.qualification}</div>
            <div className="details-row"><strong>Experience:</strong> {selectedDoctor.experience} years</div>
            <div className="details-row"><strong>Available Days:</strong> {selectedDoctor.availableDays.join(', ')}</div>
            <div className="details-row"><strong>Timings:</strong> {selectedDoctor.availableTimings}</div>
            <div className="details-row"><strong>Consultation Fee:</strong> ₹{selectedDoctor.consultationFee}</div>

            <div className="form-group">
              <label>Describe Your Problem</label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What is your problem to book appointment?"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Select Appointment Date</label>
              <input
                type="date"
                value={appointmentDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <button className="book-btn" onClick={handleBookAppointment}>
              Book Appointment
            </button>
          </div>
        )}

        {/* My Appointments */}
        <div className="appointments-list">
          <h2>My Appointments</h2>
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <div className="appointment-item" key={appt._id}>
                <div className="appointment-info">
                  <h3>{appt.doctorName}</h3>
                  <p><strong>Specialization:</strong> {appt.doctorSpecialization}</p>
                  <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appt.doctorId?.availableTimings || '10:00 AM - 5:00 PM'}</p>
                  <p><strong>Fee:</strong> ₹{appt.consultationFee}</p>
                  <p><strong>Status:</strong> <span style={{ color: appt.status === 'Booked' ? 'green' : 'red' }}>{appt.status}</span></p>
                  {appt.problem && <p><strong>Issue:</strong> {appt.problem}</p>}
                </div>
                {appt.status === 'Booked' && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelAppointment(appt._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No appointments booked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;