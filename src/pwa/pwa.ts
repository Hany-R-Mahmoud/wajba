export const PWA_DISMISSAL_DAYS = 7;
export const PWA_INSTALLED_HINT_DAYS = 30;
export const PWA_DISMISSED_AT_KEY = 'wajba-pwa-dismissed-at';
export const PWA_INSTALLED_HINT_AT_KEY = 'wajba-pwa-installed-hint-at';
export const PWA_HASH_PARAM = '__pwa_hash';

export type InstallPlatform = 'android' | 'ios' | 'desktop' | 'unknown';
export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

export type BeforeInstallPromptEventLike = {
  preventDefault?: () => void;
  prompt?: () => void | Promise<void>;
  userChoice?: Promise<{outcome?: 'accepted' | 'dismissed'}>;
};

export type PwaLocationLike = {href: string; search: string; hash: string};

export function isStandalone(
  matchMedia: ((query: string) => MediaQueryList) | undefined,
  appleStandalone: unknown,
): boolean {
  return matchMedia?.('(display-mode: standalone)').matches === true || appleStandalone === true;
}

export function classifyPlatform(userAgent: string): InstallPlatform {
  const ua = userAgent.toLowerCase();
  if (/android/.test(ua)) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/windows|macintosh|linux|cros/.test(ua)) return 'desktop';
  return 'unknown';
}

export function isLikelyWebView(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  const androidWebView = /android/.test(ua) && /\bwv\b|; wv\)/.test(ua);
  const embeddedHost = /fban|fbav|instagram|line\/|micromessenger|pinterest|snapchat|twitter|tiktok|gsa\//.test(ua);
  const iosWebView = /iphone|ipad|ipod/.test(ua) && !/safari|crios|fxios|edgios/.test(ua);
  return androidWebView || embeddedHost || iosWebView;
}

export function isTimestampActive(timestamp: number | null, now = Date.now(), days: number): boolean {
  if (timestamp === null || timestamp > now) return false;
  return now - timestamp < days * 24 * 60 * 60 * 1000;
}

export function readTimestamp(storage: Storage | undefined, key: string): number | null {
  try {
    const value = storage?.getItem(key);
    if (!value) return null;
    const timestamp = Number(value);
    return Number.isFinite(timestamp) ? timestamp : null;
  } catch {
    return null;
  }
}

export function writeTimestamp(storage: Storage | undefined, key: string, value = Date.now()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

export function removeTimestamp(storage: Storage | undefined, key: string): void {
  try {
    storage?.removeItem(key);
  } catch {
    // PWA state remains usable when browser storage is unavailable.
  }
}

function addHashTransport(url: URL): URL {
  if (!url.hash) return url;
  const hashValue = url.hash.slice(1);
  url.hash = '';
  url.searchParams.set(PWA_HASH_PARAM, hashValue);
  return url;
}

export function buildAndroidIntentUrl(inputUrl: string, fallbackUrl = inputUrl): string | null {
  try {
    const url = new URL(inputUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    const transportedUrl = addHashTransport(new URL(url.href));
    const fallback = addHashTransport(new URL(fallbackUrl)).href;
    const path = `${transportedUrl.host}${transportedUrl.pathname}${transportedUrl.search}`;
    return `intent://${path}#Intent;scheme=${transportedUrl.protocol.slice(0, -1)};S.browser_fallback_url=${encodeURIComponent(fallback)};end`;
  } catch {
    return null;
  }
}

export function restoreHashFromLocation(
  location: PwaLocationLike = window.location,
  history: Pick<History, 'state' | 'replaceState'> = window.history,
): boolean {
  try {
    const url = new URL(location.href);
    const transportedHash = url.searchParams.get(PWA_HASH_PARAM);
    if (transportedHash === null) return false;
    url.searchParams.delete(PWA_HASH_PARAM);
    url.hash = transportedHash ? `#${transportedHash}` : '';
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
    return true;
  } catch {
    return false;
  }
}

export async function copyText(
  text: string,
  clipboard: Pick<Clipboard, 'writeText'> | undefined = typeof navigator === 'undefined' ? undefined : navigator.clipboard,
): Promise<boolean> {
  try {
    if (clipboard) {
      await clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the selectable textarea path.
  }
  if (typeof document === 'undefined') return false;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand?.('copy') === true;
  textarea.remove();
  return copied;
}

export async function promptInstall(event: BeforeInstallPromptEventLike): Promise<InstallOutcome> {
  if (typeof event.prompt !== 'function') return 'unavailable';
  try {
    await event.prompt();
    const choice = await event.userChoice;
    return choice?.outcome === 'accepted' ? 'accepted' : 'dismissed';
  } catch {
    return 'unavailable';
  }
}
