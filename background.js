 chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var img = 'icon3.png';
        chrome.pageAction.show(sender.tab.id);
        chrome.pageAction.setIcon( {tabId: sender.tab.id, path: img} );
 });


chrome.pageAction.onClicked.addListener( function(tab) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {greeting: "hey back"}, function(response) {
            ;
        });
    });
});
