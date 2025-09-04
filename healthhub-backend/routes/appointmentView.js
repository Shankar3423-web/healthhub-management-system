// routes/appointmentView.js
const express = require('express');
const router = express.Router();
const { getAllAppointments } = require('../controllers/appointmentViewController');

router.get('/all', getAllAppointments);

module.exports = router;