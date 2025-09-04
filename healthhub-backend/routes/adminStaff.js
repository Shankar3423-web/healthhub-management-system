// routes/adminStaff.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Staff = require('../models/Staff');

// GET /api/admin/staff-list
router.get('/staff-list', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    const staff = await Staff.find({}, 'name staffId designation department email');
    res.json(staff);
  } catch (err) {
    console.error('Staff fetch error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;