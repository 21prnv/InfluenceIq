# Image Proxy API

This API endpoint serves as a proxy for Instagram profile images and other social media images that may have cross-origin restrictions.

## Purpose

Instagram and other social media platforms often prevent direct image embedding through CORS restrictions or by requiring authentication. This proxy allows our application to fetch and display these images by:

1. Routing the request through our server
2. Adding appropriate headers to bypass restrictions
3. Handling errors gracefully
4. Implementing rate limiting

## Usage

To use the proxy, import the `getProxiedImageUrl` utility:

```tsx
import { getProxiedImageUrl } from "@/app/utils/imageProxy";
```

Then convert any Instagram URL to a proxied URL:

```tsx
const profilePic = "https://instagram.com/profile-pic.jpg";
const proxiedUrl = getProxiedImageUrl(profilePic);

// With cache busting
const proxiedUrlWithCache = getProxiedImageUrl(profilePic, Date.now().toString());
```

## API Endpoint

The proxy can be accessed directly at:

```
/api/proxy-image?url=ENCODED_URL
```

Where `ENCODED_URL` is the URL-encoded original image URL.

## Security Features

- Domain validation (only allows specific domains)
- Rate limiting (100 requests per minute per IP)
- Request timeout (5 seconds)
- Error handling

## Limitations

- In-memory rate limiting resets on server restart
- For production, consider using Redis or similar for persistent rate limiting
- Only specific domains are allowed (instagram.com, cdninstagram.com, fbcdn.net, fbsbx.com) 