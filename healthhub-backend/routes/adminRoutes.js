// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  submitAdminProfile,
  getPendingRequests,
  approveAdminRequest,
  rejectAdminRequest,
  addAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminController');

// Public: Admin submits profile
router.post('/submit-admin-profile', submitAdminProfile);

// Admin: Requests
router.get('/requests/pending', getPendingRequests);
router.put('/requests/approve/:id', approveAdminRequest);
router.delete('/requests/reject/:id', rejectAdminRequest);

// Admin: Admin Management
router.post('/add', addAdmin);
router.get('/all', getAllAdmins);
router.put('/update', updateAdmin);
router.delete('/delete', deleteAdmin);

module.exports = router;