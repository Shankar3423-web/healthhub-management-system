// backend/models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date },
  age: { type: Number },
  gender: { type: String },
  qualification: { type: String },
  specialization: { type: String },
  experience: { type: String }, // e.g., "10 years"
  phone: { type: String },
  availableDays: { type: [String] }, // e.g., ["Monday", "Wednesday"]
  availableTime: { type: String },  // e.g., "9:00 AM - 5:00 PM"
  address: { type: String },
  consultationFee: { type: Number },
  status: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'approved'
  },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Virtual: Map consultationFee → fee (used in frontend)
doctorSchema.virtual('fee').get(function () {
  return this.consultationFee;
});

// ✅ Virtual: Map phone → contact (used in frontend)
doctorSchema.virtual('contact').get(function () {
  return this.phone;
});

// ✅ Virtual: Extract numeric experience → experienceYears
doctorSchema.virtual('experienceYears').get(function () {
  const num = this.experience?.match(/\d+/);
  return num ? parseInt(num[0], 10) : 0;
});

// ✅ Virtual: Map availableTime → availableTimings (critical for frontend)
doctorSchema.virtual('availableTimings').get(function () {
  return this.availableTime || 'Not specified';
});

// ✅ Ensure all virtuals are included in JSON and Object output
doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Doctor', doctorSchema);