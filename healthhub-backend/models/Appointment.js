// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  doctorSpecialization: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'Booked',
    enum: ['Booked', 'Cancelled'],
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  problem: {
    type: String,
    required: true, // Set to false if you want it optional
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);