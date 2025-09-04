// routes/doctorPrescriptions.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Document = require('../models/Document');
const Billing = require('../models/Billing'); // ✅ Add this

router.get('/patients', auth, async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    const doctor = await require('../models/Doctor').findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    const appointments = await Appointment.find({ doctorId: doctor._id, status: 'Booked' }).sort({ date: -1 });
    const patientIds = [...new Set(appointments.map(a => a.patientId))];

    const patients = await Patient.find({ patientId: { $in: patientIds } });
    const patientMap = patients.reduce((map, p) => {
      map[p.patientId] = p;
      return map;
    }, {});

    const documents = await Document.find({ patientId: { $in: patientIds }, doctorId: doctor._id });
    const docsByPatient = documents.reduce((map, doc) => {
      if (!map[doc.patientId]) map[doc.patientId] = [];
      map[doc.patientId].push(doc);
      return map;
    }, {});

    // ✅ Fetch billing status
    const billings = await Billing.find({ patientId: { $in: patientIds } });
    const billingMap = billings.reduce((map, b) => {
      map[b.patientId] = b.status === 'Paid' ? 'Paid' : 'Pending';
      return map;
    }, {});

    const results = appointments.map(apt => {
      const patient = patientMap[apt.patientId];
      return {
        appointmentId: apt._id,
        patientId: apt.patientId,
        patientName: apt.patientName,
        contact: patient?.contact || 'Not Provided',
        age: patient?.age || 'Not Provided',
        gender: patient?.gender || 'Not Provided',
        medicalProblem: patient?.medicalProblem || 'Not Provided',
        date: apt.date,
        consultationFee: apt.consultationFee,
        hasDocuments: !!docsByPatient[apt.patientId]?.length,
        paymentStatus: billingMap[apt.patientId] || 'Pending', // ✅ Use billing status
        documents: docsByPatient[apt.patientId] || [],
      };
    });

    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;