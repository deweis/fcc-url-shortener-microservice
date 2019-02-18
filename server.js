'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var dns = require('dns');
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
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [];

// Read the POST request
app.post('/api/shorturl/new', function(req, res) {
  const errMsg = { error: 'invalid URL' };
  const regexp = /^(http(s?):\/\/(www\.){1}(\w+\.\w{2,}){1}(\.\w{2,}){0,2}(\/\w*)*)$/i;

  // Check if the url matches a valid pattern
  if (!regexp.test(req.body.url)) {
    return res.json(errMsg);
  } else {
    // lookup - but only works on 'www.google.com' but not on 'https://www.google.com'
    // extract http(s)...
    const reg = /^http(s?):\/\//i;
    let str = req.body.url;

    str = str.replace(reg, '');

    // check if dns exists for the url
    dns.lookup(str, function(err, addr) {
      console.log('looking up: ', str);
      if (err) {
        console.log('lookup Error: ', err);
        return res.json(errMsg);
      } else {
        // if url ok, add it to the db
        console.log('lookup addr: ', addr);

        const prvShort =
          urls.length === 0 ? 0 : urls[urls.length - 1].short_url;
        const crntShort = prvShort + 1;
        const result = { original_url: req.body.url, short_url: crntShort };

        urls.push(result);

        return res.json(urls[urls.length - 1]);
      }
    });
  }
});

// handle short url
app.get('/api/shorturl/:short_url', function(req, res) {
  const resUrl = urls.find(x => x.short_url === Number(req.params.short_url));
  //res.json({ short_url: req.params.short_url, original_url: resUrl.original_url });

  res.redirect(resUrl.original_url);
});

/* 1. I can POST a URL to [project_url]/api/shorturl/new and I will receive a shortened URL in the JSON response. Example : {"original_url":"www.google.com","short_url":1}
 * - Handle POST request: POST [project_url]/api/shorturl/new - body (urlencoded): url=https://www.google.com
 * - Generate short_url
 * - TBD: Store short_url and original link in mongoDB - {"original_url":"www.google.com","short_url":1}
 * - Return short_url in the JSON response. Example : {"original_url":"www.google.com","short_url":1}
 *
 * 2. Check if url is valid
 * - TBD: Check format with regexp
 * - TBD: Check formal with the function dns.lookup(host, cb) from the dns core module
 *
 * 3. When I visit the shortened URL, it will redirect me to my original link.
 * - [this_project_url]/api/shorturl/3 will redirect to http://forum.freecodecamp.com */

app.listen(port, function() {
  console.log('Node.js listening ...');
});
