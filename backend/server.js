const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const User = require('./models/user');
const Message = require('./models/message'); // Import the Message model

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5713', 'http://localhost:5714'],
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5713', 'http://localhost:5714'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Register new user
app.post('/api/users', async (req, res) => {
  const { name, email, picture, phoneNumber, areasOfExpertise, areasOfInterest, availability, experienceLevel, bio, location, linkedInProfile, gender, age } = req.body;
  try {
    const newUser = new User({ name, email, picture, phoneNumber, areasOfExpertise, areasOfInterest, availability, experienceLevel, bio, location, linkedInProfile, gender, age, coins: 100, tier: 'Copper' });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user data by email
app.get('/api/users/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user data by ID
app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user data
app.put('/api/users/:email', async (req, res) => {
  const { email } = req.params;
  const { name, role, tier, bio } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, role, tier, bio },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to calculate tier based on coins
const getTier = (coins) => {
  if (coins >= 1000) return 'Legendary';
  if (coins >= 750) return 'Diamond';
  if (coins >= 500) return 'Gold';
  if (coins >= 250) return 'Silver';
  return 'Copper';
};

// Send coins
app.post('/api/send-coins', async (req, res) => {
  const { senderEmail, recipientEmail, amount } = req.body;
  try {
    const sender = await User.findOne({ email: senderEmail });
    const recipient = await User.findOne({ email: recipientEmail });

    if (!sender || !recipient) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (sender.coins < amount) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    sender.coins -= amount;
    recipient.coins += amount;

    // Update tiers based on new coin amounts
    sender.tier = getTier(sender.coins);
    recipient.tier = getTier(recipient.coins);

    await sender.save();
    await recipient.save();

    res.json({ sender, recipient });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send message
app.post('/api/chat', async (req, res) => {
  const { sender, recipient, message } = req.body;
  try {
    const newMessage = new Message({ sender, recipient, message });
    await newMessage.save();
    io.to(recipient).emit('receiveMessage', newMessage); // Emit the message to the recipient
    io.to(sender).emit('receiveMessage', newMessage); // Emit the message to the sender
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat messages between two users
app.get('/api/chat/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (userEmail) => {
    socket.join(userEmail);
  });

  socket.on('sendMessage', (message) => {
    io.to(message.recipient).emit('receiveMessage', message);
    io.to(message.sender).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});