const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a Review model
const Review = mongoose.model('Review', new mongoose.Schema({
  menuItem: String,
  rating: Number,
  comment: String
}));

// Middleware to parse incoming request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/review.html');
});

app.post('/reviews', (req, res) => {
  const { menuItem, rating, comment } = req.body;

  const review = new Review({ menuItem, rating, comment });
  review.save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(error => {
      console.error('Error inserting review:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

app.get('/reviews', (req, res) => {
  Review.find()
    .then(reviews => {
      res.json(reviews);
    })
    .catch(error => {
      console.error('Error getting reviews:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Start the server
const port = 3003;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
