const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    },

    sprintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprint',
        default: null
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: String,

    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done', 'todo', 'in-progress', 'done'],
        default: 'To Do'
    },

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);