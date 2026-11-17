import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let customApiBase = null;
let cachedApiBase = null;

// Immediately restore saved server IP from local storage
AsyncStorage.getItem('@abhyas_custom_api_base').then((saved) => {
  if (saved && saved.trim()) {
    customApiBase = saved.trim().replace(/\/+$/, '');
    cachedApiBase = customApiBase;
  }
}).catch(() => {});

export const setCustomApiBase = async (url) => {
  if (url && url.trim()) {
    customApiBase = url.trim().replace(/\/+$/, '');
    cachedApiBase = customApiBase;
    try {
      await AsyncStorage.setItem('@abhyas_custom_api_base', customApiBase);
    } catch {}
  } else {
    customApiBase = null;
    try {
      await AsyncStorage.removeItem('@abhyas_custom_api_base');
    } catch {}
  }
};

export const getCustomApiBase = () => customApiBase;

if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('online', () => {
    cachedApiBase = null;
  });
  window.addEventListener('offline', () => {
    cachedApiBase = null;
  });
}

/**
 * Returns candidate API endpoints based on the active runtime environment.
 * Evaluates dynamically on call so network or host changes are immediately reflected.
 * Supports switching between Wi-Fi networks seamlessly.
 */
export const getCandidateApiUrls = () => {
  const candidates = [];

  // 1. User-defined custom server override (if configured, highest priority)
  if (customApiBase) {
    candidates.push(customApiBase);
  }

  // 2. Web browser: prioritize current origin host and local loopbacks
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    candidates.push(`http://${host}:4000/api`);
    if (host !== 'localhost') candidates.push('http://localhost:4000/api');
    if (host !== '127.0.0.1') candidates.push('http://127.0.0.1:4000/api');
  }

  // 3. Environment variable override for deployed remote backend or APK builds
  if (process.env.EXPO_PUBLIC_API_URL && typeof process.env.EXPO_PUBLIC_API_URL === 'string' && process.env.EXPO_PUBLIC_API_URL.trim()) {
    candidates.push(process.env.EXPO_PUBLIC_API_URL.trim().replace(/\/+$/, ''));
  }

  // 4. Metro Bundler dynamic host (Expo Go on physical mobile devices / emulators)
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const metroHost = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0];
    if (metroHost && metroHost !== 'localhost' && metroHost !== '127.0.0.1') {
      candidates.push(`http://${metroHost}:4000/api`);
    }
  }

  // 4b. Local Development Machine IPs (Current active Wi-Fi IP and common local subnets)
  candidates.push('http://10.116.34.214:4000/api');
  candidates.push('http://10.185.72.214:4000/api');

  // 4c. Mobile Hotspot Gateways (Windows Mobile Hotspot, Android Hotspot, iOS Hotspot)
  candidates.push('http://192.168.137.1:4000/api'); // Windows Mobile Hotspot default host gateway
  candidates.push('http://192.168.43.1:4000/api');  // Android Hotspot default gateway
  candidates.push('http://172.20.10.1:4000/api');   // iOS Personal Hotspot default gateway
  candidates.push('http://192.168.1.100:4000/api'); // Common Home Wi-Fi
  candidates.push('http://192.168.0.100:4000/api'); // Common Office Wi-Fi

  // 5. Android emulator loopback alias
  if (Platform.OS === 'android') {
    candidates.push('http://10.0.2.2:4000/api');
  }

  // 6. Standard local loopback endpoints
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
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const currentHost = window.location.hostname;
    return `http://${currentHost}:4000/api`;
  }
  if (process.env.EXPO_PUBLIC_API_URL && typeof process.env.EXPO_PUBLIC_API_URL === 'string' && process.env.EXPO_PUBLIC_API_URL.trim()) {
    return process.env.EXPO_PUBLIC_API_URL.trim().replace(/\/+$/, '');
  }
  if (cachedApiBase) return cachedApiBase;
  return getCandidateApiUrls()[0] || 'http://localhost:4000/api';
};

export const setApiBase = (url) => {
  if (url) cachedApiBase = url;
};

/**
 * Quick ping to test if a given API base URL is reachable and healthy.
 */
export async function testApiConnection(baseUrl) {
  try {
    const clean = (baseUrl || getApiBase()).replace(/\/+$/, '');
    const res = await fetch(`${clean}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout ? AbortSignal.timeout(2500) : undefined
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Smart, resilient API fetch that automatically fails over between candidates.
 * Uses fast adaptive timeout (2s) when probing failover candidates so Wi-Fi switching
 * is immediate and never freezes the user interface.
 */
export async function smartApiFetch(route, options = {}) {
  const path = route.startsWith('/') ? route : '/' + route;
  const initialBase = getApiBase();
  const allCandidates = getCandidateApiUrls();
  const candidates = [
    initialBase,
    ...allCandidates.filter(u => u !== initialBase)
  ];

  let lastError = null;

  for (let i = 0; i < candidates.length; i++) {
    const base = candidates[i];
    const fullUrl = base + path;

    // Fast adaptive timeout: 2s for probing candidates, max 3s on web or 4s on mobile
    const maxTimeout = Platform.OS === 'web' ? 3000 : 4500;
    const timeoutMs = options.timeout || (candidates.length > 1 && i < candidates.length - 1 ? 2000 : maxTimeout);

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
      // Invalidate cached base if initial candidate failed
      if (base === cachedApiBase) {
        cachedApiBase = null;
      }
      continue;
    }
  }

  if (lastError && (lastError.name === 'AbortError' || String(lastError.message).toLowerCase().includes('abort'))) {
    throw new Error('Connection timed out. Please verify your Wi-Fi, hotspot, or server address.');
  }

  throw lastError || new Error(`Cannot connect to server across network. Tried: ${candidates.join(', ')}`);
}

export default {
  getCandidateApiUrls,
  getApiBase,
  setApiBase,
  setCustomApiBase,
  getCustomApiBase,
  testApiConnection,
  smartApiFetch
};
