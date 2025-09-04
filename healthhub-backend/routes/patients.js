// routes/patients.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

/**
 * POST /api/patients
 * Create a new patient with auto-generated PT-ID
 */
router.post('/', async (req, res) => {
  const {
    name,
    email,
    address,
    medicalProblem,
    dob,
    age,
    gender,
    contact,
    bloodGroup,
    password,
  } = req.body;

  try {
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient with this email already exists.' });
    }

    // Generate new Patient ID (PT-1, PT-2, ...)
    const patientId = await Patient.generatePatientId();

    // Create new patient
    const patient = new Patient({
      patientId,
      name,
      email,
      address,
      medicalProblem,
      dob: new Date(dob),
      age,
      gender,
      contact,
      bloodGroup,
      password, // Will be hashed by pre-save hook
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient profile created successfully',
      patient: {
        patientId: patient.patientId,
        name: patient.name,
        email: patient.email,
        contact: patient.contact,
      },
    });
  } catch (err) {
    console.error('Error creating patient:', err);
    res.status(500).json({ message: 'Server error. Could not create patient.' });
  }
});

// ✅ NEW: GET ALL PATIENTS
// Accessible to admin
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().select('-password'); // Exclude password field
    res.json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: 'Failed to fetch patients.' });
  }
});

// ✅ NEW: GET PATIENT BY patientId (e.g., PT-1)
router.get('/id/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json(patient);
  } catch (err) {
    console.error('Error fetching patient by ID:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ✅ NEW: UPDATE PATIENT BY patientId
router.put('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;

    // Prevent updating patientId
    delete updateData.patientId;

    const patient = await Patient.findOneAndUpdate(
      { patientId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json({
      message: 'Patient updated successfully.',
      patient,
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Update failed.' });
  }
});

// ✅ NEW: DELETE PATIENT BY patientId
router.delete('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findOneAndDelete({ patientId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json({ message: 'Patient deleted successfully.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Delete failed.' });
  }
});

module.exports = router;