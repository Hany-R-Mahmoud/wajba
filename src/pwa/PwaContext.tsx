import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import {
  buildAndroidIntentUrl, classifyPlatform, copyText, isLikelyWebView, isStandalone, isTimestampActive,
  PWA_DISMISSED_AT_KEY, PWA_DISMISSAL_DAYS, PWA_INSTALLED_HINT_AT_KEY, PWA_INSTALLED_HINT_DAYS,
  promptInstall, readTimestamp, removeTimestamp, writeTimestamp,
  type BeforeInstallPromptEventLike, type InstallOutcome, type InstallPlatform,
} from './pwa';

type PwaContextValue = Readonly<{
  platform: InstallPlatform;
  isStandalone: boolean;
  isLikelyWebView: boolean;
  isOnline: boolean;
  canInstall: boolean;
  installedHint: boolean;
  showPromotion: boolean;
  currentUrl: string;
  androidIntentUrl: string | null;
  helpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  dismissPromotion: () => void;
  install: () => Promise<InstallOutcome>;
  confirmInstalled: () => void;
  copyCurrentUrl: () => Promise<boolean>;
}>;

const PwaContext = createContext<PwaContextValue | null>(null);

function getStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function getStandaloneState(): boolean {
  return isStandalone(
    typeof window !== 'undefined' ? window.matchMedia.bind(window) : undefined,
    Reflect.get(typeof navigator === 'undefined' ? {} : navigator, 'standalone'),
  );
}

export function PwaProvider({children}: {children: ReactNode}) {
  const [standalone, setStandalone] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>('unknown');
  const [embedded, setEmbedded] = useState(false);
  const [online, setOnline] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [installedHint, setInstalledHint] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const dismissedInMemoryRef = useRef(false);
  const dismissalPersistenceFailedRef = useRef(false);
  const promptEventRef = useRef<BeforeInstallPromptEventLike | null>(null);
  const promptInFlightRef = useRef(false);
  const dismissalTimerRef = useRef<number | undefined>(undefined);

  const reconcile = useCallback(() => {
    const nextStandalone = getStandaloneState();
    const storage = getStorage();
    const now = Date.now();
    const dismissalTimestamp = readTimestamp(storage, PWA_DISMISSED_AT_KEY);
    const installedTimestamp = readTimestamp(storage, PWA_INSTALLED_HINT_AT_KEY);
    setStandalone(nextStandalone);
    const dismissalActive = isTimestampActive(dismissalTimestamp, now, PWA_DISMISSAL_DAYS);
    if (dismissalActive) dismissedInMemoryRef.current = true;
    else if (storage && !dismissalPersistenceFailedRef.current) dismissedInMemoryRef.current = false;
    setDismissed(dismissalActive || dismissedInMemoryRef.current);
    setInstalledHint(isTimestampActive(installedTimestamp, now, PWA_INSTALLED_HINT_DAYS));
    setCurrentUrl(window.location.href);
    if (dismissalTimerRef.current !== undefined) window.clearTimeout(dismissalTimerRef.current);
    if (dismissalActive && dismissalTimestamp !== null) {
      const remaining = dismissalTimestamp + PWA_DISMISSAL_DAYS * 24 * 60 * 60 * 1000 - now;
      dismissalTimerRef.current = window.setTimeout(() => {
        dismissedInMemoryRef.current = false;
        setDismissed(false);
        removeTimestamp(getStorage(), PWA_DISMISSED_AT_KEY);
      }, Math.max(0, remaining));
    }
  }, []);

  useEffect(() => {
    setPlatform(classifyPlatform(navigator.userAgent));
    setEmbedded(isLikelyWebView(navigator.userAgent));
    setOnline(navigator.onLine);
    reconcile();

    const handleBeforeInstallPrompt = (event: Event) => {
      const installEvent = event as Event & BeforeInstallPromptEventLike;
      installEvent.preventDefault?.();
      promptEventRef.current = installEvent;
      setCanInstall(true);
      setInstalledHint(false);
      removeTimestamp(getStorage(), PWA_INSTALLED_HINT_AT_KEY);
    };
    const handleAppInstalled = () => {
      promptEventRef.current = null;
      setCanInstall(false);
      setInstalledHint(true);
      writeTimestamp(getStorage(), PWA_INSTALLED_HINT_AT_KEY);
    };
    const handleLocationChange = () => setCurrentUrl(window.location.href);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pageshow', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pageshow', reconcile);
      document.removeEventListener('visibilitychange', reconcile);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      if (dismissalTimerRef.current !== undefined) window.clearTimeout(dismissalTimerRef.current);
    };
  }, [reconcile]);

  const dismissPromotion = useCallback(() => {
    const storage = getStorage();
    const now = Date.now();
    dismissedInMemoryRef.current = true;
    setDismissed(true);
    const persisted = writeTimestamp(storage, PWA_DISMISSED_AT_KEY, now);
    if (!persisted) dismissalPersistenceFailedRef.current = true;
    if (persisted) {
      dismissalPersistenceFailedRef.current = false;
      if (dismissalTimerRef.current !== undefined) window.clearTimeout(dismissalTimerRef.current);
      dismissalTimerRef.current = window.setTimeout(() => {
        dismissedInMemoryRef.current = false;
        setDismissed(false);
        removeTimestamp(getStorage(), PWA_DISMISSED_AT_KEY);
      }, PWA_DISMISSAL_DAYS * 24 * 60 * 60 * 1000);
    }
  }, []);

  const install = useCallback(async (): Promise<InstallOutcome> => {
    if (promptInFlightRef.current) return 'unavailable';
    const event = promptEventRef.current;
    if (!event) {
      setHelpOpen(true);
      return 'unavailable';
    }
    promptInFlightRef.current = true;
    promptEventRef.current = null;
    setCanInstall(false);
    const outcome = await promptInstall(event);
    if (outcome === 'dismissed') dismissPromotion();
    promptInFlightRef.current = false;
    return outcome;
  }, [dismissPromotion]);

  const confirmInstalled = useCallback(() => {
    writeTimestamp(getStorage(), PWA_INSTALLED_HINT_AT_KEY);
    setInstalledHint(true);
    setHelpOpen(false);
  }, []);

  const copyCurrentUrl = useCallback(() => copyText(window.location.href), []);

  const value = useMemo<PwaContextValue>(() => {
    const url = currentUrl || (typeof window === 'undefined' ? '' : window.location.href);
    return {
      platform,
      isStandalone: standalone,
      isLikelyWebView: embedded,
      isOnline: online,
      canInstall,
      installedHint,
      showPromotion: !standalone && !installedHint && !dismissed && (canInstall || embedded || platform === 'android' || platform === 'ios'),
      currentUrl: url,
      androidIntentUrl: buildAndroidIntentUrl(url),
      helpOpen,
      openHelp: () => setHelpOpen(true),
      closeHelp: () => setHelpOpen(false),
      dismissPromotion,
      install,
      confirmInstalled,
      copyCurrentUrl,
    };
  }, [canInstall, confirmInstalled, copyCurrentUrl, currentUrl, dismissed, dismissPromotion, embedded, helpOpen, install, installedHint, online, platform, standalone]);

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

export function usePwa(): PwaContextValue {
  const context = useContext(PwaContext);
  if (!context) throw new Error('usePwa must be used inside PwaProvider');
  return context;
}
