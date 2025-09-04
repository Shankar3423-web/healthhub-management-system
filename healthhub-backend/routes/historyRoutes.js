// routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const AppointmentStatus = require('../models/AppointmentStatus');
const Patient = require('../models/Patient');
const Document = require('../models/Document'); // To check uploads

// GET: Patient's full medical history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    // Get all appointments
    const appointments = await Appointment
      .find({ patientId: patient.patientId })
      .sort({ date: -1 });

    // Get statuses
    const statuses = await AppointmentStatus.find({
      appointmentId: { $in: appointments.map(a => a._id) }
    });
    const statusMap = statuses.reduce((map, s) => {
      map[s.appointmentId.toString()] = s;
      return map;
    }, {});

    // Get uploaded documents
    const documents = await Document.find({ patientId: patient.patientId });
    const docsByDoctor = documents.reduce((map, doc) => {
      if (!map[doc.doctorId]) map[doc.doctorId] = [];
      map[doc.doctorId].push(doc);
      return map;
    }, {});

    // Merge data
    const history = await Promise.all(appointments.map(async (apt) => {
      const status = statusMap[apt._id.toString()] || {
        status: 'Pending',
        completedAt: null
      };

      const hasDocuments = documents.some(doc => 
        doc.doctorId.toString() === apt.doctorId.toString()
      );

      return {
        appointmentId: apt._id,
        doctorName: apt.doctorName,
        doctorSpecialization: apt.doctorSpecialization,
        date: apt.date,
        time: apt.doctorId?.availableTimings || '10:00 AM - 5:00 PM',
        consultationFee: apt.consultationFee,
        status: status.status,
        completedAt: status.completedAt,
        hasDocuments
      };
    }));

    res.json(history);
  } catch (err) {
    console.error('History fetch error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;