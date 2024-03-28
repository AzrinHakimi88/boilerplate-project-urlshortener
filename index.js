require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));



app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let nextShortUrlId = 1;

// Database to store mappings between short URLs and original URLs
const urlMappings = {};

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle POST requests to /api/shorturl
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate the URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Generate short URL
  const shortUrl = nextShortUrlId++;

  // Store mapping between short URL and original URL
  urlMappings[shortUrl] = originalUrl;

  // Return JSON response with original and short URLs
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Route to handle GET requests to /api/shorturl/:short_url
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlMappings[shortUrl];

  if (originalUrl) {
    // Redirect to the original URL
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'short url not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
