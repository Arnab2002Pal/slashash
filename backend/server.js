// Import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

// Create an instance of the Express app
const app = express();
const port = process.env.PORT || 5000;

// Apply CORS middleware to allow cross-origin requests
app.use(cors());

// Use the JSON middleware to parse incoming JSON data
app.use(express.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/movieFavorites', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the Movie model
const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
  type: String,
  poster: String,
});

// Create the Movie model based on the schema
const Movie = mongoose.model('Movie', movieSchema);

// Search endpoint to fetch movies from OMDB API
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    // Send a GET request to OMDB API using Axios
    const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=9989d8ea`);
    // Return the search results from the OMDB API
    res.json(response.data.Search);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Save favorite endpoint to store a movie in the database
app.post('/api/favorite', async (req, res) => {
  try {
    const { title, year, type, poster } = req.body;
    // Create a new Movie instance and save it to the database
    const movie = new Movie({ title, year, type, poster });
    await movie.save();
    // Return the saved movie data
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Fetch favorites endpoint to get all saved movies from the database
app.get('/api/favorites', async (req, res) => {
  try {
    // Retrieve all movies from the database
    const favorites = await Movie.find();
    // Return the list of favorite movies
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred fetching favorites.' });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
