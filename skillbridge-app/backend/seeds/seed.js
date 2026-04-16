import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const seedData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany();
    await Skill.deleteMany();

    console.log('Data Destroyed...');

    // 1. Create a Buyer
    const buyerInfo = await User.create({
      name: 'Test Buyer',
      email: 'buyer@test.com',
      password: 'password123',
      role: 'buyer',
    });

    // 2. Create a Seller
    const sellerInfo = await User.create({
      name: 'Test Seller',
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller',
      skills: ['React', 'Node.js'],
      bio: 'Fullstack developer with 5 years of experience.',
      experience: 'Senior',
      hourlyRate: 50,
      avatar: 'MJ'
    });

    // 3. Create Skills
    await Skill.create([
      {
        title: 'UI/UX Design Mentorship',
        category: 'Design',
        description: 'Learn to craft stunning user interfaces and seamless user experiences.',
        seller: sellerInfo._id,
        price: 300,
        duration: 60,
        tags: ['UX', 'Figma', 'UI'],
      },
      {
        title: 'React Bug Fixing Session',
        category: 'Web Development',
        description: 'I will help you fix your React bugs urgently within a 1-hour session.',
        seller: sellerInfo._id,
        price: 250,
        duration: 60,
        tags: ['React', 'JavaScript', 'Frontend'],
      },
    ]);

    console.log('Data Imported successfully! ✅');
    console.log('----------------------------------------------------');
    console.log('You can now log in with:');
    console.log('Buyer: buyer@test.com / password123');
    console.log('Seller: seller@test.com / password123');
    console.log('----------------------------------------------------');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
