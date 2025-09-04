// backend/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  submitDoctorProfile,
  getPendingRequests,
  approveDoctorRequest,
  rejectDoctorRequest,
  addDoctor,
  getAllDoctors,       // ✅ Already imported
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');

console.log('🔧 Doctor routes are being loaded...');

// ✅ POST: Doctor submits profile
router.post('/profile', auth, submitDoctorProfile);

// ✅ NEW: Public route for profile submission (no auth)
// 🔥 Used by doctors right after signup, before login
router.post('/profile-public', submitDoctorProfile);

// ✅ Admin: Pending requests
router.get('/requests/pending', auth, getPendingRequests);
router.put('/requests/approve/:id', auth, approveDoctorRequest);
router.delete('/requests/reject/:id', auth, rejectDoctorRequest);

// ✅ Admin: Doctor Management
router.post('/add', auth, addDoctor);

// ✅ GET /api/doctor/all → Used in DoctorManagement.js
router.get('/all', auth, getAllDoctors); // ✅ Add this line

router.put('/update', auth, updateDoctor);
router.delete('/delete', auth, deleteDoctor);

console.log('✅ All doctor routes registered');

module.exports = router;