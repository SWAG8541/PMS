const Sprint = require('../models/Sprint');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Create a new sprint (with or without project)
exports.createSprint = async (req, res) => {
    try {
        const { projectId, name, startDate, endDate } = req.body;

        const sprint = await Sprint.create({
            projectId: projectId || null, // Allow null for global sprints
            name,
            startDate,
            endDate,
            createdBy: req.user.id
        });

        res.status(201).json(sprint);
    } catch(err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get all sprints
exports.getAllSprints = async (req, res) => {
    try {
        const sprints = await Sprint.find()
            .populate('projectId', 'name')
            .populate('createdBy', 'name email');
        res.status(200).json(sprints);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get sprints by project
exports.getSprintsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const sprints = await Sprint.find({ projectId })
            .populate('projectId', 'name')
            .populate('createdBy', 'name email');
        res.status(200).json(sprints);
    } catch (err){
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get sprint details with tasks
// Get sprint details with tasks
exports.getSprintDetails = async (req, res) => {
    try {
        const { sprintId } = req.params;
        
        // Get the sprint
        const sprint = await Sprint.findById(sprintId)
            .populate('projectId', 'name')
            .populate('createdBy', 'name email');
            
        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }
        
        // Get all tasks for this sprint with project details
        const tasks = await Task.find({ sprintId })
            .populate('projectId', 'name')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
            
        // Return combined data
        res.status(200).json({
            sprint,
            tasks
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
