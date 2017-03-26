var fs = require('fs');
var jsonfile = require('jsonfile');

module.exports.createLogstashConfigFile = function(feedhashmap, filename) {
    //feedhashmap : [feedalias => feedlink]
    var inputblock = 'input {\n';

    for (var alias in feedhashmap) {

        var chunk = '   rss {\n'+
                    '       add_field => { \"alias\" => ' + '\"' + alias + '\" }\n' +
                    '       url => ' + '\"' +  feedhashmap[alias] + '\"\n' +
                    '       interval => 36000\n' +
                    '   }\n';

        inputblock += chunk;

    }

    inputblock += "}\n";

    var filterblock = '\nfilter {}\n';

    var outputblock = '\noutput {\n' +
        '   elasticsearch {\n' +
        '       action => \"index\"\n' +
        '       index => \"reader\"\n' +
        '       document_id => \"%{guid}\"\n' +
        '       document_type => \"rssfeed\"\n' +
        '       hosts => \"localhost\"\n' +
        '   }\n'+
        '   \n\nstdout {\n' +
        '       codec => rubydebug\n' +
        '   }\n'+
        '}\n';

    var content = inputblock + filterblock + outputblock;

    fs.writeFile(filename, content, function(err) {
        if (err) {
            console.log("Couldn't Write to the file. Error occured.");
        }

        console.log("Successfully wrote to the file.");
    });
};

module.exports.createFeedMapFile = function(feedhashmap, filename, callback) {

    jsonfile.writeFile(filename, feedhashmap, {spaces: 2}, function(err) {
        if (err) console.error("Couldn't write to json file :" + err);
        else callback();
    });

};

module.exports.timeSince = function(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";

};