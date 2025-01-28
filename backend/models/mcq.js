const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  area: String,
  question: String,
  options: [{ text: String, isCorrect: Boolean }],
});

module.exports = mongoose.model('MCQ', mcqSchema);