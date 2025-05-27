const Task = require("../models/Task");
const User = require("../models/User");

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('projectId', 'name');
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { projectId, sprintId, title, description, assignedTo, status, priority } = req.body;

    const task = await Task.create({
            projectId: projectId || null,  // Allow null for global tasks
            sprintId: sprintId || null,
            title,
            description,
            assignedTo: assignedTo || null,
            status: status || 'To Do',
            priority: priority || 'Medium',
            createdBy: req.user.id
        });

        // Populate user information
        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('projectId', 'name');

        res.status(201).json(populatedTask);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get tasks by project
exports.getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ projectId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('projectId', 'name');
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get tasks by sprint
exports.getTasksBySprint = async (req, res) => {
    try {
        const { sprintId } = req.params;
        const tasks = await Task.find({ sprintId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('projectId', 'name');
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['To Do', 'In Progress', 'Done'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        ).populate('assignedTo', 'name email')
         .populate('createdBy', 'name email')
         .populate('projectId', 'name');

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Assign user to task
exports.assignUserToTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { userId } = req.body;

        console.log(`Assigning task ${taskId} to user ${userId || 'none'}`);

        // Find the task first
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // If userId is empty string or null, unassign the task
        if (!userId) {
            task.assignedTo = null;
        } else {
            // Verify user exists if userId is provided
            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }
            task.assignedTo = userId;
        }

        // Save the task
        await task.save();

        // Return the updated task with populated fields
        const updatedTask = await Task.findById(taskId)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('projectId', 'name');

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Error in assignUserToTask:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Unassign user from task
exports.unassignUserFromTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.assignedTo = null;
        await task.save();

        const updatedTask = await Task.findById(taskId)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('projectId', 'name');

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Add task to sprint
exports.addTaskToSprint = async (req, res) => {
    try {
        const { taskId, sprintId } = req.params;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { sprintId },
            { new: true }
        ).populate('assignedTo', 'name email')
         .populate('createdBy', 'name email')
         .populate('projectId', 'name');

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Remove task from sprint
exports.removeTaskFromSprint = async (req, res) => {
    try {
        const { taskId } = req.params;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { sprintId: null },
            { new: true }
        ).populate('assignedTo', 'name email')
         .populate('createdBy', 'name email')
         .populate('projectId', 'name');

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};