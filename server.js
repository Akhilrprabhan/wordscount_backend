const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://14akhilrp96:14akhilrp96@test.wzqzc3o.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Create an Express app
const app = express();
app.use(express.json());
app.use(cors());

// Create a schema for the word count data
const wordCountSchema = new mongoose.Schema({
  url: String,
  count: Number,
  webLinks: [{ type: String }], // Add a field to store extracted website links
  isFavorite: { type: Boolean, default: false }, // Add a field to mark URLs as favorites
});

// Create a model based on the schema
const WordCount = mongoose.model('WordCount', wordCountSchema);

// Define a route to handle the word count request
app.post('/word-count', async (req, res) => {
  const { url } = req.body;

  try {
    // Make a GET request to the specified URL
    const response = await axios.get(url);
    const cleanedData = response.data.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

    // Split the cleaned data into an array of words
    const words = cleanedData.split(' ');

    // Count the number of words
    const wordCount = words.length;

    // Extract website links from the HTML
    const $ = cheerio.load(response.data);
    const extractedLinks = [];
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('http')) {
        extractedLinks.push(href);
      }
    });

    // Save the word count and extracted website links to the database
    const wordCountData = new WordCount({
      url: url,
      count: wordCount,
      webLinks: extractedLinks,
    });

    await wordCountData.save();
    console.log('Word count and web links saved to the database');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error retrieving website data:', error.message);
    res.sendStatus(500);
  }
});

// Define a route to mark a website URL as favorite
app.put('/mark-favorite', (req, res) => {
  const { url, isFavorite } = req.body;

  WordCount.findOneAndUpdate(
    { url: url },
    { isFavorite: isFavorite },
    { new: true }
  )
    .then((wordCountData) => {
      console.log(`URL marked as favorite: ${url}`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(`Error marking URL as favorite: ${url}`, error);
      res.sendStatus(500);
    });
});

// Define a route to retrieve the word count data
app.get('/word-counts', (req, res) => {
  WordCount.find()
    .then((wordCounts) => {
      res.json(wordCounts);
    })
    .catch((error) => {
      console.error('Error retrieving word count data:', error);
      res.sendStatus(500);
    });
});

// Define a route to delete the word count of a URL
app.delete('/word-count/:id', (req, res) => {
  const { id } = req.params;

  WordCount.findByIdAndDelete(id)
    .then(() => {
      console.log(`Word count deleted: ${id}`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(`Error deleting word count: ${id}`, error);
      res.sendStatus(500);
    });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
