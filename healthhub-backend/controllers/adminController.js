// controllers/adminController.js
const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Helper: Generate Admin ID like AD-001
const generateAdminId = async () => {
  try {
    const lastAdmin = await Admin.findOne().sort({ adminId: -1 });
    if (!lastAdmin) return 'AD-001';
    const lastNum = parseInt(lastAdmin.adminId.split('-')[1], 10);
    return `AD-${(lastNum + 1).toString().padStart(3, '0')}`;
  } catch (err) {
    console.error('Failed to generate admin ID:', err);
    return 'AD-001';
  }
};

// POST: Submit admin profile (from AdminProfileForm)
exports.submitAdminProfile = async (req, res) => {
  const {
    name, email, dob, contact, address, bloodGroup,
    emergencyContact, designation, department, joiningDate,
    qualification, experience, previousExperience,
    availableDays, availableTime, password
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'User not found. Please sign up first.' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password does not match.' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin profile already submitted.' });
    }

    const adminId = await generateAdminId();
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    const admin = new Admin({
      adminId,
      name, email, dob, age, contact, address, bloodGroup,
      emergencyContact, designation, department, joiningDate,
      qualification, experience, previousExperience,
      availableDays, availableTime, status: 'pending'
    });

    await admin.save();

    res.status(201).json({ message: 'Submitted for approval', adminId });
  } catch (err) {
    console.error('Error in submitAdminProfile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET: All pending admin requests
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Admin.find({ status: 'pending' });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT: Approve admin request
exports.approveAdminRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    admin.status = 'approved';
    await admin.save();

    await User.updateOne({ email: admin.email }, { status: 'approved' });

    res.json({ message: `Admin ${admin.name} approved.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE: Reject admin request
exports.rejectAdminRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    await Admin.findByIdAndDelete(id);
    await User.deleteOne({ email: admin.email });

    res.json({ message: 'Request rejected and removed.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST: Add Admin directly (by existing admin)
exports.addAdmin = async (req, res) => {
  const {
    name, email, password, dob, contact, address, bloodGroup,
    emergencyContact, designation, department, joiningDate,
    qualification, experience, previousExperience,
    availableDays, availableTime
  } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const adminId = await generateAdminId();
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, email, password: hashedPassword, role: 'admin', status: 'approved' 
    });
    await user.save();

    const admin = new Admin({
      adminId,
      name, email, dob, age, contact, address, bloodGroup,
      emergencyContact, designation, department, joiningDate,
      qualification, experience, previousExperience,
      availableDays, availableTime, status: 'approved'
    });

    await admin.save();

    res.status(201).json({ message: 'Admin added successfully', adminId });
  } catch (err) {
    console.error('Error in addAdmin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET: Fetch all approved admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ status: 'approved' });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT: Update admin
exports.updateAdmin = async (req, res) => {
  const { adminId } = req.body;
  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    Object.assign(admin, req.body);
    if (req.body.dob) {
      const birthDate = new Date(req.body.dob);
      admin.age = new Date().getFullYear() - birthDate.getFullYear();
    }

    await admin.save();
    res.json({ message: 'Admin updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE: Delete admin
exports.deleteAdmin = async (req, res) => {
  const { adminId } = req.body;
  try {
    const admin = await Admin.findOneAndDelete({ adminId });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    await User.deleteOne({ email: admin.email });
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: Add Patient by Admin (Auto-Approved)
exports.addPatient = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Ensure patient is auto-approved
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'patient',
      status: 'approved' // ✅ Critical: Must be approved
    });

    await user.save();

    res.status(201).json({ message: 'Patient added successfully and can log in immediately.' });
  } catch (err) {
    console.error('Error in addPatient:', err);
    res.status(500).json({ message: 'Server error' });
  }
};