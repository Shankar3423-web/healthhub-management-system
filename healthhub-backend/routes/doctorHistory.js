// routes/doctorHistory.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PatientHistory = require('../models/PatientHistory');
const Doctor = require('../models/Doctor');

router.get('/history', auth, async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    const history = await PatientHistory.find({ doctorId: doctor._id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error('Fetch history error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;