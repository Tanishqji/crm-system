const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    source: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'],
        default: 'New'
    },
    expectedRevenue: { type: Number, default: 0 },
    notes: { type: String },
    personId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
