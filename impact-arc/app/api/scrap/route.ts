// app/api/scrape-instagram/route.ts
import { createClient } from "@/utils/supbase/server";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Initialize Supabase client

// Apply StealthPlugin
puppeteer.use(StealthPlugin());

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Interface for scraped data
interface ReelData {
  url: string;
  thumbnail: string | null;
  videoUrl: string | null;
  caption: string;
  likeCount: string;
  postDate: string;
  comments: { username: string; text: string; likes: string }[];
}

interface UserInfo {
  username: string;
  name: string;
  bioText: string;
  profileImage: string;
  followers?: string;
  following?: string;
  posts?: string;
  links: string[];
}

interface ScrapeResult {
  userInfo: UserInfo;
  reels: ReelData[];
}

// Function to fetch cookies from Supabase (specific row with id = 1)
async function fetchCookiesFromSupabase(): Promise<{
  sessionid: string;
} | null> {
  const supabase = createClient();

  const { data, error } = await (
    await supabase
  )
    .from("cookies")
    .select("cookie")
    .eq("id", 1) // Target row with id = 1
    .single(); // Ensure only one row is returned

  if (error || !data) {
    console.error("Error fetching cookies from Supabase for id=1:", error);
    return null;
  }

  try {
    const cookieData = JSON.parse(data.cookie);
    return cookieData;
  } catch (parseError) {
    console.error("Failed to parse cookie JSON from Supabase:", parseError);
    return null;
  }
}

// Function to save cookies to Supabase (update row with id = 1)
async function saveCookiesToSupabase(cookies: any) {
  const supabase = createClient();

  const { error } = await (
    await supabase
  )
    .from("cookies")
    .update({ cookie: JSON.stringify(cookies) })
    .eq("id", 1); // Update the specific row with id = 1

  if (error) {
    console.error("Error updating cookies in Supabase for id=1:", error);
  } else {
    console.log("Cookies updated in Supabase successfully for id=1.");
  }
}

// Function to perform a fresh login and update cookies
async function performLogin(page: any) {
  console.log("Performing fresh login...");
  await page.goto("https://www.instagram.com/accounts/login/", {
    waitUntil: "networkidle2",
  });
  await page.type(
    'input[name="username"]',
    process.env.INSTAGRAM_USERNAME || "your_username"
  );
  await page.type(
    'input[name="password"]',
    process.env.INSTAGRAM_PASSWORD || "your_password"
  );
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await delay(5000);

  // Extract cookies after login
  const newCookies = await page.cookies();
  const sessionCookie = newCookies.find(
    (cookie: any) => cookie.name === "sessionid"
  );
  if (sessionCookie) {
    const cookieData = { sessionid: sessionCookie.value };
    await saveCookiesToSupabase(cookieData);
  } else {
    console.warn("No sessionid cookie found after login.");
  }

  console.log("Login completed and cookies updated.");
}

// Function to check if the session is valid
async function isSessionValid(page: any): Promise<boolean> {
  await page.goto("https://www.instagram.com/", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  const currentUrl = await page.url();
  if (currentUrl.includes("/accounts/login/")) {
    console.log("Session is invalid, redirected to login page.");
    return false;
  }
  return true;
}

// Main scraping function
async function scrapeInstagramReels(username: string): Promise<ScrapeResult> {
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
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");

    // Fetch cookies from Supabase
    const storedCookies = await fetchCookiesFromSupabase();

    if (storedCookies && storedCookies.sessionid) {
      console.log("Using cookies from Supabase (id=1)...");
      const formattedCookies = [
        {
          name: "sessionid",
          value: storedCookies.sessionid,
          domain: ".instagram.com",
          path: "/",
        },
      ];
      await page.setCookie(...formattedCookies);
      const sessionValid = await isSessionValid(page);
      if (!sessionValid) {
        console.log("Session expired, renewing with fresh login...");
        await performLogin(page);
      }
    } else {
      console.log(
        "No valid cookies in Supabase (id=1), performing fresh login..."
      );
      await performLogin(page);
    }

    console.log(`Navigating to https://www.instagram.com/${username}/`);
    await page.goto(`https://www.instagram.com/${username}/`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    const userInfo: UserInfo = await page.evaluate(() => {
      const bioSelectors = [
        'div[class*="x7a106z"] span',
        'div[class*="x1qjc9v5"] span',
        "header section span",
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
        "header h1",
        "header h2",
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
        "header img",
        'img[alt*="profile"]',
        'img[src*="profile"]',
      ];
      let profileImage = "";
      for (const selector of imageSelectors) {
        const imgElement = document.querySelector(selector);
        if ((imgElement as HTMLImageElement)?.src) {
          profileImage = (imgElement as HTMLImageElement).src;
          break;
        }
      }

      const stats: { [key: string]: string } = {};
      const statsElements = document.querySelectorAll(
        'ul li span[class*="x1q0g3np"], ul li span'
      );
      statsElements.forEach((el: any) => {
        const text = el.textContent.toLowerCase();
        if (text.includes("follower")) stats.followers = text;
        else if (text.includes("following")) stats.following = text;
        else if (text.includes("post")) stats.posts = text;
      });

      const links = Array.from(document.querySelectorAll('a[href^="http"]'))
        .filter((el: any) => !el.href.includes("instagram.com"))
        .map((el: any) => el.href);

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

    await page.goto(`https://www.instagram.com/${username}/reels/`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    await delay(5000);

    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await delay(2000);
    }

    const reelLinks: string[] = await page.evaluate(() => {
      const selectors = [
        'article a[href*="/reel/"]',
        'a[href*="/reel/"]',
        'a[href*="/p/"]',
        'div[role="button"] a[href*="/reel/"]',
        'div.x1qjc9v5 a[href*="/reel/"]',
        "div._aagw a",
      ];

      let links: string[] = [];
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(
            `Found ${elements.length} elements with selector: ${selector}`
          );
          const tempLinks = Array.from(elements)
            .map((link: any) => link.href)
            .filter(
              (href: string) => href.includes("/reel/") || href.includes("/p/")
            );
          links = [...links, ...tempLinks];
        }
      }

      return [...new Set(links)].slice(0, 5);
    });

    console.log(`Found ${reelLinks.length} reels`);

    const reelsData: ReelData[] = [];
    for (const reelUrl of reelLinks) {
      console.log(`Processing reel/post: ${reelUrl}`);
      await page.goto(reelUrl, { waitUntil: "networkidle2", timeout: 30000 });
      await delay(5000);

      const reelData = await page.evaluate(() => {
        let thumbnail: string | null = null;
        let videoUrl: string | null = null;
        const videoElement = document.querySelector("video");
        if (videoElement) {
          videoUrl = (videoElement as HTMLVideoElement).src || null;
          thumbnail = (videoElement as HTMLVideoElement).poster || null;
        }

        if (!thumbnail) {
          const imgElements = document.querySelectorAll("img");
          for (const img of Array.from(imgElements)) {
            if (
              (img as HTMLImageElement).width > 200 &&
              (img as HTMLImageElement).height > 200 &&
              !(img as HTMLImageElement).src.includes("profile")
            ) {
              thumbnail = (img as HTMLImageElement).src;
              break;
            }
          }
        }

        if (!thumbnail) {
          const metaOgImage = document.querySelector(
            'meta[property="og:image"]'
          );
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
          for (const el of Array.from(elements)) {
            const text = el.textContent;
            if (/\d[,\d]*\s*(like|likes)/.test(text!)) {
              likeCount = text!.replace(/(like|likes)/g, "").trim();
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
        let commentsElements: Element[] = [];
        for (const selector of commentSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            commentsElements = Array.from(elements);
            break;
          }
        }

        const comments = commentsElements.slice(0, 10).map((comment) => {
          try {
            const username =
              (comment.querySelector("a") as HTMLElement)?.textContent ||
              "Unknown";
            const textElement =
              comment.querySelector("span:not(:has(a))") ||
              comment.querySelector("div._a9zs");
            const text = textElement
              ? textElement.textContent || "No text"
              : "No text";
            const likes =
              (
                comment.querySelector(
                  'button[type="button"] span'
                ) as HTMLElement
              )?.textContent || "0";
            return { username, text, likes };
          } catch (error) {
            return {
              username: "Error",
              text: "Failed to parse comment",
              likes: "0",
            };
          }
        });

        let postDate = "";
        const timeElements = document.querySelectorAll("time");
        if (timeElements.length > 0) {
          postDate =
            (timeElements[0] as HTMLElement).getAttribute("datetime") ||
            timeElements[0].textContent ||
            "";
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
        ...reelData,
      });
    }

    const fullData: ScrapeResult = { userInfo, reels: reelsData };
    console.log(`Scraping completed for ${username}`);
    return fullData;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error;
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
}

// API Route Handler
export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const result = await scrapeInstagramReels(username);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to scrape Instagram reels" },
      { status: 500 }
    );
  }
}
