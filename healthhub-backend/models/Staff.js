// models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: Date,
  age: Number,
  gender: String,
  contactNumber: String,
  designation: String,
  department: String,
  qualification: String,
  experience: String,
  joiningDate: Date,
  availableDays: [String],
  availableTime: String,
  address: String,
  emergencyContact: String,
  bloodGroup: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);