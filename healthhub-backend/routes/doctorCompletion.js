// routes/doctorCompletion.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const PatientHistory = require('../models/PatientHistory');
const Billing = require('../models/Billing'); // ✅ Add this

// PUT: Complete appointment → delete from active, save to history
router.put('/appointments/complete/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorEmail = req.user.email;

    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    const appointment = await Appointment.findById(id);
    if (!appointment || !appointment.doctorId.equals(doctor._id)) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    const patient = await Patient.findOne({ patientId: appointment.patientId });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    // Check if prescription exists
    const prescription = await Prescription.findOne({ appointmentId: id });

    // ✅ Get true payment status from Billing
    const billing = await Billing.findOne({ appointmentId: id });
    const paymentStatus = billing?.status === 'Paid' ? 'Paid' : 'Pending';

    // Save to history
    const historyEntry = new PatientHistory({
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: appointment.date,
      medicalProblem: appointment.medicalProblem,
      consultationFee: appointment.consultationFee,
      paymentStatus, // ✅ Now correct: 'Paid' or 'Pending'
      prescriptionIssued: !!prescription,
    });

    await historyEntry.save();
    await Appointment.findByIdAndDelete(id); // ✅ Remove from active list

    res.json({ msg: 'Appointment completed and moved to history' });
  } catch (err) {
    console.error('Complete appointment error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;