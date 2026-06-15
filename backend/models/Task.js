const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'O título é obrigatório'],
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['trabalho', 'livre', 'prazo', 'reuniao'] 
    },
    context: {
        type: String,
        required: true,
        enum: ['casa', 'faculdade', 'trabalho', 'transito']
    },
    energy_required: {
        type: String,
        required: true,
        enum: ['alta', 'baixa']
    },
    duration_minutes: {
        type: Number,
        default: 30
    },
    status: {
        type: String,
        default: 'pending'
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Task', TaskSchema);