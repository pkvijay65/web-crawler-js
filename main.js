
const { crawlPage } = require('./crawl'); // Assuming crawlPage is in crawl.js
const { printReport } = require('./report.js')

async function main() {
    const args = process.argv.slice(2); // Get command line arguments, excluding the first two elements

    if (args.length < 1) {
        console.error("Error: No URL provided. Usage: npm run start <BASE_URL>");
        process.exit(1); // Exit with a non-zero status code to indicate error
    } else if (args.length > 1) {
        console.error("Error: Too many arguments. Usage: npm run start <BASE_URL>");
        process.exit(1); // Exit with a non-zero status code to indicate error
    } else {
        const baseURL = args[0];
        console.log(`Crawler starting at base URL: ${baseURL}`);
        // Additional logic for the crawler will go here in the future
        const pages = await crawlPage(baseURL, baseURL);
        console.log('Crawled pages:', pages);

        printReport(pages)
    }
}
  
  main()