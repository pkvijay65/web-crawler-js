
const { JSDOM } = require("jsdom");

function normalizeUrl(url){
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
      fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}



function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for (const aElement of aElements){
      if (aElement.href.slice(0,1) === '/'){
        try {
          urls.push(new URL(aElement.href, baseURL).href)
        } catch (err){
          console.log(`${err.message}: ${aElement.href}`)
        }
      } else {
        try {
          urls.push(new URL(aElement.href).href)
        } catch (err){
          console.log(`${err.message}: ${aElement.href}`)
        }
      }
    }
    return urls
  }

  async function fetchWithNodeFetch(url) {
    const { default: fetch } = await import('node-fetch');
    return fetch(url);
}

async function crawlPage(baseURL, currentURL, pages = {}) {
  // Step 1: Check if currentURL is on the same domain as baseURL
  if (!currentURL.startsWith(baseURL)) {
      return pages;
  }

  // Step 2: Normalize currentURL
  const normalizedURL = normalizeUrl(currentURL);

  // Step 3: Check if we've already visited this URL
  if (pages[normalizedURL]) {
      pages[normalizedURL]++;
      return pages;
  }

  // Step 4: Add new entry for the URL
  pages[normalizedURL] = normalizedURL === baseURL ? 0 : 1;

  // Step 5: Fetch request to the current URL
  console.log(`Crawling: ${currentURL}`);
  try {
      const response = await fetch(currentURL);
      const body = await response.text();

      // Step 6: Get all URLs from the HTML
      const urls = getURLsFromHTML(body, baseURL);

      // Step 7: Recursively crawl each URL
      for (const url of urls) {
          pages = await crawlPage(baseURL, url, pages);
      }
  } catch (error) {
      console.error(`Failed to fetch ${currentURL}: ${error.message}`);
  }

  // Step 8: Return updated pages object
  return pages;
}


module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage
};