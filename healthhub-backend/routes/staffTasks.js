// routes/staffTasks.js
const express = require('express');
const router = express.Router();
const {
  getAllStaffForTasks,
  assignTaskToStaff,
  getAllAssignedTasks,
  deleteTask, // ✅ Add import
} = require('../controllers/staffTaskController');

// GET: Fetch all approved staff for dropdown
router.get('/staff-list', getAllStaffForTasks);

// POST: Assign a task to a staff
router.post('/assign', assignTaskToStaff);

// GET: View all assigned tasks
router.get('/tasks', getAllAssignedTasks);

// ✅ DELETE: Remove a task by ID
router.delete('/task/:id', deleteTask);

module.exports = router;