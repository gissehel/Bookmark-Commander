let lastTabId = 0;
let tab_clicks = {};

// Called when the user clicks on the icon.
chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.create({
        'url': chrome.extension.getURL('bc.html')
    });
});
