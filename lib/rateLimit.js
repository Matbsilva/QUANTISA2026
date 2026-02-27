/**
 * A simple in-memory rate limiter for Next.js API Routes.
 * Note: If deployed to Serverless/Vercel, memory is per-instance, so it's not a strict global block,
 * but it's more than enough to prevent rapid accidental loops or basic spam from a single user.
 */
const rateLimitStore = new Map();

/**
 * Checks if a specific identifier (e.g., user IP or ID) has exceeded the rate limit.
 * 
 * @param {string} identifier - unique ID (like an IP address or 'admin')
 * @param {number} maxRequests - maximum allowed requests within the window
 * @param {number} windowMs - time window in milliseconds (default 1 minute)
 * @returns {Object} { success, limit, remaining, resetTime }
 */
export function checkRateLimit(identifier = "global", maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const record = rateLimitStore.get(identifier) || { count: 0, resetTime: now + windowMs };

    // Se o tempo da janela já passou, reseta a contagem
    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + windowMs;
    }

    record.count++;
    rateLimitStore.set(identifier, record);

    if (record.count > maxRequests) {
        return {
            success: false,
            limit: maxRequests,
            remaining: 0,
            resetTime: record.resetTime
        };
    }

    return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - record.count,
        resetTime: record.resetTime
    };
}
