//facetoptions : array => sources of the feeds.
var facetoptions = document.getElementsByClassName('facet-option');

function iterateCollection (collection) {
    return function(f) {
        for(var i = 0; collection[i]; i++) {
            f(collection[i], i);
        }
    };
}

iterateCollection(facetoptions)(function(facetoption, index){
    facetoption.addEventListener('click', gatherFeedAliases, false);
});

function gatherFeedAliases() {

    feedbatchloader.feedfilter.splice(0);

    for(var i=0; i<facetoptions.length; i++)
    {
        if(facetoptions[i].checked) {
            feedbatchloader.feedfilter.push(facetoptions[i].value);
        }
    }

    feedbatchloader.loadFeedBatch();

}
