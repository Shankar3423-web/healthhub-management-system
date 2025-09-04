// routes/doctorAppointments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor'); // ✅ Add this

router.get('/appointments', auth, async (req, res) => {
  try {
    // 1. Get user email from JWT
    const userEmail = req.user.email;

    // 2. Find the Doctor by email
    const doctor = await Doctor.findOne({ email: userEmail });
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }

    // 3. Find appointments using doctor's _id
    const appointments = await Appointment.find({ doctorId: doctor._id }).sort({ date: 1 });
    if (appointments.length === 0) {
      return res.json([]);
    }

    // 4. Get patient details
    const patientIds = [...new Set(appointments.map(a => a.patientId))];
    const patients = await Patient.find({ patientId: { $in: patientIds } });
    const patientMap = patients.reduce((map, p) => {
      map[p.patientId] = p;
      return map;
    }, {});

    // 5. Merge data
    const result = appointments.map(apt => {
      const patient = patientMap[apt.patientId];
      return {
        appointmentId: apt._id,
        patientName: apt.patientName,
        patientId: apt.patientId,
        contact: patient?.contact || 'Not Provided',
        age: patient?.age || 'Not Provided',
        gender: patient?.gender || 'Not Provided',
        medicalProblem: patient?.medicalProblem || 'Not Provided',
        date: apt.date,
        consultationFee: apt.consultationFee,
        status: apt.status,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Fetch appointments error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;