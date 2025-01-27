const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  areasOfExpertise: { type: String, required: true },
  areasOfInterest: { type: String, required: true },
  availability: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  bio: { type: String, required: true },
  location: { type: String, required: true },
  linkedInProfile: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  coins: { type: Number, default: 100 },
  tier: { type: String, default: 'Copper' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;