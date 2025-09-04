// models/StaffTask.js
const mongoose = require('mongoose');

const staffTaskSchema = new mongoose.Schema({
  staffId: {
    type: String,
    ref: 'Staff',
    required: true,
  },
  staffName: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  department: {
    type: String,
  },
  task: {
    type: String,
    required: true,
    trim: true,
  },
  assignedBy: {
    type: String,
    default: 'Admin', // Could later include actual admin ID
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StaffTask', staffTaskSchema);