// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Document = require('../models/Document');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory
const uploadDir = 'uploads/patient-docs';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// POST: Upload document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const { description } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ msg: 'No file uploaded' });
  if (!description || !description.trim()) return res.status(400).json({ msg: 'Description is required' });

  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    const appointment = await Appointment.findOne({ patientId: patient.patientId, status: 'Booked' })
      .sort({ date: -1 })
      .populate('doctorId', 'name');

    if (!appointment) return res.status(400).json({ msg: 'No active appointment found to link document to.' });

    const doc = new Document({
      patientId: patient.patientId,
      patientName: patient.name,
      doctorId: appointment.doctorId._id,
      doctorName: appointment.doctorId.name,
      fileName: file.originalname,
      filePath: `/uploads/patient-docs/${file.filename}`,
      fileType: file.mimetype,
      description,
    });

    await doc.save();
    res.json({ msg: 'Uploaded successfully', document: doc });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET: My documents
router.get('/my', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    const docs = await Document.find({ patientId: patient.patientId }).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE: Remove document
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const patient = await Patient.findOne({ email: user.email });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    const doc = await Document.findOneAndDelete({
      _id: req.params.id,
      patientId: patient.patientId,
    });

    if (!doc) return res.status(404).json({ msg: 'Document not found or unauthorized' });

    // Delete physical file
    const filePath = `.${doc.filePath}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ msg: 'Document deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;