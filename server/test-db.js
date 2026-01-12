const mongoose = require('mongoose');
require('dotenv').config();

console.log('Connecting to:', process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected successfully to MongoDB Atlas');

        // Try to perform a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('✅ Collections found:', collections.map(c => c.name));

        await mongoose.disconnect();
        console.log('✅ Disconnected');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection test failed:', err.message);
        process.exit(1);
    }
};

test();
