var jsonfile = require('jsonfile');
var feedmapjsonfile = require('./config.json')["feedmapjsonfile"];


function Feedmap() {


    this.append = function(alias, url) {
        Feedmap.map[alias] = url;
    };

    this.getMap = function() {
        var map = Feedmap.map;
        return map;
    }

    this.refresh = function() {
        Feedmap.map = jsonfile.readFileSync(feedmapjsonfile);
    }
    this.keys = function() {
        return Object.keys(Feedmap.map);
    };

    this.values = function() {
        //var map = this.map;
        return Object.keys(Feedmap.map).map(function(key) {
            return Feedmap.map[key];
        });
    };

    this.length = function() {
        return Object.keys(Feedmap.map).length;
    };

};

Feedmap.map = jsonfile.readFileSync(feedmapjsonfile);
console.log(Feedmap.map);

var feedmap = new Feedmap();

module.exports = feedmap;