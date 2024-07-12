console.log("Content script loaded");

// Extract relevant content from the current page
let pageTitle = document.title;
let pageUrl = window.location.href;
let articles = [];

console.log("Page title:", pageTitle);
console.log("Page URL:", pageUrl);

// Twitter specific selectors
let tweetElements = document.querySelectorAll('article div[lang]');

tweetElements.forEach(tweet => {
    let tweetText = tweet.innerText;
    let tweetLink = tweet.closest('a') ? tweet.closest('a').href : pageUrl;

    if (tweetText) {
        articles.push({ title: tweetText, link: tweetLink });
    }
});

console.log("Extracted articles:", articles);

// Convert to RSS feed format
let rssFeed = `
  <rss version="2.0">
    <channel>
      <title>${pageTitle}</title>
      <link>${pageUrl}</link>
      <description>Generated RSS feed for ${pageTitle}</description>
      ${articles.map(article => `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${article.link}</link>
        </item>
      `).join('')}
    </channel>
  </rss>
`;

console.log("Generated RSS feed:", rssFeed);

// Create a blob from the RSS feed string
let blob = new Blob([rssFeed], { type: 'text/xml' });
let url = URL.createObjectURL(blob);

// Create a link element
let a = document.createElement('a');
a.href = url;
a.download = `${pageTitle}.xml`;

// Append the link to the body
document.body.appendChild(a);

// Programmatically click the link to trigger the download
a.click();

// Remove the link from the document
document.body.removeChild(a);

console.log("RSS feed created and downloaded");
