// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'staff', 'admin'],
    default: 'patient',
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'users' // 🔥 Force Mongoose to use 'users' collection
});

module.exports = mongoose.model('User', userSchema);