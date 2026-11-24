import { LogIn } from 'lucide-react';
import { useAppSession } from '../auth/SessionProvider';
import type { Language } from '../types';

/** Header entry: a small avatar when signed in, a "Sign in" link when not. Both open Settings. */
export function AccountEntry({ language, onOpen }: { language: Language; onOpen: () => void }) {
  const { userId, displayName, isPending } = useAppSession();
  const ar = language === 'ar';
  if (isPending) return <span className="h-9 w-9 shrink-0 rounded-full bg-[#eeece7] dark:bg-stone-800" aria-hidden="true" />;
  const base = 'flex h-9 shrink-0 items-center justify-center rounded-full border border-[#d9d9dd] text-xs font-bold cursor-pointer transition-colors hover:border-[#17171c] dark:border-stone-700 dark:hover:border-white';
  if (userId) {
    const initial = String(Array.from(displayName.trim())[0] ?? '•').toUpperCase();
    return <button type="button" onClick={onOpen} aria-label={ar ? `الحساب: ${displayName}` : `Account: ${displayName}`} title={displayName} className={`${base} w-9 bg-[#17171c] text-white dark:bg-white dark:text-[#17171c]`}>{initial}</button>;
  }
  return <button type="button" onClick={onOpen} className={`${base} gap-1.5 bg-[#eeece7] px-3 text-[#17171c] dark:bg-stone-800 dark:text-stone-200`}><LogIn className="h-3.5 w-3.5 text-[#ff7759]" aria-hidden="true" /><span>{ar ? 'دخول' : 'Sign in'}</span></button>;
}
