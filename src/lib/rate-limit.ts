/**
 * Simple in-memory rate limiter for API routes.
 * For production with multiple instances, consider using Redis (Upstash).
 */

type RateLimitEntry = {
    count: number;
    resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitMap.entries()) {
            if (now > entry.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }, CLEANUP_INTERVAL);
}

type RateLimitConfig = {
    /** Maximum number of requests allowed in the window */
    limit: number;
    /** Time window in seconds */
    windowInSeconds: number;
};

type RateLimitResult = {
    success: boolean;
    remaining: number;
    resetIn: number;
};

/**
 * Check if a request should be rate limited.
 * @param identifier - Unique identifier for the client (e.g., IP address)
 * @param config - Rate limit configuration
 * @returns Object with success status and remaining requests
 */
export const rateLimit = (
    identifier: string,
    config: RateLimitConfig,
): RateLimitResult => {
    const now = Date.now();
    const windowMs = config.windowInSeconds * 1000;
    const key = identifier;

    const entry = rateLimitMap.get(key);

    // No existing entry or window expired
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + windowMs,
        });
        return {
            success: true,
            remaining: config.limit - 1,
            resetIn: config.windowInSeconds,
        };
    }

    // Window still active
    if (entry.count >= config.limit) {
        const resetIn = Math.ceil((entry.resetTime - now) / 1000);
        return {
            success: false,
            remaining: 0,
            resetIn,
        };
    }

    // Increment count
    entry.count++;
    rateLimitMap.set(key, entry);

    return {
        success: true,
        remaining: config.limit - entry.count,
        resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
};

/**
 * Get client IP from request headers.
 * Works with Vercel, Cloudflare, and standard proxies.
 */
export const getClientIp = (request: Request): string => {
    const headers = request.headers;

    // Vercel
    const xForwardedFor = headers.get("x-forwarded-for");
    if (xForwardedFor) {
        return xForwardedFor.split(",")[0].trim();
    }

    // Cloudflare
    const cfConnectingIp = headers.get("cf-connecting-ip");
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Real IP header
    const xRealIp = headers.get("x-real-ip");
    if (xRealIp) {
        return xRealIp;
    }

    // Fallback
    return "unknown";
};
