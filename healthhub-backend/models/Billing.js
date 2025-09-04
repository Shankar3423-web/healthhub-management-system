// models/Billing.js
const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
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
  doctorName: {
    type: String,
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  paidAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);