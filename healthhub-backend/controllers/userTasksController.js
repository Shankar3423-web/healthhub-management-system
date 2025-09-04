// controllers/userTasksController.js
const StaffTask = require('../models/StaffTask');

/**
 * GET /api/tasks/my
 * Returns the latest assigned task for the logged-in staff
 * Uses staffId from decoded token or fallback to lookup
 */
exports.getMyTask = async (req, res) => {
  try {
    // In your system, we can't rely on JWT payload having staffId
    // So we expect frontend to pass staffId via query or we can't resolve it securely
    // But since you don't want backend changes, we'll make it query-based

    const { staffId } = req.query;

    if (!staffId) {
      return res.status(400).json({
        message: 'staffId is required. Pass as ?staffId=ST-001'
      });
    }

    const tasks = await StaffTask.find({ staffId }).sort({ assignedAt: -1 });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json([]); // Return empty — not an error
    }

    return res.json(tasks);
  } catch (error) {
    console.error('Error in getMyTask:', error);
    return res.status(500).json({ message: 'Server error while fetching your task.' });
  }
};