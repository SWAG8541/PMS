const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: String,

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: {
        type: Date
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);