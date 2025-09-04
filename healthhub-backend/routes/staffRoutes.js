// routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const {
  submitStaffProfile,
  getPendingRequests,
  approveStaffRequest,
  rejectStaffRequest,
  addStaff,
  getAllStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');

// Public: Staff submits profile
router.post('/submitProfile', submitStaffProfile);

// Admin: Requests
router.get('/requests/pending', getPendingRequests);
router.put('/requests/approve/:id', approveStaffRequest);
router.delete('/requests/reject/:id', rejectStaffRequest);

// Admin: Staff Management
router.post('/add', addStaff);
router.get('/all', getAllStaff);
router.put('/update', updateStaff);
router.delete('/delete', deleteStaff);

module.exports = router;