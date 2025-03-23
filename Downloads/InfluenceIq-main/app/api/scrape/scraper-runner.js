// This is a standalone script to run the Instagram scraper
// It avoids Next.js static analysis issues by running in a separate process

const { scrapeInstagramReels } = require('./scraper.js');
const path = require('path');

async function run() {
  try {
    // Get username from command line arguments
    const username = process.argv[2];
    
    if (!username) {
      console.error('Error: Username is required');
      process.exit(1);
    }
    
    console.log(`Starting to scrape for user: ${username}`);
    
    // Set up output path
    const outputFile = path.join(process.cwd(), 'app/api/scrape', `${username}_data.json`);
    
    // Run the scraper
    await scrapeInstagramReels(username, outputFile);
    
    console.log(`Scraping completed for ${username}`);
    process.exit(0);
  } catch (error) {
    console.error('Error in runner script:', error);
    process.exit(1);
  }
}

// Run the script
run(); 