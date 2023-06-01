const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a Contact model
const Contact = mongoose.model('Contact', new mongoose.Schema({
  name: String,
  email: String,
  message: String
}));

// Middleware to parse incoming request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const contact = new Contact({ name, email, message });
  contact.save()
    .then(() => {
      res.status(201).send('<script>alert("You will receive a reply soon."); window.location.href = "http://127.0.0.1:5500/indx.html";</script>');
    })
    .catch(error => {
      console.error('Error inserting contact:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Start the server
const port = 3004;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
