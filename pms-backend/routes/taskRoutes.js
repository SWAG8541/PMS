const express = require('express');
const { 
  createTask, 
  getAllTasks,
  getTasksByProject, 
  getTasksBySprint,
  updateTaskStatus, 
  assignUserToTask, 
  unassignUserFromTask,
  addTaskToSprint,
  removeTaskFromSprint
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Task CRUD routes
router.post('/', protect, createTask);
router.get('/', protect, getAllTasks);
router.get('/project/:projectId', protect, getTasksByProject);
router.get('/sprint/:sprintId', protect, getTasksBySprint);

// Task status management
router.put('/:taskId/status', protect, updateTaskStatus);

// Task assignment
router.put('/:taskId/assign', protect, assignUserToTask);
router.put('/:taskId/unassign', protect, unassignUserFromTask);

// Sprint management for tasks
router.put('/:taskId/sprint/:sprintId', protect, addTaskToSprint);
router.put('/:taskId/removeSprint', protect, removeTaskFromSprint);

module.exports = router;