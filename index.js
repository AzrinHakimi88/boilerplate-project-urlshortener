require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));

let currentshortUrl = 1
let urlMapping = {}

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
    const url = req.body.url;
    try{
      new URL(url)
      urlMapping[currentshortUrl++] = url
      res.json({ original_url : url, short_url : currentshortUrl - 1})
    }
    catch(err){
      res.json({'error' : 'invalid url'})
    }

})


app.get('/api/shorturl:shortUrl',function(req,res){
    const shortUrl = req.params.shortUrl
    
    shortUrl = parseInt(shortUrl)
    const originalUrl = urlMapping[shortUrl]
    console.log(originalUrl)

    if(originalUrl){
      res.redirect(originalUrl)
    } 
    else{
      res.json({ error: 'short url not found' });
    }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
