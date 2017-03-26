var feedmap = require('../feedmap');
var path = require('path');
var express = require('express');
var router = express.Router();

var pics = {
  plus :  path.join('../' , 'images', 'plusicon.png')
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { pics : pics , websites : feedmap.keys()});
});

module.exports = router;