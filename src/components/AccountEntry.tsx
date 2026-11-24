import { LogIn } from 'lucide-react';
import { useAppSession } from '../auth/SessionProvider';
import type { Language } from '../types';

/** Header entry: a small avatar when signed in, a "Sign in" link when not. Both open Settings. */
export function AccountEntry({ language, onOpen }: { language: Language; onOpen: () => void }) {
  const { userId, displayName, isPending } = useAppSession();
  const ar = language === 'ar';
  if (isPending) return <span className="h-11 w-11 shrink-0 rounded-full bg-soft dark:bg-night-soft" aria-hidden="true" />;
  const base = 'flex h-11 shrink-0 items-center justify-center rounded-full border border-hairline text-xs font-bold cursor-pointer transition-colors hover:border-ink dark:border-night-line dark:hover:border-white';
  if (userId) {
    const initial = String(Array.from(displayName.trim())[0] ?? '•').toUpperCase();
    return <button type="button" onClick={onOpen} aria-label={ar ? `الحساب: ${displayName}` : `Account: ${displayName}`} title={displayName} className={`${base} w-11 bg-ink text-white dark:bg-white dark:text-ink`}>{initial}</button>;
  }
  return <button type="button" onClick={onOpen} className={`${base} gap-1.5 bg-soft px-3 text-ink dark:bg-night-soft dark:text-stone-200`}><LogIn className="h-3.5 w-3.5 text-coral-deep dark:text-coral" aria-hidden="true" /><span>{ar ? 'دخول' : 'Sign in'}</span></button>;
}
