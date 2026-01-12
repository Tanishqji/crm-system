const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/persons', require('./routes/personRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('Attempting to connect to MongoDB...');

    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('✅ Connected to MongoDB');
        })
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
            console.error('Make sure your MongoDB credentials (username/password) are correct in .env');
        });
});
