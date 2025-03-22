import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

interface MediaData {
  videoSrc: string | null;
  thumbnailSrc: string | null;
  engagementCount: string | null;
  comments: { username: string; text: string }[];
  postDate: string | null;
  caption: string | null;
}

interface ReelData {
  reelUrl: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  engagementCount: string | null;
  postDate: string | null;
  caption: string | null;
  comments: { username: string; text: string }[];
}

async function scrapeInstagramReels(username: string): Promise<ReelData[]> {
  try {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to Instagram profile's reels section specifically
    await page.goto(`https://www.instagram.com/${username}/reels/`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for content to load - adjust selector if needed for reels tab
    await page.waitForSelector("article", { timeout: 30000 }).catch(() => {
      console.log("Could not find 'article' element, continuing anyway");
    });

    // Function to scroll and collect reel links
    const reelLinks = await page.evaluate(async (): Promise<string[]> => {
      const links = new Set<string>();

      // Scroll function
      const autoScroll = async (): Promise<void> => {
        return new Promise((resolve) => {
          let lastHeight = 0;
          let newHeight = 0;
          let scrollAttempts = 0;
          const maxScrollAttempts = 10; // Reduced scrolling attempts

          const scrollInterval = setInterval(() => {
            window.scrollBy(0, 1000);
            newHeight = document.body.scrollHeight;
            scrollAttempts++;

            if (
              newHeight === lastHeight ||
              scrollAttempts >= maxScrollAttempts
            ) {
              clearInterval(scrollInterval);
              resolve();
            }
            lastHeight = newHeight;
          }, 1000);
        });
      };

      // Get all reel links - specifically looking for reel links
      await autoScroll();

      // Target reel links specifically
      const reelElements = document.querySelectorAll('a[href*="/reel/"]');
      reelElements.forEach((element) => {
        const href = element.getAttribute("href");
        if (href && href.includes("/reel/")) {
          links.add(`https://www.instagram.com${href}`);
        }
      });

      return Array.from(links);
    });

    console.log(`Found ${reelLinks.length} reel links`);

    // Extract video URLs, thumbnails, comments and like count from each link
    const results: ReelData[] = [];
    for (const link of reelLinks.slice(0, 5)) { // Limit to first 5 reels
      try {
        // Navigate to the reel page
        await page.goto(link, { waitUntil: "networkidle2", timeout: 30000 });

        // Wait for the video element to load
        await page.waitForSelector("video", { timeout: 10000 }).catch(() => {
          console.log(`No video element found on page: ${link}`);
        });

        // Extract the video source URL, thumbnail, comments and like count
        const mediaData = await page.evaluate(async (): Promise<MediaData> => {
          const videoElement = document.querySelector("video");
          let videoSrc = videoElement ? videoElement.src : null;

          // Try to get thumbnail from poster attribute
          let thumbnailSrc = videoElement ? videoElement.poster : null;

          // If no poster attribute, try to get thumbnail from other sources
          if (!thumbnailSrc) {
            // Option 1: Look for the preview image that Instagram often loads
            const imgElements = document.querySelectorAll("img");
            for (const img of imgElements) {
              // Instagram often uses a large image as the preview
              if (
                img.width > 200 &&
                img.height > 200 &&
                !img.src.includes("profile")
              ) {
                thumbnailSrc = img.src;
                break;
              }
            }

            // Option 2: Look for meta og:image
            if (!thumbnailSrc) {
              const metaOgImage = document.querySelector(
                'meta[property="og:image"]'
              );
              if (metaOgImage) {
                thumbnailSrc = metaOgImage.getAttribute("content");
              }
            }
          }

          // Extract engagement metrics (likes/views)
          let engagementCount = null;
          // Instagram shows metrics in different ways for reels (views/likes)
          const metricElements = document.querySelectorAll(
            "section span, div > span"
          );
          for (const elem of metricElements) {
            const text = elem.textContent;
            if (text && (text.includes(" like") || text.includes(" view"))) {
              engagementCount = text.trim();
              break;
            }
          }

          // Alternative way to get metrics from meta description
          if (!engagementCount) {
            const metaElements = document.querySelectorAll("meta");
            for (const meta of metaElements) {
              if (meta.getAttribute("name") === "description") {
                const content = meta.getAttribute("content");
                if (
                  content &&
                  (content.includes(" like") || content.includes(" view"))
                ) {
                  const likeMatch = content.match(/(\d+(?:,\d+)*) like/);
                  const viewMatch = content.match(/(\d+(?:,\d+)*) view/);
                  if (likeMatch) {
                    engagementCount = likeMatch[0];
                    break;
                  } else if (viewMatch) {
                    engagementCount = viewMatch[0];
                    break;
                  }
                }
              }
            }
          }

          // Extract post date if available
          let postDate = null;
          const timeElements = document.querySelectorAll("time");
          if (timeElements.length > 0) {
            const dateAttr = timeElements[0].getAttribute("datetime");
            if (dateAttr) {
              postDate = dateAttr;
            } else {
              postDate = timeElements[0].textContent;
            }
          }

          // Extract caption/description
          let caption = null;
          // Try various selectors that might contain the caption
          const captionSelectors = [
            'div[data-e2e="post-caption"]',
            'div[data-testid="post-caption"]',
            "h1 + div", // Often the caption is in a div after the username (h1)
            "article div > span",
          ];

          for (const selector of captionSelectors) {
            const captionElements = document.querySelectorAll(selector);
            for (const elem of captionElements) {
              const text = elem.textContent;
              if (
                text &&
                text.length > 10 &&
                !text.includes("Log in") &&
                !text.includes("Sign up")
              ) {
                caption = text.trim();
                break;
              }
            }
            if (caption) break;
          }

          // Extract comments - need to click "View all comments" or similar buttons
          const comments: { username: string; text: string }[] = [];

          // Try to expand comments if possible
          const viewAllCommentsButtons = Array.from(
            document.querySelectorAll("button, span, div")
          ).filter(
            (el) =>
              el.textContent &&
              el.textContent.includes("View") &&
              el.textContent.includes("comment")
          );

          if (viewAllCommentsButtons.length > 0) {
            try {
              // Use as HTMLElement to access click() method
              (viewAllCommentsButtons[0] as HTMLElement).click();
              // Give some time for comments to load
              await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (e) {
              // Ignore click errors
            }
          }

          // Try to find comments
          // Instagram has many different layouts, so try multiple selectors
          const possibleCommentContainers = [
            // Modern layout
            "ul > li",
            // Alternative layout
            'div[role="button"] ~ div',
            // Another layout
            'span[id^="comment-"] ~ span',
          ];

          for (const selector of possibleCommentContainers) {
            const commentElements = document.querySelectorAll(selector);
            if (commentElements.length > 0) {
              for (const commentEl of commentElements) {
                // Look for a username pattern (starts with @) or has nested username elements
                const usernameSections = commentEl.querySelectorAll("a");
                let username = "";
                let commentText = "";

                // Try to identify username and comment text
                if (usernameSections.length > 0) {
                  for (const section of usernameSections) {
                    if (
                      section.textContent &&
                      section.textContent.trim() &&
                      !section.textContent.includes("#")
                    ) {
                      username = section.textContent.trim();
                      break;
                    }
                  }

                  if (username) {
                    // Get the full text and remove the username part
                    const textContent = commentEl.textContent || '';
                    commentText = textContent.trim();
                    if (commentText.startsWith(username)) {
                      commentText = commentText
                        .substring(username.length)
                        .trim();
                    }

                    if (commentText && username) {
                      comments.push({
                        username,
                        text: commentText,
                      });

                      if (comments.length >= 20) break; // Limit to top 20 comments
                    }
                  }
                }
              }

              if (comments.length > 0) break; // If we found comments using this selector, stop trying others
            }
          }

          return {
            videoSrc,
            thumbnailSrc,
            engagementCount,
            comments,
            postDate,
            caption,
          };
        });

        if (mediaData.videoSrc) {
          results.push({
            reelUrl: link,
            videoUrl: mediaData.videoSrc,
            thumbnailUrl: mediaData.thumbnailSrc,
            engagementCount: mediaData.engagementCount,
            postDate: mediaData.postDate,
            caption: mediaData.caption,
            comments: mediaData.comments,
          });

          console.log(
            `Extracted from ${link}:\n` +
              `- Video: ${mediaData.videoSrc}\n` +
              `- Thumbnail: ${mediaData.thumbnailSrc || "Not found"}\n` +
              `- Engagement: ${mediaData.engagementCount || "Not found"}\n` +
              `- Post Date: ${mediaData.postDate || "Not found"}\n` +
              `- Caption: ${
                mediaData.caption
                  ? mediaData.caption.substring(0, 50) + "..."
                  : "Not found"
              }\n` +
              `- Comments: ${mediaData.comments.length} found`
          );
        } else {
          console.log(`No video found on page: ${link}`);
        }
      } catch (error) {
        console.error(`Error extracting media from ${link}:`, error);
      }

      // Add a longer delay to avoid rate limiting and to allow comments to load
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // Close browser
    await browser.close();

    return results;
  } catch (error: any) {
    console.error("Error scraping Instagram:", error);
    return [];
  }
}

// Remove the main function and export the GET handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  if (!username) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Username is required' 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }

  try {
    const results = await scrapeInstagramReels(username);
    
    // Create the filename
    const filename = `${username}_instagram_reels.json`;
    
    // Save the results to a JSON file
    fs.writeFileSync(
      `${process.cwd()}/app/api/scrape/${filename}`,
      JSON.stringify(results, null, 2)
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Results saved to ${filename}`,
      filename,
      results
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error scraping Instagram', 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}