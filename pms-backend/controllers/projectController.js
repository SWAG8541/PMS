const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try { 
        const { name, description, startDate, endDate } = req.body;
        const project = await Project.create({
            name,
            description,
            startDate,
            endDate,
            createdBy: req.user.id
        });
        res.status(201).json(project);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user.id });
        res.status(200).json(projects);
    } catch(err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Check if the user is authorized to view this project
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this project' });
        }
        
        res.status(200).json(project);
    } catch(err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};