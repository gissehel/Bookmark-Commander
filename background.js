let lastTabId = 0;
let tab_clicks = {};

// Called when the user clicks on the icon.
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
        'url': chrome.runtime.getURL('bc.html')
    });
});
