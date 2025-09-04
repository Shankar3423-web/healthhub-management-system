// routes/patientProfile.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth'); // Optional: if using JWT protection

/**
 * POST /api/patient/profile
 * Get full patient profile by email (using JWT or body)
 */
router.post('/profile', auth, async (req, res) => {
  try {
    const { email } = req.body;

    // Fallback to JWT-decoded email if not in body
    const userEmail = email || req.user?.email;

    if (!userEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const patient = await Patient.findOne({ email: userEmail }).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json(patient);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error. Could not load profile.' });
  }
});

module.exports = router;