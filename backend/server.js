// const express = require('express');
// const path = require('path');
// const db = require('./db');
// const User = require('./models/user');

// const app = express();
// app.use(express.json());

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../frontend')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
// });

// // Register new user
// app.post('/api/users', async (req, res) => {
//   const { name, email, picture, phoneNumber, areasOfExpertise, areasOfInterest, availability, experienceLevel, bio, location, linkedInProfile, gender, age } = req.body;
//   try {
//     const newUser = new User({ name, email, picture, phoneNumber, areasOfExpertise, areasOfInterest, availability, experienceLevel, bio, location, linkedInProfile, gender, age, coins: 100, tier: 'Copper' });
//     await newUser.save();
//     res.json(newUser);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get user data
// app.get('/api/users/:email', async (req, res) => {
//   const { email } = req.params;
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Update user data
// app.put('/api/users/:email', async (req, res) => {
//   const { email } = req.params;
//   const { name, role, tier, bio } = req.body;
//   try {
//     const user = await User.findOneAndUpdate(
//       { email },
//       { name, role, tier, bio },
//       { new: true }
//     );
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

//_____________________________________________________________________
const express = require('express');
const path = require('path');
const db = require('./db');
const User = require('./models/user');

const app = express();
app.use(express.json());

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
