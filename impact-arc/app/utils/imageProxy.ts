/**
 * Converts an Instagram profile picture URL to a proxied URL through our API
 * @param originalUrl The original Instagram profile picture URL
 * @param cacheKey Optional cache key to append for cache busting
 * @returns The proxied URL
 */
export function getProxiedImageUrl(originalUrl: string, cacheKey?: string): string {
  if (!originalUrl) return '';
  
  // Check if the URL is from Instagram
  const isInstagramUrl = 
    originalUrl.includes('instagram.com') || 
    originalUrl.includes('cdninstagram.com') ||
    originalUrl.includes('fbcdn.net');
    
  // If it's not an Instagram URL, return it as is
  if (!isInstagramUrl) return originalUrl;
  
  // Create the proxied URL
  const encodedUrl = encodeURIComponent(originalUrl);
  let proxyUrl = `/api/proxy-image?url=${encodedUrl}`;
  
  // Add cache key if provided
  if (cacheKey) {
    proxyUrl += `&_cache=${cacheKey}`;
  }
  
  return proxyUrl;
} 