// filepath: /c:/Users/dell/Desktop/FusionFest-GuideX/backend/populateMCQs.js

const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose');
const MCQ = require('./models/mcq');

mongoose.connect('MONGODB_URL', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mcqs = [
  {
    area: 'frontend',
    question: 'What does CSS stand for?',
    options: [
      { text: 'Cascading Style Sheets', isCorrect: true },
      { text: 'Colorful Style Sheets', isCorrect: false },
      { text: 'Creative Style Sheets', isCorrect: false },
      { text: 'Computer Style Sheets', isCorrect: false },
    ],
  },
  {
    area: 'backend',
    question: 'Which of the following is a backend language?',
    options: [
      { text: 'HTML', isCorrect: false },
      { text: 'CSS', isCorrect: false },
      { text: 'JavaScript', isCorrect: false },
      { text: 'Node.js', isCorrect: true },
    ],
  },
  {
    area: 'mern',
    question: 'What does MERN stand for?',
    options: [
      { text: 'MongoDB, Express, React, Node', isCorrect: true },
      { text: 'MySQL, Express, React, Node', isCorrect: false },
      { text: 'MongoDB, Express, Redux, Node', isCorrect: false },
      { text: 'MongoDB, Express, React, Next', isCorrect: false },
    ],
  },
  {
    area: 'alml',
    question: 'What is the full form of AI?',
    options: [
      { text: 'Artificial Intelligence', isCorrect: true },
      { text: 'Automated Intelligence', isCorrect: false },
      { text: 'Automatic Intelligence', isCorrect: false },
      { text: 'Autonomous Intelligence', isCorrect: false },
    ],
  },
];

const populateMCQs = async () => {
  try {
    await MCQ.insertMany(mcqs);
    console.log('MCQs inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting MCQs:', error);
    mongoose.connection.close();
  }
};

populateMCQs();