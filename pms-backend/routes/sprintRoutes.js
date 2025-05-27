const express = require('express');
const { 
    createSprint, 
    getAllSprints,
    getSprintsByProject,
    getSprintDetails
} = require('../controllers/sprintController');
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Sprint CRUD routes
router.post('/', protect, createSprint);
router.get('/', protect, getAllSprints);
router.get('/project/:projectId', protect, getSprintsByProject);
router.get('/:sprintId/details', protect, getSprintDetails);

module.exports = router;