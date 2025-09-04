// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient'); // To get real patient data

// 🔹 GET: List all doctors
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await Doctor.find({}, 'name specialization qualification experience availableDays availableTimings consultationFee');
    res.json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err.message);
    res.status(500).send('Server error');
  }
});

// 🔹 POST: Book an appointment
router.post('/book', auth, async (req, res) => {
  const { doctorId, date, problem } = req.body; // ← Added: problem

  if (!doctorId || !date || !problem?.trim()) {
    return res.status(400).json({ 
      msg: 'Doctor ID, date, and problem description are required' 
    });
  }

  try {
    // ✅ Step 1: Get user email from JWT (via middleware)
    const userEmail = req.user.email;

    // ✅ Step 2: Find the Patient document using email
    const patient = await Patient.findOne({ email: userEmail });
    if (!patient) {
      console.log('❌ No patient found with email:', userEmail);
      return res.status(404).json({ msg: 'Patient profile not found. Please contact admin.' });
    }

    const { patientId, name: patientName } = patient;

    // ✅ Step 3: Validate doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // ✅ Step 4: Normalize date (ignore time)
    const bookingDate = new Date(date);
    if (isNaN(bookingDate)) {
      return res.status(400).json({ msg: 'Invalid date format' });
    }
    bookingDate.setHours(0, 0, 0, 0);

    // ✅ Step 5: Prevent duplicate booking
    const existing = await Appointment.findOne({
      patientId,
      doctorId,
      date: bookingDate,
      status: 'Booked',
    });

    if (existing) {
      return res.status(400).json({ msg: 'Already booked with this doctor on this date.' });
    }

    // ✅ Step 6: Check doctor availability
    const day = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (!doctor.availableDays.includes(day)) {
      return res.status(400).json({ msg: `Doctor not available on ${day}s.` });
    }

    // ✅ Step 7: Create appointment (including problem)
    const appointment = new Appointment({
      patientId,
      patientName,
      doctorId: doctor._id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      date: bookingDate,
      consultationFee: doctor.consultationFee,
      problem: problem.trim(), // ← Now included and saved
    });

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error('❌ Booking error:', err.message || err);
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid doctor ID format.' });
    }
    res.status(500).send('Server error');
  }
});

// 🔹 GET: My appointments
router.get('/my', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) {
      return res.status(404).json({ msg: 'Patient profile not found.' });
    }

    const appointments = await Appointment
      .find({ patientId: patient.patientId })
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    console.error('❌ Fetch appointments error:', err.message);
    res.status(500).send('Server error');
  }
});

// 🔹 DELETE: Cancel appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const result = await Appointment.deleteOne({
      _id: req.params.id,
      patientId: patient.patientId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'Appointment not found or already cancelled' });
    }

    res.json({ msg: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error('❌ Cancellation error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;