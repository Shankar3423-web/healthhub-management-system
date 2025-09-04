// controllers/appointmentViewController.js
const Appointment = require('../models/Appointment');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ date: -1 })
      .select('patientId patientName doctorName doctorSpecialization date status consultationFee')
      .lean();

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error: Could not fetch appointments.' });
  }
};