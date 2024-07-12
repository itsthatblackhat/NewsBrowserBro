document.addEventListener('DOMContentLoaded', () => {
    const feedList = document.getElementById('feedList');
    const status = document.getElementById('status');

    // Load and display existing feeds
    chrome.storage.local.get(['rssFeeds'], (result) => {
        const feeds = result.rssFeeds || [];
        feeds.forEach(feed => addFeedToList(feed));
    });

    // Add a new RSS feed
    document.getElementById('addFeed').addEventListener('click', () => {
        const rssUrl = document.getElementById('rssUrl').value;
        if (rssUrl) {
            chrome.storage.local.get(['rssFeeds'], (result) => {
                const feeds = result.rssFeeds || [];
                feeds.push(rssUrl);
                chrome.storage.local.set({rssFeeds: feeds}, () => {
                    addFeedToList(rssUrl);
                    status.textContent = 'RSS feed added!';
                });
            });
        }
    });

    // Create an RSS feed from the current page
    document.getElementById('createFeed').addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.executeScript(tabs[0].id, {file: 'content.js'});
        });
    });

    // Function to add feed to the list in the popup
    function addFeedToList(feed) {
        const li = document.createElement('li');
        li.textContent = feed;
        feedList.appendChild(li);
    }
});
