const http = require('http');
var path = require('path');
var express = require('express');

var router = express.Router();


var isUrl = require('is-url');
var isXml = require('is-xml');

var feedmap = require('../feedmap.js');
var utilities = require('../utilities.js');

var logstashconfigpath = require('../config.json')["logstashconfigpath"];
var feedmapjsonfile = require('../config.json')["feedmapjsonfile"];

router.post('/', function(req, res){

  console.log("trying to add a feed source.");

  if((isUrl(req.body.feedurl))){

    console.log("is a valid url");

    http.get(req.body.feedurl, function(response){

      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {

        if (isXml(str.toString())) {
          console.log("is a valid xml");

          feedmap.append(req.body.alias, req.body.feedurl);

          utilities.createLogstashConfigFile(feedmap.getMap(), logstashconfigpath);

          utilities.createFeedMapFile(feedmap.getMap(), feedmapjsonfile, function(){

              console.log("feedmap file updated successfully.")
              console.log(feedmap.keys());

              res.redirect('/');

          });



        } else {

          console.log("This ain't no XML");

        }

      });

    });

  } else {

    console.log("That's an invalid url");

  }

});

module.exports = router;