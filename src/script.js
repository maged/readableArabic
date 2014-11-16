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

/*
    if (!documentEdited){
        documentEdited = true; // were reevaluating page html
                                // document ready will be called multiple times

        //console.log("recieved nodes.")
        nodes = getNodes('[\u0600-\u06FF]');
    }
*/

});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // icon has been clicked
        //console.log("greeting recieved " + request.greeting);
        if (request.greeting == "hey"){
            if (!on) {
                console.log("called getNodes. " + lock);
                nodes = addHighlight();
            }
            else {
                console.log("removing highlights.\n");
                rmHighlight(nodes);
            }
            on = !on;
        }
});


