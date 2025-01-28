// backend/models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isAnonymous: { type: Boolean, default: false },
  senderName: { type: String, default: 'Anonymous' } // To store the display name
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;