import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let customApiBase = null;
let cachedApiBase = null;

// Initialize custom and cached API bases from persistent storage
AsyncStorage.getItem('abhyas_custom_api_base').then(val => {
  if (val && typeof val === 'string' && val.trim()) {
    customApiBase = val.trim().replace(/\/+$/, '');
    cachedApiBase = customApiBase;
  }
}).catch(() => {});

AsyncStorage.getItem('abhyas_last_working_api').then(val => {
  if (!cachedApiBase && val && typeof val === 'string' && val.trim()) {
    cachedApiBase = val.trim().replace(/\/+$/, '');
  }
}).catch(() => {});

export const setCustomApiBase = (url) => {
  if (url && typeof url === 'string' && url.trim()) {
    customApiBase = url.trim().replace(/\/+$/, '');
    cachedApiBase = customApiBase;
    try {
      AsyncStorage.setItem('abhyas_custom_api_base', customApiBase).catch(() => {});
    } catch {}
  } else {
    customApiBase = null;
    try {
      AsyncStorage.removeItem('abhyas_custom_api_base').catch(() => {});
    } catch {}
  }
};

export const getCustomApiBase = () => customApiBase;

if (Platform.OS === 'web' && typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('online', () => {
    cachedApiBase = customApiBase || null;
  });
  window.addEventListener('offline', () => {
    cachedApiBase = null;
  });
}

/**
 * Returns candidate API endpoints based on the active runtime environment.
 * Evaluates dynamically on call so network or host changes are immediately reflected.
 * Includes local dev LAN IPs, emulator aliases, and deployed URLs.
 */
export const getCandidateApiUrls = () => {
  const candidates = [];

  // 1. User-configured custom API server takes highest precedence
  if (customApiBase) {
    candidates.push(customApiBase);
  }

  // 2. Previously verified working API server
  if (cachedApiBase && cachedApiBase !== customApiBase) {
    candidates.push(cachedApiBase);
  }

  // 3. Environment-configured API URL (via EXPO_PUBLIC_API_URL)
  if (process.env.EXPO_PUBLIC_API_URL && typeof process.env.EXPO_PUBLIC_API_URL === 'string' && process.env.EXPO_PUBLIC_API_URL.trim()) {
    candidates.push(process.env.EXPO_PUBLIC_API_URL.trim().replace(/\/+$/, ''));
  }

  // 4. Android emulator host loopback alias (10.0.2.2 points to host PC in Android emulator)
  if (Platform.OS === 'android') {
    candidates.push('http://10.0.2.2:4000/api');
    candidates.push('http://127.0.0.1:4000/api');
    candidates.push('http://localhost:4000/api');
  }

  // 5. Web browser: prioritize current origin host and local loopbacks
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    candidates.push(`http://${host}:4000/api`);
    if (host !== 'localhost') candidates.push('http://localhost:4000/api');
    if (host !== '127.0.0.1') candidates.push('http://127.0.0.1:4000/api');
  }

  // 6. Metro Bundler dynamic host (Expo Go / debug builds on devices/emulators)
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const metroHost = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0];
    if (metroHost && metroHost !== 'localhost' && metroHost !== '127.0.0.1' && metroHost !== '10.0.2.2') {
      candidates.push(`http://${metroHost}:4000/api`);
    }
  }

  // 7. Standard local loopback endpoints
  candidates.push('http://localhost:4000/api');
  candidates.push('http://127.0.0.1:4000/api');

  // De-duplicate while preserving candidate priority
  return Array.from(new Set(candidates.filter(Boolean)));
};

/**
 * Returns the currently active working API base URL.
 */
export const getApiBase = () => {
  if (customApiBase) return customApiBase;
  if (cachedApiBase) return cachedApiBase;
  if (process.env.EXPO_PUBLIC_API_URL && typeof process.env.EXPO_PUBLIC_API_URL === 'string' && process.env.EXPO_PUBLIC_API_URL.trim()) {
    return process.env.EXPO_PUBLIC_API_URL.trim().replace(/\/+$/, '');
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const currentHost = window.location.hostname;
    return `http://${currentHost}:4000/api`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api';
  }
  const candidates = getCandidateApiUrls();
  return candidates[0] || 'http://localhost:4000/api';
};

export const setApiBase = (url) => {
  if (url) {
    cachedApiBase = url.replace(/\/+$/, '');
    try {
      AsyncStorage.setItem('abhyas_last_working_api', cachedApiBase).catch(() => {});
    } catch {}
  }
};

/**
 * Quick ping to test if a given API base URL is reachable and healthy.
 */
export async function testApiConnection(baseUrl, timeoutMs = 2500) {
  try {
    const clean = baseUrl.replace(/\/+$/, '');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(`${clean}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timer);
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Fast parallel probe to find the first healthy API candidate.
 */
export async function findWorkingApiBase() {
  if (customApiBase && await testApiConnection(customApiBase, 2000)) {
    return customApiBase;
  }
  if (cachedApiBase && await testApiConnection(cachedApiBase, 1500)) {
    return cachedApiBase;
  }

  const candidates = getCandidateApiUrls();
  const probePromises = candidates.map(async (url) => {
    const ok = await testApiConnection(url, 2000);
    if (ok) return url;
    throw new Error('Unreachable: ' + url);
  });

  try {
    // Fast first responder wins
    const workingUrl = await Promise.any(probePromises);
    setApiBase(workingUrl);
    return workingUrl;
  } catch {
    return null;
  }
}

/**
 * Smart, resilient API fetch that automatically fails over between candidates.
 * Checks the active base first, and if unreachable, quickly discovers the healthy server
 * without freezing the user interface.
 */
export async function smartApiFetch(route, options = {}) {
  const path = route.startsWith('/') ? route : '/' + route;

  // 1. Try currently active base URL first
  const currentBase = getApiBase();
  const requestTimeoutMs = options.timeout || (Platform.OS === 'web' ? 6000 : 8000);

  const directController = new AbortController();
  const directTimer = setTimeout(() => directController.abort(), requestTimeoutMs);

  try {
    const mergedOptions = {
      ...options,
      signal: options.signal || directController.signal
    };
    const res = await fetch(currentBase + path, mergedOptions);
    clearTimeout(directTimer);

    // Any HTTP status (200, 400, 401, 404, 500) means server is reached!
    setApiBase(currentBase);
    return res;
  } catch (initialErr) {
    clearTimeout(directTimer);

    // Initial base failed or timed out. Invalidate cached base
    if (currentBase === cachedApiBase && currentBase !== customApiBase) {
      cachedApiBase = null;
    }

    // 2. Fast failover: probe candidates in parallel to locate live server
    const workingBase = await findWorkingApiBase();
    if (workingBase && workingBase !== currentBase) {
      try {
        const retryController = new AbortController();
        const retryTimer = setTimeout(() => retryController.abort(), requestTimeoutMs);
        const retryOptions = {
          ...options,
          signal: options.signal || retryController.signal
        };
        const retryRes = await fetch(workingBase + path, retryOptions);
        clearTimeout(retryTimer);
        setApiBase(workingBase);
        return retryRes;
      } catch (retryErr) {
        // Fall through to error reporting
      }
    }

    // 3. Fallback sequential probe of remaining candidates if parallel check didn't catch
    const candidates = getCandidateApiUrls().filter(u => u !== currentBase && u !== workingBase);
    let lastError = initialErr;

    for (let i = 0; i < candidates.length; i++) {
      const candidateBase = candidates[i];
      const controller = new AbortController();
      const probeTimer = setTimeout(() => controller.abort(), 2000);

      try {
        const probeOptions = {
          ...options,
          signal: options.signal || controller.signal
        };
        const probeRes = await fetch(candidateBase + path, probeOptions);
        clearTimeout(probeTimer);
        setApiBase(candidateBase);
        return probeRes;
      } catch (err) {
        clearTimeout(probeTimer);
        lastError = err;
      }
    }

    if (lastError && (lastError.name === 'AbortError' || String(lastError.message).toLowerCase().includes('abort'))) {
      throw new Error('Connection timed out. Please verify your Wi-Fi or backend server address.');
    }

    throw lastError || new Error(`Cannot connect to server. Please verify backend is running on port 4000.`);
  }
}

export default {
  getCandidateApiUrls,
  getApiBase,
  setApiBase,
  setCustomApiBase,
  getCustomApiBase,
  testApiConnection,
  findWorkingApiBase,
  smartApiFetch
};
