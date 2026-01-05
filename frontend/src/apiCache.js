/**
 * API Caching and Request Deduplication Utility
 * Provides caching for API responses and prevents duplicate concurrent requests
 */

class APICache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  /**
   * Generate cache key from URL and options
   */
  generateKey(url, options = {}) {
    const key = `${options.method || 'GET'}:${url}`;
    if (options.body) {
      key += `:${JSON.stringify(options.body)}`;
    }
    return key;
  }

  /**
   * Check if response is cached and not expired
   */
  get(url, options = {}, maxAge = 300000) { // 5 minutes default
    const key = this.generateKey(url, options);
    const cached = this.cache.get(key);

    if (cached && (Date.now() - cached.timestamp) < maxAge) {
      return cached.data;
    }

    // Remove expired cache entry
    if (cached) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * Cache response data
   */
  set(url, options = {}, data) {
    const key = this.generateKey(url, options);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Limit cache size to prevent memory leaks
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Clear cache for specific URL or all cache
   */
  clear(url = null, options = {}) {
    if (url) {
      const key = this.generateKey(url, options);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Handle concurrent requests with deduplication
   */
  async dedupedFetch(url, options = {}) {
    const key = this.generateKey(url, options);

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create the fetch promise
    const fetchPromise = this.fetchWithCache(url, options);

    // Store the promise to prevent duplicate requests
    this.pendingRequests.set(key, fetchPromise);

    try {
      const result = await fetchPromise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Fetch with caching and retry logic
   */
  async fetchWithCache(url, options = {}, cacheOptions = {}) {
    const { useCache = true, maxAge = 300000, retries = 3, retryDelay = 1000 } = cacheOptions;
    const method = options.method || 'GET';

    // Only cache GET requests
    if (useCache && method === 'GET') {
      const cached = this.get(url, options, maxAge);
      if (cached) {
        return cached;
      }
    }

    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          // For server errors (5xx), retry
          if (response.status >= 500 && attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
            continue;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful GET responses
        if (useCache && method === 'GET') {
          this.set(url, options, data);
        }

        return data;
      } catch (error) {
        lastError = error;

        // Don't retry for client errors (4xx) or if it's the last attempt
        if (error.message.includes('HTTP 4') || attempt === retries) {
          break;
        }

        // Wait before retrying
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        }
      }
    }

    // Don't cache errors
    throw lastError;
  }
}

// Global cache instance
const apiCache = new APICache();

/**
 * Cached fetch function with deduplication
 */
export const cachedFetch = (url, options = {}, cacheOptions = {}) => {
  return apiCache.dedupedFetch(url, options, cacheOptions);
};

/**
 * Clear cache for specific URL or all
 */
export const clearCache = (url = null, options = {}) => {
  apiCache.clear(url, options);
};

/**
 * React hook for cached API calls
 */
export const useCachedAPI = () => {
  return {
    cachedFetch,
    clearCache,
  };
};

export default apiCache;