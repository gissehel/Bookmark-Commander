var lastTabId = 0;

var tab_clicks = {};


// Called when the user clicks on the icon.

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        'url': chrome.extension.getURL('bc.html')
    });
});
