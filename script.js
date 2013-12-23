var on = false; 
var doneOnce = false;
var nodes = []
$( document ).ready(function() {
    chrome.runtime.sendMessage( {greeting : "hey"}, function(response) {
        ;//nothing special
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (!on) {
            nodes = getNodes('[\u0600-\u06FF]');
        }
        else {
            rmHighlight(nodes);
        }
        on = !on;
});