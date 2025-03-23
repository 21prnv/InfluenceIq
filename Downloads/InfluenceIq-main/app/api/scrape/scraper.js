const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const path = require("path");

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to perform a fresh login and save cookies
async function performLogin(page) {
  console.log("Performing fresh login...");
  await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "networkidle2" });
  await page.type('input[name="username"]', "your_username"); // Replace with your username
  await page.type('input[name="password"]', "your_password"); // Replace with your password
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await delay(5000);

  // Save new cookies
  const cookies = await page.cookies();
  const cookiesPath = path.join(process.cwd(), "app/api/scrape/cookies.json");
  fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
  console.log("New cookies saved.");
}

// Function to check if the session is valid
async function isSessionValid(page) {
  await page.goto("https://www.instagram.com/", { waitUntil: "networkidle2", timeout: 60000 });
  const currentUrl = await page.url();
  if (currentUrl.includes("/accounts/login/")) {
    console.log("Session is invalid, redirected to login page.");
    return false;
  }
  return true;
}

async function checkLoginWall(page) {
  const currentUrl = await page.url();
  if (currentUrl.includes("/accounts/login/")) {
    console.log("Redirected to login page detected!");
    return true;
  }

  const loginIndicators = [
    'button',
    'input[name="username"]',
    'div',
  ];

  for (const selector of loginIndicators) {
    const isPresent = await page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      for (const el of elements) {
        const text = el.textContent?.toLowerCase() || "";
        if (
          text.includes("log in") ||
          text.includes("login") ||
          text.includes("sign in") ||
          text.includes("log in to see") ||
          text.includes("sign up")
        ) {
          return true;
        }
      }
      return false;
    }, selector);

    if (isPresent) {
      console.log(`Login wall detected with selector: ${selector}`);
      return true;
    }
  }

  const hasUsernameInput = await page.evaluate(() => {
    return !!document.querySelector('input[name="username"]');
  });

  if (hasUsernameInput) {
    console.log("Login wall detected: username input found");
    return true;
  }

  return false;
}

async function waitForProfileLoad(page) {
  const profileSelectors = [
    'header',
    'div[class*="x1qjc9v5"]',
    'section[class*="x1a2a7pz"]',
    'h1[class*="x1lliihq"]',
  ];
  for (const selector of profileSelectors) {
    try {
      await page.waitForSelector(selector, { timeout: 30000 });
      console.log(`Found profile element with selector: ${selector}`);
      return true;
    } catch (e) {
      console.log(`Selector ${selector} not found`);
    }
  }
  throw new Error("No profile elements found");
}

async function scrapeInstagramReels(username, outputFile) {
  if (!outputFile) {
    outputFile = path.join(process.cwd(), `app/api/scrape/${username}_data.json`);
  }
  
  console.log(`Starting to scrape reels for user: ${username}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--window-size=1920,1080",
      "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-site-isolation-trials",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Clear browser cache
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');

    // Load cookies or perform login
    const cookiesPath = path.join(process.cwd(), "app/api/scrape/cookies.json");
    if (fs.existsSync(cookiesPath)) {
      console.log("Loading saved cookies...");
      const cookies = JSON.parse(fs.readFileSync(cookiesPath));
      await page.setCookie(...cookies);

      // Check if the session is still valid
      const sessionValid = await isSessionValid(page);
      if (!sessionValid) {
        console.log("Session expired, renewing with fresh login...");
        fs.unlinkSync(cookiesPath); // Delete old cookies
        await performLogin(page);
      }
    } else {
      await performLogin(page);
    }

    console.log(`Navigating to https://www.instagram.com/${username}/`);
    await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: "networkidle2", timeout: 60000 });

    const errorPageCheck = await page.evaluate(() => {
      return document.querySelector('body')?.textContent?.includes("Something went wrong") || false;
    });

    if (errorPageCheck) {
      console.log("Error page detected, waiting for potential redirect to login page...");
      await delay(10000);
    }

    let currentUrl = await page.url();
    if (currentUrl.includes("/accounts/login/")) {
      console.log("Redirected to login page after error page!");
      console.log("Session may have expired, renewing with fresh login...");
      if (fs.existsSync(cookiesPath)) {
        fs.unlinkSync(cookiesPath); // Delete old cookies
      }
      await performLogin(page);
      // Retry navigating to the profile
      await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: "networkidle2", timeout: 60000 });
      currentUrl = await page.url();
    }

    if (!currentUrl.includes(`/${username}/`)) {
      console.log(`Unexpected redirect to: ${currentUrl}`);
      throw new Error("Failed to load profile page, possible login wall or block");
    }

    const isLoginWall = await checkLoginWall(page);
    if (isLoginWall) {
      throw new Error("Login required to access this profile");
    }

    await waitForProfileLoad(page);

    const userInfo = await page.evaluate(() => {
      const bioSelectors = [
        'div[class*="x7a106z"] span',
        'div[class*="x1qjc9v5"] span',
        'header section span',
        'span[class*="x1lliihq"]',
      ];
      let bioText = "";
      for (const selector of bioSelectors) {
        const bioElement = document.querySelector(selector);
        if (bioElement?.textContent?.trim()) {
          bioText = bioElement.textContent.trim();
          break;
        }
      }

      const nameSelectors = [
        'h1[class*="x1lliihq"]',
        'h2[class*="x1lliihq"]',
        'header h1',
        'header h2',
      ];
      let name = "";
      let username = window.location.pathname.replace(/\//g, "") || "";
      for (const selector of nameSelectors) {
        const nameElement = document.querySelector(selector);
        if (nameElement?.textContent?.trim()) {
          name = nameElement.textContent.trim();
          if (!username || username === name) username = name;
          break;
        }
      }

      const imageSelectors = [
        'img[class*="xpdipgo"]',
        'header img',
        'img[alt*="profile"]',
        'img[src*="profile"]',
      ];
      let profileImage = "";
      for (const selector of imageSelectors) {
        const imgElement = document.querySelector(selector);
        if (imgElement?.src) {
          profileImage = imgElement.src;
          break;
        }
      }

      const stats = {};
      const statsElements = document.querySelectorAll('ul li span[class*="x1q0g3np"], ul li span');
      statsElements.forEach(el => {
        const text = el.textContent?.toLowerCase() || "";
        if (text.includes("follower")) stats.followers = text;
        else if (text.includes("following")) stats.following = text;
        else if (text.includes("post")) stats.posts = text;
      });

      const links = Array.from(document.querySelectorAll('a[href^="http"]'))
        .filter(el => !el.href.includes("instagram.com"))
        .map(el => el.href);

      return {
        username,
        name,
        bioText,
        profileImage,
        ...stats,
        links: [...new Set(links)],
      };
    });

    console.log("Extracted user info:", userInfo);

    console.log(`Navigating to https://www.instagram.com/${username}/reels/`);
    await page.goto(`https://www.instagram.com/${username}/reels/`, { waitUntil: "networkidle2", timeout: 60000 });
    console.log("Loaded reels page");
    await delay(5000);

    console.log("Scrolling to load more content...");
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await delay(2000);
    }

    const reelLinks = await page.evaluate(() => {
      const selectors = [
        'article a[href*="/reel/"]',
        'a[href*="/reel/"]',
        'a[href*="/p/"]',
        'div[role="button"] a[href*="/reel/"]',
        'div.x1qjc9v5 a[href*="/reel/"]',
        "div._aagw a",
      ];

      let links = [];
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          const tempLinks = Array.from(elements)
            .map((link) => link.href)
            .filter((href) => href.includes("/reel/") || href.includes("/p/"));
          links = [...links, ...tempLinks];
        }
      }

      return [...new Set(links)].slice(0, 5);
    });

    console.log(`Found ${reelLinks.length} reels`);

    if (reelLinks.length === 0) {
      console.log("No reels found, trying to get regular posts instead...");
      const postLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/p/"]'))
          .map((link) => link.href);
        return [...new Set(links)].slice(0, 5);
      });
      reelLinks.push(...postLinks);
      console.log(`Found ${postLinks.length} posts as fallback`);
    }

    const reelsData = [];
    for (const reelUrl of reelLinks) {
      console.log(`Processing reel/post: ${reelUrl}`);
      await page.goto(reelUrl, { waitUntil: "networkidle2", timeout: 30000 });
      await delay(5000);

      const reelData = await page.evaluate(() => {
        let thumbnail = null;
        let videoUrl = null;
        const videoElement = document.querySelector("video");
        if (videoElement) {
          videoUrl = videoElement.src || null;
          thumbnail = videoElement.poster || null;
        }

        if (!thumbnail) {
          const imgElements = document.querySelectorAll("img");
          for (const img of imgElements) {
            if (img.width > 200 && img.height > 200 && !img.src.includes("profile")) {
              thumbnail = img.src;
              break;
            }
          }
        }

        if (!thumbnail) {
          const metaOgImage = document.querySelector('meta[property="og:image"]');
          if (metaOgImage) thumbnail = metaOgImage.getAttribute("content");
        }

        let captionText = "";
        const captionSelectors = [
          "div._a9zs",
          'div[class*="x193iq5w"] span',
          "h1 + div span",
          "article div > span",
        ];
        for (const selector of captionSelectors) {
          const captionElement = document.querySelector(selector);
          if (captionElement && captionElement.textContent?.trim()) {
            captionText = captionElement.textContent.trim();
            break;
          }
        }

        let likeCount = "0";
        const likeSelectors = [
          'section span[role="button"]',
          "section div > span",
          "section div._aacl._aaco._aacw",
          'section div[role="button"] span',
        ];
        for (const selector of likeSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const text = el.textContent;
            if (text && /\d[,\d]*\s*(like|likes)/.test(text)) {
              likeCount = text.replace(/(like|likes)/g, "").trim();
              break;
            }
          }
          if (likeCount !== "0") break;
        }

        const commentSelectors = [
          "ul > div > li",
          'ul div[role="button"]',
          "div._a9zr",
          "div._a9zs",
        ];
        let commentsElements = [];
        for (const selector of commentSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            commentsElements = Array.from(elements);
            break;
          }
        }

        const comments = commentsElements.slice(0, 10).map((comment) => {
          try {
            const username = comment.querySelector("a")?.textContent || "Unknown";
            const textElement = comment.querySelector("span:not(:has(a))") || comment.querySelector("div._a9zs");
            const text = textElement ? textElement.textContent : "No text";
            const likes = comment.querySelector('button[type="button"] span')?.textContent || "0";
            return { username, text, likes };
          } catch (error) {
            return { username: "Error", text: "Failed to parse comment", likes: "0" };
          }
        });

        let postDate = "";
        const timeElements = document.querySelectorAll("time");
        if (timeElements.length > 0) {
          postDate = timeElements[0].getAttribute("datetime") || timeElements[0].textContent || "";
        }

        return {
          thumbnail,
          videoUrl,
          caption: captionText,
          likeCount,
          postDate,
          comments,
        };
      });

      reelsData.push({
        url: reelUrl,
        thumbnail: reelData.thumbnail,
        videoUrl: reelData.videoUrl,
        caption: reelData.caption,
        likeCount: reelData.likeCount,
        postDate: reelData.postDate,
        comments: reelData.comments,
      });

      await delay(5000);
    }

    const fullData = { userInfo, reels: reelsData };
    fs.writeFileSync(outputFile, JSON.stringify(fullData, null, 2));
    console.log(`Data saved to ${outputFile}`);
    return fullData;

  } catch (error) {
    console.error("Error during scraping:", error);
    try {
      const html = await page.content();
      const debugPath = path.join(process.cwd(), "app/api/scrape/debug.html");
      fs.writeFileSync(debugPath, html);
      console.log("Page HTML saved to debug.html for inspection");
      
      const screenshotPath = path.join(process.cwd(), "app/api/scrape/debug_screenshot.png");
      await page.screenshot({ path: screenshotPath });
      console.log("Screenshot saved to debug_screenshot.png");
    } catch (debugError) {
      console.error("Error saving debug info:", debugError);
    }
    throw error;
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
}

module.exports = { scrapeInstagramReels }; 