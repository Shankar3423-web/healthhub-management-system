// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor'); // ✅ Add this
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      status: role === 'patient' ? 'approved' : 'pending',
    });

    await user.save();

    const { password: pwd, ...userWithoutPassword } = user._doc;
    res.status(201).json({
      msg: role === 'patient'
        ? 'Registration successful! You can now log in.'
        : 'Registration successful! Awaiting admin approval.',
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    // 🔐 Hardcoded Super Admin (Shankar)
    if (email === 'shankar13052005@gmail.com' && password === '123456') {
      const token = jwt.sign(
        { 
          user: {   // ✅ Wrap in "user"
            id: user._id, 
            role: 'admin', 
            email 
          } 
        },
        process.env.JWT_SECRET || 'your-fallback-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        msg: 'Login successful!',
        token,
        user: {
          _id: user._id,
          name: 'Shankar Admin',
          email: user.email,
          role: 'admin',
          status: 'approved',
          patientId: 'PID-SHANKAR',
          phone: '+91 9876543210',
          dob: '2005-05-13',
          gender: 'Male',
          bloodGroup: 'O+',
          address: 'Chennai, India',
        },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    if (user.role !== 'patient' && user.status !== 'approved') {
      return res.status(401).json({
        msg: 'Your account is pending approval. Please wait for admin confirmation.',
      });
    }

    // ✅ Generate JWT: Wrap user data in "user"
    const token = jwt.sign(
      { 
        user: {   // ✅ This is critical
          id: user._id, 
          role: user.role, 
          email: user.email 
        } 
      },
      process.env.JWT_SECRET || 'your-fallback-secret-key',
      { expiresIn: '24h' }
    );

    const { password: pwd, contact, ...safeUserData } = user._doc;

    // ✅ If user is a doctor, fetch full doctor profile
    let userDataToSend = {
      ...safeUserData,
      phone: contact || 'Not Provided',
    };

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ email }).exec();
      if (doctor) {
        // Use doctor data to enrich response
        userDataToSend = {
          ...userDataToSend,
          name: doctor.name,
          doctorId: doctor.doctorId,
          contact: doctor.phone || contact || 'Not Provided',
          specialization: doctor.specialization || 'Not Provided',
          qualification: doctor.qualification || 'Not Provided',
          experience: doctor.experience || 'Not Provided',
          availableDays: doctor.availableDays || [],
          availableTimings: doctor.availableTime || 'Not Provided', // matches virtual
          consultationFee: doctor.consultationFee || 0,
          address: doctor.address || 'Not Provided',
          dob: doctor.dob ? new Date(doctor.dob).toISOString().split('T')[0] : 'Not Provided',
          age: doctor.age || 'Not Provided',
          gender: doctor.gender || 'Not Provided',
        };
      }
    }

    res.json({
      msg: 'Login successful!',
      token,
      user: userDataToSend,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error during login.' });
  }
});

module.exports = router;