// models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      instructions: { type: String },
    }
  ],
  notes: {
    type: String,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active',
  }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);