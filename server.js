'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

/* 1. I can POST a URL to [project_url]/api/shorturl/new and I will receive a shortened URL in the JSON response. Example : {"original_url":"www.google.com","short_url":1}
 * - Handle POST request: POST [project_url]/api/shorturl/new - body (urlencoded): url=https://www.google.com
 * - Generate short_url
 * - Store short_url and original link in mongoDB - {"original_url":"www.google.com","short_url":1}
 * - Return short_url in the JSON response. Example : {"original_url":"www.google.com","short_url":1}
 *
 * 2. Check if url is valid
 * - Check format with regexp
 * - Check formal with the function dns.lookup(host, cb) from the dns core module
 *
 * 3. When I visit the shortened URL, it will redirect me to my original link.
 * - [this_project_url]/api/shorturl/3 will redirect to http://forum.freecodecamp.com
 *
 *
 * - Handle GET request with hardcoded value (handle the freecodecamp version)
 * - Handle POST request with hardcoded value (return random short_url in json format)
 * - Handle url verification - regexp / dns.lookup
 * - Get from mongoDB
 * - Write to mongoDB
 *
 **/

app.listen(port, function() {
  console.log('Node.js listening ...');
});
