const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ override: true });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/persons', require('./routes/personRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

const connectDB = async () => {
    try {
        const sanitizedUri = (process.env.MONGODB_URI || '').replace(/:([^@]+)@/, ':****@').split('?')[0];
        console.log(`Attempting to connect to: ${sanitizedUri}`);

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('Make sure your MongoDB credentials (username/password) are correct in .env');
        process.exit(1);
    }
};

connectDB();
