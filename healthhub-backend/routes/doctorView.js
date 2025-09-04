// routes/doctorView.js
const express = require('express');
const router = express.Router();
const { getAllDoctors } = require('../controllers/doctorViewController');

// Public-safe endpoint
router.get('/all', getAllDoctors);

module.exports = router;