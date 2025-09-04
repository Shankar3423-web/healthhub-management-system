// controllers/staffTaskController.js
const Staff = require('../models/Staff');
const StaffTask = require('../models/StaffTask');

// Get all staff (for dropdown in frontend)
exports.getAllStaffForTasks = async (req, res) => {
  try {
    const staff = await Staff.find(
      { status: 'approved' }, // Only approved staff
      'staffId name designation department'
    ).sort({ name: 1 });

    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error while fetching staff' });
  }
};

// Assign a task to a staff member
exports.assignTaskToStaff = async (req, res) => {
  const { staffId, task } = req.body;

  if (!staffId || !task || task.trim().length === 0) {
    return res.status(400).json({ message: 'Staff ID and task are required.' });
  }

  try {
    const staff = await Staff.findOne({ staffId, status: 'approved' });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found or not approved.' });
    }

    const newTask = new StaffTask({
      staffId: staff.staffId,
      staffName: staff.name,
      designation: staff.designation,
      department: staff.department,
      task: task.trim(),
    });

    await newTask.save();

    res.status(201).json({
      message: 'Task assigned successfully.',
      task: newTask,
    });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Failed to assign task.' });
  }
};

// Get all assigned tasks (optional: filter by date, staff, etc.)
exports.getAllAssignedTasks = async (req, res) => {
  try {
    const tasks = await StaffTask.find().sort({ assignedAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error fetching tasks.' });
  }
};

// ✅ NEW: Delete a task by ID
// No changes to existing code — just adding new function
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await StaffTask.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error while deleting task.' });
  }
};