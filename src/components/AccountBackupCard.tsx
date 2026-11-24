import { useCallback, useEffect, useRef, useState } from 'react';
import { Cloud, CloudDownload, LogIn, LogOut } from 'lucide-react';
import { authClient } from '../auth/client';
import { useAppSession } from '../auth/SessionProvider';
import { ApiError, apiErrorMessage, apiRequest } from '../lib/api';
import { createCurrentWajbaBackup, parseWajbaBackup, replaceWajbaState } from '../utils/storage';
import { ErrorState, LoadingState } from './AsyncState';
import type { Language } from '../types';

const formatSavedAt = (iso: string, ar: boolean) =>
  new Intl.DateTimeFormat(ar ? 'ar-EG' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

/**
 * Cloud half of the "Account and backup" card in Settings: sign in or out, save and restore
 * the cloud copy, and show when it was last saved. Local JSON export lives next to it.
 */
export function AccountBackupCard({ language }: { language: Language }) {
  const { userId, displayName, token, isPending, hasError } = useAppSession();
  const tokenRef = useRef(token);
  tokenRef.current = token; // retries re-run an old closure, so they read the latest token here
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [failure, setFailure] = useState<{ message: string; retry: () => void } | null>(null);
  const [savedAt, setSavedAt] = useState<string | null | undefined>(undefined); // undefined = not loaded yet
  const ar = language === 'ar';

  // Ask the server only for the save time, never for the whole backup.
  const loadSavedAt = useCallback(async (signal?: AbortSignal) => {
    const current = tokenRef.current;
    if (!current) return;
    try {
      const result = await apiRequest<{ updated_at: string | null }>('/api/backup?meta=1', { token: current, timeoutMs: 10_000, signal });
      setSavedAt(result.updated_at);
    } catch {
      if (!signal?.aborted) setSavedAt(null); // the time is a nicety; failing to read it must not block saving
    }
  }, []);

  useEffect(() => {
    if (!userId) { setSavedAt(undefined); return; }
    const controller = new AbortController();
    void loadSavedAt(controller.signal);
    return () => controller.abort();
  }, [userId, loadSavedAt]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setNotice('');
    setFailure(null);
    try {
      await action();
    } catch (error) {
      setFailure({
        message: error instanceof ApiError ? apiErrorMessage(error, ar) : (ar ? 'تعذرت العملية. بياناتك المحلية محفوظة. حاول مرة أخرى.' : 'Unable to complete. Your local data is safe. Please try again.'),
        retry: () => void run(action),
      });
    } finally {
      setBusy(false);
    }
  };

  const saveBackup = () => run(async () => {
    const current = tokenRef.current;
    if (!current) throw new ApiError('auth', 401);
    // PUT is an upsert, so repeating it after a timeout cannot create a second copy.
    await apiRequest('/api/backup', { method: 'PUT', token: current, body: createCurrentWajbaBackup(), idempotent: true, timeoutMs: 15_000 });
    setSavedAt(new Date().toISOString());
    setNotice(ar ? 'تم حفظ نسخة سحابية.' : 'Cloud backup saved.');
  });

  const restoreBackup = () => {
    if (!window.confirm(ar ? 'استبدال البيانات على هذا الجهاز بالنسخة السحابية؟ صدّر نسخة محلية أولاً.' : 'Replace this device’s data with your cloud backup? Export a local backup first.')) return;
    void run(async () => {
      const current = tokenRef.current;
      if (!current) throw new ApiError('auth', 401);
      const result = await apiRequest<{ backup: unknown }>('/api/backup', { token: current, timeoutMs: 15_000 });
      if (!result.backup) { setNotice(ar ? 'لا توجد نسخة سحابية بعد.' : 'No cloud backup yet.'); return; }
      const parsed = parseWajbaBackup(result.backup);
      if (!parsed) throw new ApiError('invalid');
      replaceWajbaState(parsed.state);
      window.location.reload();
    });
  };

  const signIn = () => run(async () => {
    const result = await authClient.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/dashboard/settings` });
    if (result.error) throw result.error;
  });
  const signOut = () => run(async () => {
    const result = await authClient.signOut();
    if (result.error) throw result.error;
  });

  const buttonClass = 'inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50';
  const primary = `${buttonClass} bg-[#17171c] text-white dark:bg-white dark:text-[#17171c]`;
  const secondary = `${buttonClass} bg-[#eeece7] text-[#17171c] dark:bg-stone-800 dark:text-stone-100`;

  const savedLine = savedAt === undefined
    ? (ar ? 'جارٍ التحقق من آخر حفظ…' : 'Checking last save…')
    : savedAt
      ? (ar ? `آخر حفظ: ${formatSavedAt(savedAt, true)}` : `Last saved: ${formatSavedAt(savedAt, false)}`)
      : (ar ? 'لم تُحفظ نسخة سحابية بعد.' : 'No cloud backup saved yet.');

  return <div aria-busy={isPending || busy} className="space-y-3">
    {isPending ? <LoadingState language={language} label={ar ? 'جارٍ تحميل الحساب…' : 'Loading account…'} /> : userId ? <>
      <p className="text-sm"><span className="font-bold">{displayName}</span><span className="block text-stone-600 dark:text-stone-300" data-testid="last-saved">{savedLine}</span></p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={primary} disabled={busy} onClick={saveBackup}><Cloud className="h-4 w-4 text-[#ff7759]" aria-hidden="true" />{busy ? (ar ? 'جارٍ العمل…' : 'Working…') : (ar ? 'حفظ نسخة سحابية' : 'Save cloud backup')}</button>
        <button type="button" className={secondary} disabled={busy} onClick={restoreBackup}><CloudDownload className="h-4 w-4" aria-hidden="true" />{ar ? 'استعادة نسخة سحابية' : 'Restore cloud backup'}</button>
        <button type="button" className={secondary} disabled={busy} onClick={signOut}><LogOut className="h-4 w-4" aria-hidden="true" />{ar ? 'تسجيل الخروج' : 'Sign out'}</button>
      </div>
    </> : <>
      <p className="text-sm text-stone-600 dark:text-stone-300">{ar ? 'سجّل الدخول لحفظ نسخة من خططك في حسابك واستعادتها على أي جهاز. يمكنك المتابعة بدون حساب.' : 'Sign in to keep a copy of your plans in your account and restore it on any device. You can also keep using Wajba without an account.'}</p>
      <button type="button" className={primary} disabled={busy} onClick={signIn}><LogIn className="h-4 w-4 text-[#ff7759]" aria-hidden="true" />{busy ? (ar ? 'جارٍ الاتصال…' : 'Connecting…') : (ar ? 'تسجيل الدخول باستخدام Google' : 'Sign in with Google')}</button>
    </>}
    {notice && <p role="status" className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{notice}</p>}
    {failure && <ErrorState language={language} message={failure.message} onRetry={failure.retry} />}
    {!failure && hasError && <ErrorState language={language} message={ar ? 'تعذر تحميل الحساب. حاول تحديث الصفحة.' : 'Unable to load account. Try refreshing.'} onRetry={() => window.location.reload()} />}
  </div>;
}
