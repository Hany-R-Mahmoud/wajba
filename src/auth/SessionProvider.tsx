import { createContext, useContext, type ReactNode } from 'react';
import { authClient } from './client';

export interface AppSession {
  userId: string | null;
  displayName: string;
  /** Better Auth session token for `/api/*` calls; null when signed out. */
  token: string | null;
  isPending: boolean;
  hasError: boolean;
}

const signedOut: AppSession = { userId: null, displayName: '', token: null, isPending: false, hasError: false };
const SessionContext = createContext<AppSession>(signedOut);

/**
 * One `useSession` subscription for the whole app. Components read it with
 * `useAppSession()` instead of each opening their own session request.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const { data, isPending, error } = authClient.useSession();
  const value: AppSession = {
    userId: data?.user?.id ?? null,
    displayName: data?.user?.name || data?.user?.email || '',
    token: data?.session?.token ?? null,
    isPending,
    hasError: Boolean(error),
  };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useAppSession = () => useContext(SessionContext);
