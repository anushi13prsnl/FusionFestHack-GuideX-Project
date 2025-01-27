const express = require('express');
const path = require('path');
const cors = require('cors'); // Import the cors package
const db = require('./db');
const User = require('./models/user');

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5713', 'http://localhost:5714'], // Allow all relevant origins
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});