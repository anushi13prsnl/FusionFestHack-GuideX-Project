// filepath: /c:/Users/dell/Desktop/FusionFest-GuideX/backend/populateRecommendations.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recommendation = require('./models/recommendation');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGODB_URL);

const recommendations = [
  {
    title: 'Learn CSS',
    description: 'A comprehensive guide to learning CSS.',
    area: 'frontend',
  },
  {
    title: 'Node.js Basics',
    description: 'Introduction to Node.js for backend development.',
    area: 'backend',
  },
  {
    title: 'MERN Stack Tutorial',
    description: 'Learn the MERN stack with this step-by-step tutorial.',
    area: 'mern',
  },
  {
    title: 'AI for Beginners',
    description: 'An introductory course on Artificial Intelligence.',
    area: 'alml',
  },
];

const populateRecommendations = async () => {
  try {
    await Recommendation.insertMany(recommendations);
    console.log('Recommendations inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting recommendations:', error);
    mongoose.connection.close();
  }
};

populateRecommendations();