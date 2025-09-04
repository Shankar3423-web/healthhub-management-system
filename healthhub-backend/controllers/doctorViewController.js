// controllers/doctorViewController.js
const Doctor = require('../models/Doctor');

/**
 * GET /api/doctors/view/all
 * Returns all approved doctors
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'approved' })
      .select('doctorId name email specialization experience availableDays availableTime consultationFee')
      .sort({ name: 1 });

    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors.' });
  }
};