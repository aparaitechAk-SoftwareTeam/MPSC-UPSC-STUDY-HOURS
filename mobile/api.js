import { Platform, NativeModules } from 'react-native';

/**
 * Returns candidate API endpoints based on the active runtime environment.
 * Evaluates dynamically on call so network or host changes are immediately reflected.
 * Prioritizes 127.0.0.1 on Web/Desktop to bypass corporate DNS / proxy interference.
 */
export const getCandidateApiUrls = () => {
  const candidates = [];

  // 1. Web browser:
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    // 127.0.0.1 avoids DNS lookup completely and connects instantly on any Wi-Fi
    candidates.push('http://127.0.0.1:4000/api');
    candidates.push('http://localhost:4000/api');

    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      candidates.push(`http://${host}:4000/api`);
    }
  }

  // 2. Metro Bundler dynamic host (Expo Go on physical mobile devices / emulators)
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const metroHost = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0];
    if (metroHost && metroHost !== 'localhost' && metroHost !== '127.0.0.1') {
      candidates.push(`http://${metroHost}:4000/api`);
    }
  }

  // 3. Android emulator loopback alias
  if (Platform.OS === 'android') {
    candidates.push('http://10.0.2.2:4000/api');
  }

  // 4. Standard local loopback endpoints
  candidates.push('http://127.0.0.1:4000/api');
  candidates.push('http://localhost:4000/api');

  // De-duplicate while preserving candidate priority
  return Array.from(new Set(candidates.filter(Boolean)));
};

let cachedApiBase = getCandidateApiUrls()[0] || 'http://127.0.0.1:4000/api';

/**
 * Returns the currently active working API base URL.
 */
export const getApiBase = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return cachedApiBase || 'http://127.0.0.1:4000/api';
    }
  }
  return cachedApiBase;
};

export const setApiBase = (url) => {
  if (url) cachedApiBase = url;
};

/**
 * Smart, resilient API fetch that automatically fails over between candidates.
 * Uses adaptive timeout: 1.5s for loopback/localhost and 3.5s for external hosts.
 * Prevents requests from hanging on dead or stale Wi-Fi IP addresses.
 */
export async function smartApiFetch(route, options = {}) {
  const path = route.startsWith('/') ? route : '/' + route;
  const initialBase = getApiBase();
  const candidates = [
    initialBase,
    ...getCandidateApiUrls().filter(u => u !== initialBase)
  ];

  let lastError = null;

  for (let i = 0; i < candidates.length; i++) {
    const base = candidates[i];
    const fullUrl = base + path;

    // 12s timeout for local loopback, 15s for LAN/remote (allows SMTP email dispatch)
    const isLocal = base.includes('127.0.0.1') || base.includes('localhost');
    const defaultTimeout = isLocal ? 12000 : 15000;
    const timeoutMs = options.timeout || defaultTimeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const mergedOptions = {
        ...options,
        signal: options.signal || controller.signal
      };

      const res = await fetch(fullUrl, mergedOptions);
      clearTimeout(timeoutId);

      // Successfully contacted server! Lock onto this working base URL
      cachedApiBase = base;
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      // Network error or timeout: seamlessly attempt the next candidate host
      continue;
    }
  }

  throw lastError || new Error(`Cannot connect to server. Tried: ${candidates.join(', ')}`);
}

export default {
  getCandidateApiUrls,
  getApiBase,
  setApiBase,
  smartApiFetch
};
