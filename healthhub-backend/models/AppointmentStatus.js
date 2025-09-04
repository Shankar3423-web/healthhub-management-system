// models/AppointmentStatus.js
const mongoose = require('mongoose');

const appointmentStatusSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  completedAt: {
    type: Date,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('AppointmentStatus', appointmentStatusSchema);