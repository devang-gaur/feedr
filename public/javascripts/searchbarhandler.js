function handleSearchSubmit() {

    var searchstring = document.getElementById("searchbar").value;

    feedbatchloader.setSearchString(searchstring);

    feedbatchloader.loadFeedBatch();

    return false;

}