 chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    	// page script sent confirmation
    	//will add icon to omnibar
        var img = 'icon.png';
        chrome.pageAction.show(sender.tab.id);
        chrome.pageAction.setIcon( {tabId: sender.tab.id, path: img} );
 });


chrome.pageAction.onClicked.addListener( function(tab) {
	// our icon was clicked on tab tab
	//console.log(tab.id + " icon was clicked.\n");

    chrome.tabs.sendMessage(tab.id, {greeting: "hey"});
});
