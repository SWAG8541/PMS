const express = require('express');
const { createProject, getProjects, getProjectById } = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for all projects
router.route('/')
    .post(protect, createProject)
    .get(protect, getProjects);

// Route for specific project
router.route('/:projectId')
    .get(protect, getProjectById);

module.exports = router;