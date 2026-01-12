const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    details: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Person', personSchema);
