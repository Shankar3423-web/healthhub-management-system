// routes/prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// POST: Doctor adds prescription
router.post('/create', auth, async (req, res) => {
  const { appointmentId, medicines, notes } = req.body;

  try {
    // Get doctor from JWT
    const doctorEmail = req.user.email;
    const doctor = await require('../models/Doctor').findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    // Verify appointment belongs to doctor
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorId: doctor._id,
    });
    if (!appointment) return res.status(403).json({ msg: 'Unauthorized or appointment not found' });

    // Get patient
    const patient = await Patient.findOne({ patientId: appointment.patientId });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    // Create prescription
    const prescription = new Prescription({
      appointmentId,
      patientId: patient.patientId,
      patientName: patient.name,
      doctorId: doctor._id,
      doctorName: doctor.name,
      medicines,
      notes: notes || '',
      issuedAt: new Date(),
    });

    await prescription.save();

    res.json({
      msg: 'Prescription saved successfully',
      prescription,
    });
  } catch (err) {
    console.error('Prescription save error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET: Patient's prescriptions
router.get('/my', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    const prescriptions = await Prescription.find({ patientId: patient.patientId }).sort({ issuedAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    console.error('Fetch prescriptions error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ NEW: Check if prescription exists for a patient and appointment
router.get('/patient/:patientId/appointment/:appointmentId', auth, async (req, res) => {
  try {
    const { patientId, appointmentId } = req.params;

    // Get doctor from JWT
    const doctorEmail = req.user.email;
    const doctor = await require('../models/Doctor').findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    // Check if prescription exists
    const prescription = await Prescription.findOne({
      patientId,
      appointmentId,
      doctorId: doctor._id,
    });

    if (!prescription) {
      return res.json({ exists: false });
    }

    res.json({ exists: true, prescription });
  } catch (err) {
    console.error('Check prescription error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;