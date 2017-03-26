function FeedBatchLoader() {

    this.feedfilter = [];
    this.searchstring = '';
    this.setFeedFilter = function(aliases) {
        this.feedfilter = aliases;
    };
    this.setSearchString = function(str) {
        this.searchstring = str;
    };
    this.loadPrevFeedBatch = loadPrevFeedBatch;
    this.loadNextFeedBatch = loadNextFeedBatch;
    this.loadFeedBatch = loadFeedBatch;

}


function loadPrevFeedBatch(){

    console.log("load Prev Batch called!!");
    var fromPoint = document.getElementById('prev-nav-btn').getAttribute('val');
    this.loadFeedBatch(fromPoint);

}

function loadNextFeedBatch(){

    console.log("load NEXT Batch called!!");
    var fromPoint= document.getElementById('next-nav-btn').getAttribute('val');
    this.loadFeedBatch(fromPoint);

}

function loadFeedBatch(fromPoint){

    var req = new XMLHttpRequest();
    fromPoint = fromPoint || 1;
    var url = "/getfeed/"+fromPoint;

    var querystring = "?";


    if (this.feedfilter && this.feedfilter.length) {
        for (var i=0; i < this.feedfilter.length; i++) {
            querystring += "aliases=" + this.feedfilter[i] + "&";
        }
    }

    if (this.searchstring && this.searchstring.length) {
        querystring += "query_string=" + this.searchstring;
    } else {
        querystring = querystring.substring(0, querystring.length-1);
    }

    url = url + querystring;

    req.open("GET", url, true);

    req.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            var response = JSON.parse(this.response);
            var feeddatas = response.feeds;

            var html = "";
            console.log(feeddatas);

            var noofgrids = feeddatas.length;

            var prevnavbtn = document.getElementById("prev-nav-btn");
            var nextnavbtn = document.getElementById("next-nav-btn");

            if (!noofgrids) {

                document.getElementById("feedgridlayout-container").innerHTML = "<h4><b>No results found.</b></h4>";
                prevnavbtn.style.visibility = "hidden";
                nextnavbtn.style.visibility = "hidden";

            } else {

                var noofrows = noofgrids%3==0? noofgrids/3 : Math.floor(noofgrids/3)+1;

                for(var i=1; i <= noofrows; i++){

                    html += "<div class='row'>\n";

                    var noofcols = 3;

                    noofcols = (i==noofrows && ((i*noofcols)!=noofgrids)) ? noofgrids%noofcols : 3;

                    for(var j=1; j<= noofcols; j++) {

                        var index = (3*i) - (3-j) - 1;

                        html += "<div class='col-md-3 feedbox'>";
                        html += "<div class='topic'>";
                        html += "<div class='topic-body'>";
                        html += feeddatas[index].title;
                        html += "</div>";
                        html += "<div class='topic-footer'>"
                        html += "<span class='feedid' hidden>" + feeddatas[index].id + "</span>";
                        html += "<div class='feedalias'>" + feeddatas[index].feedalias + "</div>"
                        html += "<div class='pubDate'>" + feeddatas[index].date + "</div>"
                        html += "</div>";
                        html += "</div>";
                        html += "</div>";
                    }

                    html += "</div>\n";

                }

                document.getElementById("feedgridlayout-container").innerHTML = html;

                nextnavbtn.setAttribute("val", parseInt(response.page)-1);
                nextnavbtn.style.visibility = "hidden";




                if (parseInt(response.page)-1 >= 1) {

                    prevnavbtn.setAttribute("val", parseInt(response.page)-1);
                    prevnavbtn.style.visibility = "visible";

                } else {

                    prevnavbtn.setAttribute("val", parseInt(response.page)-1);
                    prevnavbtn.style.visibility = "hidden";

                }


                if (parseInt(response.page)-1 < response.pages) {

                    nextnavbtn.setAttribute("val", parseInt(response.page)+1);
                    nextnavbtn.style.visibility = "visible";

                } else {

                    nextnavbtn.setAttribute("val", parseInt(response.page)-1);
                    nextnavbtn.style.visibility = "hidden";

                }
            }

        } else {

            document.getElementById("feedgridlayout-container").innerHTML = "<h4><b>Bad request.</b></h4>";

        }

    };

    req.send();
}

var feedbatchloader = new FeedBatchLoader();