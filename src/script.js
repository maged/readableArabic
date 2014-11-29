var on = false; 
var doneOnce = false;
documentEdited = false; 
var nodes = [];
lock = null; // primitive lock - are race conditions the bug cause?

//TODO: only send message if Arabic text is present
chrome.runtime.sendMessage( {greeting : "hey"} );


$( document ).ready(function() {
    // document is ready, set up icon
    //console.log("document ready");
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // icon has been clicked
        //console.log("greeting recieved " + request.greeting);
        if (request.greeting == "hey"){
            if (!on) {
                addHighlight();
            }
            else {
                rmHighlight(nodes);
            }
            on = !on;
        }
});


