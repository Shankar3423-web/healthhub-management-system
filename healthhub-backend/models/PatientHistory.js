// models/PatientHistory.js
const mongoose = require('mongoose');

const patientHistorySchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  date: { type: Date, required: true },
  medicalProblem: { type: String },
  consultationFee: { type: Number },
  paymentStatus: { type: String }, // 'Paid' or 'Pending'
  prescriptionIssued: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatientHistory', patientHistorySchema);