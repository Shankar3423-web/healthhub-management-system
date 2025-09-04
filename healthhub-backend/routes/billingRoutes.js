// routes/billingRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Billing = require('../models/Billing');

// GET: Patient's billing records
router.get('/appointments', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    // Get all appointments
    const appointments = await Appointment.find({ patientId: patient.patientId }).sort({ date: -1 });

    // Get existing billing records
    const billingRecords = await Billing.find({ patientId: patient.patientId });
    const billingMap = billingRecords.reduce((map, bill) => {
      map[bill.appointmentId.toString()] = bill;
      return map;
    }, {});

    // Merge data
    const result = appointments.map(apt => {
      const billing = billingMap[apt._id.toString()];
      return {
        ...apt._doc,
        billingStatus: billing ? billing.status : 'Pending',
        billingId: billing ? billing._id : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).send('Server error');
  }
});

// PUT: Pay for an appointment
router.put('/pay/:id', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: patient.patientId,
    });

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check if billing record exists
    let billing = await Billing.findOne({ appointmentId: appointment._id });

    if (!billing) {
      // Create new billing record
      billing = new Billing({
        appointmentId: appointment._id,
        patientId: patient.patientId,
        patientName: patient.name,
        doctorName: appointment.doctorName,
        consultationFee: appointment.consultationFee,
        appointmentDate: appointment.date,
        status: 'Paid',
        paidAt: new Date(),
      });
    } else {
      // Update existing
      billing.status = 'Paid';
      billing.paidAt = new Date();
    }

    await billing.save();

    res.json({
      ...appointment._doc,
      billingStatus: 'Paid',
      billingId: billing._id,
    });
  } catch (err) {
    console.error('Payment error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;