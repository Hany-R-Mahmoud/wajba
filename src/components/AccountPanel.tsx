import { useState } from 'react';
import { authClient } from '../auth/client';
import { createCurrentWajbaBackup, parseWajbaBackup, replaceWajbaState } from '../utils/storage';
import type { Language } from '../types';

export function AccountPanel({ language }: { language: Language }) {
  if (!authClient) return null;
  return <ConnectedAccount language={language} />;
}

function ConnectedAccount({ language }: { language: Language }) {
  const { data: session, isPending, error: sessionError } = authClient!.useSession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const ar = language === 'ar';
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setMessage('');
    try { await action(); }
    catch { setMessage(ar ? 'تعذرت العملية. بياناتك المحلية محفوظة. حاول مرة أخرى.' : 'Unable to complete. Your local data is safe. Please try again.'); }
    finally { setBusy(false); }
  };
  const backup = async (restore: boolean) => {
    if (restore && !window.confirm(ar ? 'استبدال البيانات على هذا الجهاز بالنسخة السحابية؟ صدّر نسخة محلية أولاً من الإعدادات.' : 'Replace this device’s data with your cloud backup? Export a local backup in Settings first.')) return;
    await run(async () => {
      const currentSession = await authClient!.getSession();
      const token = currentSession.data?.session?.token;
      if (currentSession.error || !token) throw new Error('Session unavailable');
      const response = await fetch('/api/backup', {
        method: restore ? 'GET' : 'PUT',
        headers: { Authorization: `Bearer session:${token}`, 'Content-Type': 'application/json' },
        ...(restore ? {} : { body: JSON.stringify(createCurrentWajbaBackup()) }),
      });
      if (!response.ok) throw new Error('Backup unavailable');
      if (restore) {
        const result = await response.json();
        if (!result.backup) { setMessage(ar ? 'لا توجد نسخة سحابية بعد.' : 'No cloud backup yet.'); return; }
        const parsed = parseWajbaBackup(result.backup);
        if (!parsed) throw new Error('Invalid backup');
        replaceWajbaState(parsed.state);
        window.location.reload();
      } else setMessage(ar ? 'تم حفظ نسخة سحابية.' : 'Cloud backup saved.');
    });
  };
  const buttonClass = 'rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold disabled:opacity-50 dark:border-slate-600';
  return <section aria-label={ar ? 'الحساب والنسخ الاحتياطي' : 'Account and backup'} className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6" dir={ar ? 'rtl' : 'ltr'}>
    {isPending ? <span role="status">{ar ? 'جارٍ تحميل الحساب…' : 'Loading account…'}</span> : session?.user ? <>
      <span className="text-sm">{session.user.name || session.user.email}</span>
      <button className={buttonClass} disabled={busy} onClick={() => backup(false)}>{ar ? 'حفظ نسخة سحابية' : 'Save cloud backup'}</button>
      <button className={buttonClass} disabled={busy} onClick={() => backup(true)}>{ar ? 'استعادة نسخة سحابية' : 'Restore cloud backup'}</button>
      <button className={buttonClass} disabled={busy} onClick={() => run(async () => { const result = await authClient!.signOut(); if (result.error) throw result.error; })}>{ar ? 'تسجيل الخروج' : 'Sign out'}</button>
    </> : <>
      <button className={buttonClass} disabled={busy} onClick={() => run(async () => {
        const result = await authClient!.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/dashboard` });
        if (result.error) throw result.error;
      })}>{busy ? (ar ? 'جارٍ الاتصال…' : 'Connecting…') : (ar ? 'تسجيل الدخول باستخدام Google' : 'Sign in with Google')}</button>
      <span className="text-xs text-stone-500">{ar ? 'يمكنك المتابعة بدون حساب. الحفظ السحابي اختياري.' : 'Continue without an account. Cloud backup is optional.'}</span>
    </>}
    <a href="/privacy.html" className="text-xs underline">{ar ? 'الخصوصية' : 'Privacy'}</a>
    {(message || sessionError) && <p role="status" className="w-full text-sm">{message || (ar ? 'تعذر تحميل الحساب. حاول تحديث الصفحة.' : 'Unable to load account. Try refreshing.')}</p>}
  </section>;
}
