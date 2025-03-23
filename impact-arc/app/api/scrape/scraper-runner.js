// This is a standalone script to run the Instagram scraper
// It avoids Next.js static analysis issues by running in a separate process

const { scrapeInstagramReels } = require('./scraper.js');
const path = require('path');
const fs = require('fs');

// Set a maximum execution time (5 minutes)
const MAX_EXECUTION_TIME = 5 * 60 * 1000;
const timeout = setTimeout(() => {
  console.error('Script execution timed out after 5 minutes');
  process.exit(2); // Exit with a specific code for timeout
}, MAX_EXECUTION_TIME);

// Clear the timeout when the process exits
process.on('exit', () => {
  clearTimeout(timeout);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  fs.writeFileSync(
    path.join(process.cwd(), 'app/api/scrape', 'error_log.txt'), 
    `${new Date().toISOString()}: ${error.stack || error.message || error}\n`, 
    { flag: 'a' }
  );
  process.exit(1);
});

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
    
    // Run the scraper with a timeout
    try {
      await scrapeInstagramReels(username, outputFile);
      console.log(`Scraping completed for ${username}`);
      process.exit(0);
    } catch (scraperError) {
      console.error(`Error while scraping ${username}:`, scraperError);
      
      // Write a minimal output file with error information so the API can respond
      const errorData = {
        error: true,
        message: scraperError.message || 'Unknown scraper error',
        timestamp: new Date().toISOString(),
        userInfo: {
          username: username,
          error: true
        }
      };
      
      fs.writeFileSync(outputFile, JSON.stringify(errorData, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error('Error in runner script:', error);
    process.exit(1);
  }
}

// Run the script
run(); 