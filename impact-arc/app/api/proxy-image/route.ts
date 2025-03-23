import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Simple in-memory rate limiter (note: this will reset on server restart)
// In a production environment, you'd want to use Redis or similar
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function getRateLimitKey(request: NextRequest): string {
  // Use IP or a unique identifier
  return request.ip || 'unknown';
}

function isRateLimited(request: NextRequest): boolean {
  const key = getRateLimitKey(request);
  const now = Date.now();
  
  // Get current rate limit data for this key
  const currentLimit = rateLimitMap.get(key) || { count: 0, timestamp: now };
  
  // Reset count if window has expired
  if (now - currentLimit.timestamp > RATE_LIMIT_WINDOW) {
    currentLimit.count = 1;
    currentLimit.timestamp = now;
  } else {
    currentLimit.count += 1;
  }
  
  // Save updated rate limit data
  rateLimitMap.set(key, currentLimit);
  
  // Check if rate limited
  return currentLimit.count > MAX_REQUESTS_PER_WINDOW;
}

export async function GET(request: NextRequest) {
  // Check rate limit
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    );
  }

  // Validate URL to prevent server-side request forgery
  try {
    const url = new URL(imageUrl);
    const allowedDomains = [
      'instagram.com',
      'cdninstagram.com',
      'fbcdn.net',
      'fbsbx.com'
    ];
    
    if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
      return NextResponse.json(
        { error: 'URL domain not allowed' },
        { status: 403 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid URL' },
      { status: 400 }
    );
  }

  try {
    // Set custom headers for the request to Instagram
    const headers = new Headers();
    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    headers.append('Accept', 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8');
    headers.append('Referer', 'https://www.instagram.com/');

    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Fetch the image from Instagram
    const response = await fetch(imageUrl, {
      headers,
      cache: 'no-store',
      signal: controller.signal,
    });

    // Clear the timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the image data and content type
    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    
    // Handle abort errors separately
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
} 