var elasticsearch = require('elasticsearch');
var feedmap = require('../feedmap.js');

var express = require('express');
var router = express.Router();
var timeSince = require('../utilities.js').timeSince;
var HTMLParser = require('fast-html-parser');

var client = new elasticsearch.Client( {
  hosts: [
    'http://localhost:9200/'
  ]
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('Elasticsearch cluster is down!');
    process.exit();
  } else {
    console.log('Elasticsearch connnection is healthy.');
  }
});



function getSrcFromAttrString(str){
    var attrArray = str.split(" ");
    var o = {};
    attrArray.forEach(function(e){
        e = e.split("=");
        if (e[0] == 'src') o.src = e[1].trim().substring(1, e[1].length - 2);
    });

    return o.src;
}

router.get('/:from', function(request, response) {


  var pageNum = request.params.from > 0 ? request.params.from : 1;
  var perPage = 12; //request.params.per_page;
  var userQuery = request.query.query_string;
  var aliasoptions = request.query.aliases ? request.query.aliases : feedmap.keys();
  if (typeof aliasoptions === "string") aliasoptions = [aliasoptions];
  console.log(aliasoptions);
  function queryelasticsearch(q_index, userQuery, aliases, fromPage, pagesize) {

    var searchParams;

    if (userQuery) {
        console.log("if");
        searchParams = {
            index: q_index,
            from: (fromPage - 1) * pagesize,
            size: pagesize,
            body: {
                query : {
                    filtered : {
                        filter : {
                            terms : {
                                alias : aliases
                            }
                        },
                        query : {
                            match : {
                                title : {
                                    query : userQuery,
                                    operator : 'or'
                                }
                            }
                        }
                    }
                },
                sort : [
                    {
                        "published" :  {
                            order : "desc"
                        }
                    }
                ]
            }
        };


    } else {
        searchParams = {
            index: q_index,
            from: (fromPage - 1) * pagesize,
            size: pagesize,
            body: {
                query : {
                    filtered : {
                        filter : {
                            terms : {
                                alias : aliases
                            }
                        },
                        query : {
                            match_all : {}
                        }
                    }
                },
                sort : [
                    {
                        "published" :  {
                            order : "desc"
                        }
                    }
                ]
            }
        };
    }


    client.search(searchParams, function (err, res) {

        if (err) {
              // handle error
              console.log("error occured :", err);
              throw err;
        }


        var results = res.hits.hits.map(function (item) {



            var articleDate = timeSince(new Date(item._source.published));

            return {
                id : item._id,
                title : item._source.title,
                date : articleDate + " ago",
                feedalias : item._source.alias
            };
        });

        response.send({
              feeds: results,
              page: fromPage,
              pages: Math.ceil(res.hits.total / pagesize)
        });
    });

}

  queryelasticsearch('reader', userQuery, aliasoptions, pageNum, perPage);

});

module.exports = router;