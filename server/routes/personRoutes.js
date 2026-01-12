const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Person = require('../models/Person');

// Get all persons
router.get('/', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected yet. Please try again in a few seconds.' });
    }
    try {
        const persons = await Person.find();
        res.json(persons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a person
router.post('/', async (req, res) => {
    const person = new Person(req.body);
    try {
        const newPerson = await person.save();
        res.status(201).json(newPerson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a person
router.put('/:id', async (req, res) => {
    try {
        const updatedPerson = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPerson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a person
router.delete('/:id', async (req, res) => {
    try {
        await Person.findByIdAndDelete(req.params.id);
        res.json({ message: 'Person deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
