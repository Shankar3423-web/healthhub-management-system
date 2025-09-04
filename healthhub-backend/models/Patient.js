// models/Patient.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true, // Prevents duplicates
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  medicalProblem: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  password: { type: String, required: true }, // Will be hashed
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Updated: Generate next available patientId (avoids duplicates)
patientSchema.statics.generatePatientId = async function () {
  let id = 1;
  while (true) {
    const candidateId = `PT-${id}`;
    const existing = await this.findOne({ patientId: candidateId });
    if (!existing) {
      return candidateId;
    }
    id++;
  }
};

module.exports = mongoose.model('Patient', patientSchema);