const mongoose = require('mongoose');
const Person = require('./models/Person');
const Lead = require('./models/Lead');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing
        await Person.deleteMany({});
        await Lead.deleteMany({});

        // Create Persons
        const persons = await Person.insertMany([
            { name: 'John Doe', email: 'john@example.com', phone: '1234567890', details: 'Fresh graduate from ABC University' },
            { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', details: 'Interested in AI/ML internship' },
            { name: 'Alice Brown', email: 'alice@example.com', phone: '5556667777', details: 'Full stack developer' }
        ]);

        // Create Leads
        await Lead.insertMany([
            { personId: persons[0]._id, source: 'LinkedIn', status: 'Qualified', expectedRevenue: 1200, notes: 'Good technical skills' },
            { personId: persons[1]._id, source: 'Referral', status: 'New', expectedRevenue: 800, notes: 'Recommended by Professor X' },
            { personId: persons[2]._id, source: 'Website', status: 'Converted', expectedRevenue: 2500, notes: 'Hired as Intern' },
            { personId: persons[0]._id, source: 'Job Board', status: 'Contacted', expectedRevenue: 500, notes: 'Follow up next week' }
        ]);

        console.log('Seed data inserted successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
