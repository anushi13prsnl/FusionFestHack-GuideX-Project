const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  title: String,
  description: String,
  area: String,
});

module.exports = mongoose.model('Recommendation', recommendationSchema);