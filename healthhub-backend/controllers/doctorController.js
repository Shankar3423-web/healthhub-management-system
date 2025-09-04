// backend/controllers/doctorController.js
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');

// Helper: Generate Doctor ID like DOC-001
const generateDoctorId = async () => {
  try {
    const lastDoc = await Doctor.findOne().sort({ doctorId: -1 });
    if (!lastDoc) return 'DOC-001';
    const lastNum = parseInt(lastDoc.doctorId.split('-')[1], 10);
    return `DOC-${(lastNum + 1).toString().padStart(3, '0')}`;
  } catch (err) {
    console.error('Failed to generate doctor ID:', err);
    return 'DOC-001';
  }
};

// POST: Submit doctor profile (from DoctorProfileForm)
exports.submitDoctorProfile = async (req, res) => {
  const {
    name, email, dob, age, gender, qualification,
    specialization, experience, phone, availableDays,
    availableTime, address, password,
    consultationFee
  } = req.body;

  try {
    // 1. Find existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ 
        message: 'User not found. Please sign up first.' 
      });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password does not match.' });
    }

    // 3. Prevent duplicate submission
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ 
        message: 'Doctor profile already submitted for approval.' 
      });
    }

    // 4. Generate ID and save
    const doctorId = await generateDoctorId();
    const doctor = new Doctor({
      doctorId, name, email, dob, age, gender, qualification,
      specialization, experience, phone, availableDays,
      availableTime, address, consultationFee,
      status: 'pending'
    });

    await doctor.save();

    res.status(201).json({ 
      message: 'Doctor profile submitted for approval!', 
      doctorId 
    });

  } catch (err) {
    console.error('Error in submitDoctorProfile:', err);
    res.status(500).json({ message: 'Server error. Could not submit profile.' });
  }
};

// POST: Add Doctor (Admin only)
exports.addDoctor = async (req, res) => {
  const {
    name, email, password, dob, gender, qualification,
    specialization, experience, phone, availableDays,
    availableTime, address, consultationFee
  } = req.body;

  try {
    // ✅ Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const doctorId = await generateDoctorId();
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, email, password: hashedPassword, role: 'doctor', status: 'approved' 
    });
    await user.save();

    const doctor = new Doctor({
      doctorId, name, email, dob, age, gender, qualification,
      specialization, experience, phone, availableDays,
      availableTime, address, consultationFee, status: 'approved'
    });
    await doctor.save();

    res.status(201).json({ message: 'Doctor added successfully', doctorId });
  } catch (err) {
    console.error('Error in addDoctor:', err);
    res.status(500).json({ message: 'Server error. Could not add doctor.' });
  }
};

// GET: Pending requests (Admin only)
exports.getPendingRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const requests = await Doctor.find({ status: 'pending' });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT: Approve request (Admin only)
exports.approveDoctorRequest = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const { id } = req.params;
  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

    doctor.status = 'approved';
    await doctor.save();

    await User.updateOne({ email: doctor.email }, { status: 'approved' });

    res.json({ message: `Doctor ${doctor.name} approved.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE: Reject request (Admin only)
exports.rejectDoctorRequest = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const { id } = req.params;
  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

    await Doctor.findByIdAndDelete(id);
    await User.deleteOne({ email: doctor.email });

    res.json({ message: 'Request rejected and removed.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET: All approved doctors (Admin & Doctors)
exports.getAllDoctors = async (req, res) => {
  try {
    // Allow admin and doctors to view list
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const doctors = await Doctor.find({ status: 'approved' });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT: Update doctor (Admin only)
exports.updateDoctor = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  const { doctorId } = req.body;
  try {
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

    Object.assign(doctor, req.body);
    if (req.body.dob) {
      const birthDate = new Date(req.body.dob);
      doctor.age = new Date().getFullYear() - birthDate.getFullYear();
    }

    if (req.body.consultationFee !== undefined) {
      doctor.consultationFee = req.body.consultationFee;
    }

    await doctor.save();
    res.json({ message: 'Doctor updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE: Delete doctor (Admin only)
exports.deleteDoctor = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  const { doctorId } = req.body;
  try {
    const doctor = await Doctor.findOneAndDelete({ doctorId });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

    await User.deleteOne({ email: doctor.email });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};