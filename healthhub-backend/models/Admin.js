// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true }, // AD-001
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: Date,
  age: Number,
  contact: String,
  address: String,
  bloodGroup: String,
  emergencyContact: String,
  designation: String,
  department: String,
  joiningDate: Date,
  qualification: String,
  experience: String,
  previousExperience: String,
  availableDays: [String],
  availableTime: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);