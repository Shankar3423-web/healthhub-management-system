// routes/doctorDocumentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Document = require('../models/Document');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// GET: Doctor views patient's uploaded documents
router.get('/patient/:patientId/documents', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorEmail = req.user.email;

    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    const patient = await Patient.findOne({ patientId });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    const documents = await Document.find({
      patientId,
      doctorId: doctor._id,
    }).sort({ uploadedAt: -1 });

    const result = documents.map(doc => ({
      id: doc._id,
      fileName: doc.fileName,
      filePath: doc.filePath,
      fileType: doc.fileType,
      uploadedAt: doc.uploadedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error('Fetch documents error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;