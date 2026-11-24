import { useState } from 'react';
import { authClient } from '../auth/client';
import { useAppSession } from '../auth/SessionProvider';
import { ApiError, apiErrorMessage, apiRequest } from '../lib/api';
import { createCurrentWajbaBackup, parseWajbaBackup, replaceWajbaState } from '../utils/storage';
import { ErrorState, LoadingState } from './AsyncState';
import type { Language } from '../types';

export function AccountPanel({ language }: { language: Language }) {
  const { userId, displayName, token, isPending, hasError } = useAppSession();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [failure, setFailure] = useState<{ message: string; retry: () => void } | null>(null);
  const ar = language === 'ar';

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
    if (!token) throw new ApiError('auth', 401);
    // PUT is an upsert, so repeating it after a timeout cannot create a second copy.
    await apiRequest('/api/backup', { method: 'PUT', token, body: createCurrentWajbaBackup(), idempotent: true, timeoutMs: 15_000 });
    setNotice(ar ? 'تم حفظ نسخة سحابية.' : 'Cloud backup saved.');
  });

  const restoreBackup = () => {
    if (!window.confirm(ar ? 'استبدال البيانات على هذا الجهاز بالنسخة السحابية؟ صدّر نسخة محلية أولاً من الإعدادات.' : 'Replace this device’s data with your cloud backup? Export a local backup in Settings first.')) return;
    void run(async () => {
      if (!token) throw new ApiError('auth', 401);
      const result = await apiRequest<{ backup: unknown }>('/api/backup', { token, timeoutMs: 15_000 });
      if (!result.backup) { setNotice(ar ? 'لا توجد نسخة سحابية بعد.' : 'No cloud backup yet.'); return; }
      const parsed = parseWajbaBackup(result.backup);
      if (!parsed) throw new ApiError('invalid');
      replaceWajbaState(parsed.state);
      window.location.reload();
    });
  };

  const signIn = () => run(async () => {
    const result = await authClient.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/dashboard` });
    if (result.error) throw result.error;
  });
  const signOut = () => run(async () => {
    const result = await authClient.signOut();
    if (result.error) throw result.error;
  });

  const buttonClass = 'min-h-11 rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold disabled:opacity-50 dark:border-slate-600';
  return <section aria-label={ar ? 'الحساب والنسخ الاحتياطي' : 'Account and backup'} aria-busy={isPending || busy} className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6" dir={ar ? 'rtl' : 'ltr'}>
    {isPending ? <LoadingState language={language} label={ar ? 'جارٍ تحميل الحساب…' : 'Loading account…'} /> : userId ? <>
      <span className="text-sm">{displayName}</span>
      <button className={buttonClass} disabled={busy} onClick={saveBackup}>{busy ? (ar ? 'جارٍ العمل…' : 'Working…') : (ar ? 'حفظ نسخة سحابية' : 'Save cloud backup')}</button>
      <button className={buttonClass} disabled={busy} onClick={restoreBackup}>{ar ? 'استعادة نسخة سحابية' : 'Restore cloud backup'}</button>
      <button className={buttonClass} disabled={busy} onClick={signOut}>{ar ? 'تسجيل الخروج' : 'Sign out'}</button>
    </> : <>
      <button className={buttonClass} disabled={busy} onClick={signIn}>{busy ? (ar ? 'جارٍ الاتصال…' : 'Connecting…') : (ar ? 'تسجيل الدخول باستخدام Google' : 'Sign in with Google')}</button>
      <span className="text-xs text-stone-500">{ar ? 'يمكنك المتابعة بدون حساب. الحفظ السحابي اختياري.' : 'Continue without an account. Cloud backup is optional.'}</span>
    </>}
    <a href="/privacy.html" className="text-xs underline">{ar ? 'الخصوصية' : 'Privacy'}</a>
    {notice && <p role="status" className="w-full text-sm">{notice}</p>}
    {failure && <div className="w-full"><ErrorState language={language} message={failure.message} onRetry={failure.retry} /></div>}
    {!failure && hasError && <div className="w-full"><ErrorState language={language} message={ar ? 'تعذر تحميل الحساب. حاول تحديث الصفحة.' : 'Unable to load account. Try refreshing.'} onRetry={() => window.location.reload()} /></div>}
  </section>;
}
