const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String
}));

// Middleware to parse incoming request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" directory

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login1.html'));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Authenticate user
  User.findOne({ email, password })
    .then(user => {
      if (user) {
        res.redirect('http://127.0.0.1:5500/indx.html'); // Redirect to the dashboard page
      } else {
        res.send('Invalid email or password');
      }
    })
    .catch(err => {
      console.error('Error during login:', err);
      res.status(500).send('An error occurred');
    });
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Create a new user
  const newUser = new User({ username, email, password });
  newUser.save()
    .then(() => res.redirect('http://localhost:3000'))
    .catch(err => {
      console.error('Error during sign up:', err);
      res.status(500).send('An error occurred');
    });
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
