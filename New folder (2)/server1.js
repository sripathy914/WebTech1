const express = require('express');
const mongoose = require('mongoose');

// Create an Express application
const app = express();
const port = 3001;

// Establish the MongoDB connection
mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a schema and model for the contact form data
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true }
});

const ContactModel = mongoose.model('Contact', ContactSchema);

// Set up middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Define a route to serve the contact form page
app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
});

// Define a route to handle the contact form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Create a new contact record
  const contact = new ContactModel({ name, email, message });

  // Save the contact record to the database
  contact.save()
    .then(() => {
      res.send('Message sent successfully!');
    })
    .catch(err => {
      console.error('Failed to save contact message:', err);
      res.status(500).send('An error occurred while sending the message.');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
