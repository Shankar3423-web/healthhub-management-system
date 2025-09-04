// controllers/staffController.js
const User = require('../models/User');
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs'); // ✅ For password hashing

// Helper: Generate Staff ID like ST-001
const generateStaffId = async () => {
  try {
    const lastStaff = await Staff.findOne().sort({ staffId: -1 });
    if (!lastStaff) return 'ST-001';
    const lastNum = parseInt(lastStaff.staffId.split('-')[1], 10);
    return `ST-${(lastNum + 1).toString().padStart(3, '0')}`;
  } catch (err) {
    console.error('Failed to generate staff ID:', err);
    return 'ST-001';
  }
};

// POST: Submit staff profile (from StaffProfileForm)
exports.submitStaffProfile = async (req, res) => {
  const {
    name, email, dob, age, gender, contactNumber,
    designation, department, qualification, experience,
    joiningDate, availableDays, availableTime,
    address, emergencyContact, bloodGroup, password
  } = req.body;

  try {
    // 1. Find existing user (created during signup)
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'User not found. Please sign up first.' });
    }

    // 2. Verify password matches (use bcrypt.compare if password is hashed)
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password does not match.' });
    }

    // 3. Check if staff profile already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff profile already submitted.' });
    }

    // 4. Generate staff ID
    const staffId = await generateStaffId();

    // 5. Create staff profile (status: pending)
    const staff = new Staff({
      staffId,
      name, email, dob, age, gender, contactNumber,
      designation, department, qualification, experience,
      joiningDate, availableDays, availableTime,
      address, emergencyContact, bloodGroup, status: 'pending'
    });

    await staff.save();

    res.status(201).json({ message: 'Submitted for approval', staffId });
  } catch (err) {
    console.error('Error in submitStaffProfile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET: All pending staff requests (for Admin → Requests.js)
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Staff.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Error in getPendingRequests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT: Approve staff request
exports.approveStaffRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: 'Staff not found.' });

    staff.status = 'approved';
    await staff.save();

    await User.updateOne({ email: staff.email }, { status: 'approved' });

    res.json({ message: `Staff ${staff.name} approved.` });
  } catch (err) {
    console.error('Error in approveStaffRequest:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE: Reject request
exports.rejectStaffRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: 'Staff not found.' });

    await Staff.findByIdAndDelete(id);
    await User.deleteOne({ email: staff.email });

    res.json({ message: 'Request rejected and removed.' });
  } catch (err) {
    console.error('Error in rejectStaffRequest:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST: Add Staff directly (Admin → StaffManagement.js)
exports.addStaff = async (req, res) => {
  const {
    name, email, password, dob, gender, contactNumber,
    designation, department, qualification, experience,
    joiningDate, availableDays, availableTime,
    address, emergencyContact, bloodGroup
  } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const staffId = await generateStaffId();
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    // ✅ Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'staff', 
      status: 'approved' 
    });
    await user.save();

    const staff = new Staff({
      staffId,
      name, email, dob, age, gender, contactNumber,
      designation, department, qualification, experience,
      joiningDate, availableDays, availableTime,
      address, emergencyContact, bloodGroup, status: 'approved'
    });

    await staff.save();

    res.status(201).json({ message: 'Staff added successfully', staffId });
  } catch (err) {
    console.error('Error in addStaff:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET: Fetch all approved staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ status: 'approved' }).sort({ name: 1 });
    res.json(staff);
  } catch (err) {
    console.error('Error in getAllStaff:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT: Update staff
exports.updateStaff = async (req, res) => {
  const { staffId } = req.body;
  try {
    const staff = await Staff.findOne({ staffId });
    if (!staff) return res.status(404).json({ message: 'Staff not found.' });

    Object.assign(staff, req.body);
    if (req.body.dob) {
      const birthDate = new Date(req.body.dob);
      staff.age = new Date().getFullYear() - birthDate.getFullYear();
    }

    await staff.save();
    res.json({ message: 'Staff updated successfully' });
  } catch (err) {
    console.error('Error in updateStaff:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE: Delete staff
exports.deleteStaff = async (req, res) => {
  const { staffId } = req.body;
  try {
    const staff = await Staff.findOneAndDelete({ staffId });
    if (!staff) return res.status(404).json({ message: 'Staff not found.' });

    await User.deleteOne({ email: staff.email });
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    console.error('Error in deleteStaff:', err);
    res.status(500).json({ message: 'Server error' });
  }
};