const mongoose = require('mongoose');

const areaOfExpertiseSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('AreaOfExpertise', areaOfExpertiseSchema);