// routes/userTasks.js
const express = require('express');
const router = express.Router();
const { getMyTask } = require('../controllers/userTasksController');

// 🔥 New endpoint: GET /api/tasks/my?staffId=ST-001
router.get('/my', getMyTask);

module.exports = router;