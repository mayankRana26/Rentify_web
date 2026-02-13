// backend/utils/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

// Models
import User from '../models/User.js';
import Listing from '../models/Listing.js';

dotenv.config({ path: './backend/.env' }); // .env file ka path de
connectDB();

// Dummy Data
const users = [
    { name: 'Admin User', email: 'admin@me.com', password: 'password123', role: 'admin' },
    { name: 'mayank', email: 'mayank@me.com', password: 'password123', role: 'owner' },
];

const listings = [
    { title: 'Modern 2BHK Flat', description: 'A beautiful flat in the heart of the city.', category: 'Property', listingType: 'Rent', price: 25000, priceType: 'per month', location: 'Mumbai', photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500'] },
    { title: 'Honda City 2022', description: 'Well-maintained car with low mileage.', category: 'Vehicle', listingType: 'Sale', price: 850000, priceType: 'one-time', location: 'Delhi', photos: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500'] },
    { title: 'iPhone 14 Pro', description: 'Almost new iPhone with original box.', category: 'Electronics', listingType: 'Sale', price: 90000, priceType: 'one-time', location: 'Bangalore', photos: ['https://images.unsplash.com/photo-1677353138241-de2f42a8d381?w=500'] },
    { title: 'Wooden Sofa Set', description: 'Comfortable 5-seater sofa.', category: 'Furniture', listingType: 'Sale', price: 15000, priceType: 'one-time', location: 'Pune', photos: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'] },
    { title: 'Office Space for Rent', description: 'Fully furnished office space.', category: 'Property', listingType: 'Rent', price: 50000, priceType: 'per month', location: 'Hyderabad', photos: ['https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500'] },
];

const importData = async () => {
    try {
        // Purana data delete karein
        await User.deleteMany();
        await Listing.deleteMany();

        // Naye users insert karein
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id; // Admin user ki ID le lo

        // Listings mein owner ki ID add karein
        const sampleListings = listings.map(listing => {
            return { ...listing, owner: adminUser }; // Saare listings ka owner admin ko bana do
        });

        // Nayi listings insert karein
        await Listing.insertMany(sampleListings);

        console.log('✅ Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}
 
const destroyData = async () => {
    try {
        await User.deleteMany();
        await Listing.deleteMany();
        console.log('🗑️ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

// Command line argument check karein
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}