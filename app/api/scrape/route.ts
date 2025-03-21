import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Main scraping function
async function scrapeInstagramReels(username: string, useBackup = false) {
  try {
    // Launch browser with different options based on whether it's a backup attempt
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        ...(useBackup ? ["--disable-features=IsolateOrigins,site-per-process"] : [])
      ],
    });

    const page = await browser.newPage();

    // Different user agent for backup attempts
    const userAgent = useBackup 
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1"
      : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    
    await page.setUserAgent(userAgent);

    // Set extra headers for backup attempts
    if (useBackup) {
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      });
    }

    // Different URL for backup (mobile version tends to be more reliable)
    const url = useBackup 
      ? `https://www.instagram.com/${username}/reels/?__a=1&__d=dis` 
      : `https://www.instagram.com/${username}/reels/`;
    
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: useBackup ? 60000 : 30000, // Longer timeout for backup
    });

    // Different selector waiting strategy for backup
    if (useBackup) {
      await Promise.race([
        page.waitForSelector("article", { timeout: 30000 }),
        page.waitForSelector("body", { timeout: 30000 })
      ]).catch(() => {
        console.log("Using fallback selector approach for backup method");
      });
    } else {
      await page.waitForSelector("article", { timeout: 30000 }).catch(() => {
        console.log("Could not find 'article' element, continuing anyway");
      });
    }

    // Function to scroll and collect reel links with backup approach
    const reelLinks = await page.evaluate(async (isBackup) => {
      const links = new Set();

      // Scroll function with different parameters for backup
      const autoScroll = async () => {
        return new Promise<void>((resolve) => {
          let lastHeight = 0;
          let newHeight = 0;
          let scrollAttempts = 0;
          const maxScrollAttempts = isBackup ? 40 : 30; // More attempts for backup
          const scrollDelay = isBackup ? 1500 : 1000; // Slower scrolling for backup

          const scrollInterval = setInterval(() => {
            window.scrollBy(0, isBackup ? 500 : 1000); // Smaller scrolls for backup
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
          }, scrollDelay);
        });
      };

      await autoScroll();

      // Different selector strategies for finding reel links
      if (isBackup) {
        // Try multiple selector approaches for backup
        const selectors = [
          'a[href*="/reel/"]',
          'a[href*="/p/"]', // Some reels might be shown as posts
          'div[role="button"] a', // Alternative structure
          'article a' // Even more generic
        ];
        
        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            const href = element.getAttribute("href");
            if (href && (href.includes("/reel/") || href.includes("/p/"))) {
              links.add(`https://www.instagram.com${href}`);
            }
          });
          
          if (links.size > 0) break; // Stop if we found links
        }
      } else {
        // Original approach
        const reelElements = document.querySelectorAll('a[href*="/reel/"]');
        reelElements.forEach((element) => {
          const href = element.getAttribute("href");
          if (href && href.includes("/reel/")) {
            links.add(`https://www.instagram.com${href}`);
          }
        });
      }

      return Array.from(links);
    }, useBackup);

    console.log(`Found ${reelLinks.length} reel links using ${useBackup ? "backup" : "primary"} method`);

    // If no links found and not already using backup, close browser and return empty array
    if (reelLinks.length === 0 && !useBackup) {
      await browser.close();
      console.log("No reels found with primary method. Switching to backup method...");
      return [];
    }

    // Extract video URLs with different approach for backup
    const results = [];
    for (const link of reelLinks.slice(0, useBackup ? 0 : 5)) { // Process fewer reels at once
      try {
        // Navigate to the reel page with different settings for backup
        await page.goto(link, { 
          waitUntil: useBackup ? "domcontentloaded" : "networkidle2", 
          timeout: useBackup ? 45000 : 30000 
        });

        // Different waiting strategy for backup
        if (useBackup) {
          await Promise.race([
            page.waitForSelector("video", { timeout: 15000 }),
            page.waitForSelector("img", { timeout: 15000 })
          ]).catch(() => {
            console.log(`No video or image element found on page: ${link}`);
          });
        } else {
          await page.waitForSelector("video", { timeout: 10000 }).catch(() => {
            console.log(`No video element found on page: ${link}`);
          });
        }

        // Different extraction strategies
        const mediaData = await page.evaluate(async (isBackup) => {
          // Common function to extract text that matches a pattern
          const findTextWithPattern = (pattern) => {
            const elements = document.querySelectorAll("*");
            for (const el of elements) {
              if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                const text = el.textContent.trim();
                if (pattern.test(text)) {
                  return text;
                }
              }
            }
            return null;
          };
          
          // Backup video extraction tries more approaches
          let videoSrc = null;
          if (isBackup) {
            // Try multiple ways to get video source
            const videoEl = document.querySelector("video");
            if (videoEl && videoEl.src) {
              videoSrc = videoEl.src;
            } else {
              // Try source tags
              const sourceEl = document.querySelector("source");
              if (sourceEl && sourceEl.src) {
                videoSrc = sourceEl.src;
              } else {
                // Try video elements with srcset
                const videoElements = document.querySelectorAll("video");
                for (const video of videoElements) {
                  if (video.srcset) {
                    const srcset = video.srcset.split(",").pop().trim().split(" ")[0];
                    if (srcset) {
                      videoSrc = srcset;
                      break;
                    }
                  }
                }
              }
            }
          } else {
            // Original approach
            const videoElement = document.querySelector("video");
            videoSrc = videoElement ? videoElement.src : null;
          }

          // More aggressive thumbnail extraction for backup
          let thumbnailSrc = null;
          if (isBackup) {
            // Try multiple approaches to find thumbnail
            const selectors = [
              "video[poster]", // Video poster
              'meta[property="og:image"]', // Open Graph image
              'meta[name="twitter:image"]', // Twitter image
              'link[rel="image_src"]', // Link rel image
              'img[sizes]', // Large images with sizes attribute
            ];
            
            for (const selector of selectors) {
              const el = document.querySelector(selector);
              if (el) {
                if (selector === "video[poster]") {
                  thumbnailSrc = el.poster;
                } else if (selector.startsWith('meta')) {
                  thumbnailSrc = el.getAttribute("content");
                } else if (selector === 'link[rel="image_src"]') {
                  thumbnailSrc = el.getAttribute("href");
                } else if (selector === 'img[sizes]') {
                  thumbnailSrc = el.src;
                }
                
                if (thumbnailSrc) break;
              }
            }
            
            // If still no thumbnail, try to get any large image
            if (!thumbnailSrc) {
              const imgElements = document.querySelectorAll("img");
              for (const img of imgElements) {
                if (img.naturalWidth > 150 && img.naturalHeight > 150) {
                  thumbnailSrc = img.src;
                  break;
                }
              }
            }
          } else {
            // Original approach
            const videoElement = document.querySelector("video");
            thumbnailSrc = videoElement ? videoElement.poster : null;

            if (!thumbnailSrc) {
              const imgElements = document.querySelectorAll("img");
              for (const img of imgElements) {
                if (
                  img.width > 200 &&
                  img.height > 200 &&
                  !img.src.includes("profile")
                ) {
                  thumbnailSrc = img.src;
                  break;
                }
              }

              if (!thumbnailSrc) {
                const metaOgImage = document.querySelector(
                  'meta[property="og:image"]'
                );
                if (metaOgImage) {
                  thumbnailSrc = metaOgImage.getAttribute("content");
                }
              }
            }
          }

          // Different approaches to extracting engagement metrics
          let engagementCount = null;
          if (isBackup) {
            // Try text pattern matching for likes/views
            engagementCount = findTextWithPattern(/(\d+(?:,\d+)*)\s+(like|view)/i);
            
            // If not found, look in meta tags with more patterns
            if (!engagementCount) {
              const metaTags = document.querySelectorAll('meta');
              for (const meta of metaTags) {
                const content = meta.getAttribute('content');
                if (content && /\d+\s+(like|view)/i.test(content)) {
                  engagementCount = content.match(/(\d+(?:,\d+)*)\s+(like|view)/i)[0];
                  break;
                }
              }
            }
          } else {
            // Original approach
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
          }

          // Different post date extraction approaches
          let postDate = null;
          if (isBackup) {
            const timeEl = document.querySelector('time');
            if (timeEl) {
              postDate = timeEl.getAttribute('datetime') || timeEl.textContent;
            } else {
              // Try to find date in metadata
              const metaTime = document.querySelector('meta[property="article:published_time"]');
              if (metaTime) {
                postDate = metaTime.getAttribute('content');
              }
            }
          } else {
            // Original approach
            const timeElements = document.querySelectorAll("time");
            if (timeElements.length > 0) {
              const dateAttr = timeElements[0].getAttribute("datetime");
              if (dateAttr) {
                postDate = dateAttr;
              } else {
                postDate = timeElements[0].textContent;
              }
            }
          }

          // Different caption extraction approaches
          let caption = null;
          if (isBackup) {
            // Try to find captions in various places
            const captionCandidates = [];
            
            // Try meta description first
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              captionCandidates.push(metaDesc.getAttribute('content'));
            }
            
            // Try looking for elements with substantial text content
            const textElements = document.querySelectorAll('p, span, div');
            for (const el of textElements) {
              if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                const text = el.textContent.trim();
                if (text.length > 20 && !/^[\d.]+\s*(like|view|comment)/i.test(text)) {
                  captionCandidates.push(text);
                }
              }
            }
            
            // Sort by length and pick the longest one that's not too long
            captionCandidates.sort((a, b) => b.length - a.length);
            for (const candidate of captionCandidates) {
              if (candidate.length > 20 && candidate.length < 1000) {
                caption = candidate;
                break;
              }
            }
          } else {
            // Original approach
            const captionSelectors = [
              'div[data-e2e="post-caption"]',
              'div[data-testid="post-caption"]',
              "h1 + div", 
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
          }

          // Different comment extraction approaches
          const comments = [];
          if (isBackup) {
            // Simplified comment extraction for backup (less likely to fail)
            const commentElements = document.querySelectorAll('ul li, div > div > div');
            
            for (const el of commentElements) {
              const text = el.textContent.trim();
              
              // Simple heuristic: comments often contain ":" separating username and text
              if (text.includes(':') && text.length > 5 && text.length < 300) {
                const [username, ...commentParts] = text.split(':');
                const commentText = commentParts.join(':').trim();
                
                if (username && commentText && username.length < 30) {
                  comments.push({
                    username: username.trim(),
                    text: commentText
                  });
                  
                  if (comments.length >= 10) break; // Limit to 10 comments for backup
                }
              }
            }
          } else {
            // Original approach
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
                viewAllCommentsButtons[0].click();
                await new Promise((resolve) => setTimeout(resolve, 2000));
              } catch (e) {
                // Ignore click errors
              }
            }

            const possibleCommentContainers = [
              "ul > li",
              'div[role="button"] ~ div',
              'span[id^="comment-"] ~ span',
            ];

            for (const selector of possibleCommentContainers) {
              const commentElements = document.querySelectorAll(selector);
              if (commentElements.length > 0) {
                for (const commentEl of commentElements) {
                  const usernameSections = commentEl.querySelectorAll("a");
                  let username = "";
                  let commentText = "";

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
                      commentText = commentEl.textContent.trim();
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

                        if (comments.length >= 20) break;
                      }
                    }
                  }
                }

                if (comments.length > 0) break;
              }
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
        }, useBackup);

        if (mediaData.videoSrc) {
          results.push({
            reelUrl: link,
            videoUrl: mediaData.videoSrc,
            thumbnailUrl: mediaData.thumbnailSrc,
            engagementCount: mediaData.engagementCount,
            postDate: mediaData.postDate,
            caption: mediaData.caption,
            comments: mediaData.comments,
            scrapedWith: useBackup ? "backup" : "primary"
          });

          console.log(
            `Extracted from ${link} using ${useBackup ? "backup" : "primary"} method:\n` +
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

      // Longer delay for backup method to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, useBackup ? 5000 : 3000));
    }

    // Close browser
    await browser.close();

    return results;
  } catch (error) {
    console.error(`Error scraping Instagram with ${useBackup ? "backup" : "primary"} method:`, error);
    
    // If this was the primary method failing, close resources and return empty
    // The main function will try the backup method
    if (!useBackup) {
      return [];
    }
    
    // If backup method is also failing, return empty array
    return [];
  }
}

// Main function that coordinates primary and backup methods
async function fetchInstagramReels(username: string, maxRetries = 3) {
  console.log(`Starting to scrape Instagram reels for user: ${username}`);
  
  // Try primary method first
  console.log("Attempting to scrape using primary method...");
  let results = await scrapeInstagramReels(username, false);
  
  // If primary method returns empty or very few results, try backup method
  if (results.length < 3) {
    console.log("Primary method failed or returned too few results. Trying backup method...");
    const backupResults = await scrapeInstagramReels(username, true);
    
    // If backup found results, use those
    if (backupResults.length > 0) {
      console.log(`Backup method found ${backupResults.length} reels.`);
      results = backupResults;
    } else {
      console.log("Backup method also failed.");
    }
  }

  // Save results in temporary file (for API response)
  const tempDir = path.join(process.cwd(), 'public', 'temp');
  
  try {
    // Ensure temp directory exists
    await fsPromises.mkdir(tempDir, { recursive: true });
    
    // Write results to file
    const filename = `${username}_instagram_reels.json`;
    const filePath = path.join(tempDir, filename);
    await fsPromises.writeFile(filePath, JSON.stringify(results, null, 2));
    
    console.log(`Results saved to ${filePath}`);
    return { results, filename };
  } catch (err) {
    console.error("Error saving results:", err);
    return { results, filename: null };
  }
}

// API Route handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;
    
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }
    
    console.log(`Received request to scrape reels for: ${username}`);
    
    // Call the scraping function
    const { results, filename } = await fetchInstagramReels(username);
    
    // Return the results
    return NextResponse.json({ 
      success: true, 
      message: `Successfully scraped ${results.length} reels for ${username}`,
      filename,
      results
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to scrape Instagram reels",
      message: error.message
    }, { status: 500 });
  }
}

// API route to get results
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }
    
    const filePath = path.join(process.cwd(), 'public', 'temp', filename);
    
    try {
      const fileContent = await fsPromises.readFile(filePath, 'utf8');
      return NextResponse.json(JSON.parse(fileContent));
    } catch (err) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 