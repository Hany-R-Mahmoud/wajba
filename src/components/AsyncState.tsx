import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import type { Language } from '../types';

/** Loading line: announced politely, with a spinner that stops under reduced motion. */
export function LoadingState({ language, label }: { language: Language; label?: string }) {
  const text = label ?? (language === 'ar' ? 'جارٍ التحميل…' : 'Loading…');
  return (
    <p role="status" className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
      <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      <span>{text}</span>
    </p>
  );
}

/** Error line with an optional retry button; announced as an alert. */
export function ErrorState({ language, message, onRetry }: { language: Language; message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100">
      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1">{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-current px-3 text-xs font-bold">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{language === 'ar' ? 'حاول مجدداً' : 'Try again'}</span>
        </button>
      )}
    </div>
  );
}

interface BoundaryProps { children: ReactNode; language?: Language; onError?: (error: Error, info: ErrorInfo) => void }
interface BoundaryState { error: Error | null }

/**
 * Catches render errors so one broken view does not blank the whole app.
 * Local data is untouched; the user can retry the view or reload.
 */
export class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  // `@types/react` is not installed in this repo, so React's base-class members are
  // declared here to keep `tsc` strict about the ones used below.
  declare props: Readonly<BoundaryProps>;
  declare setState: (state: BoundaryState) => void;
  state: BoundaryState = { error: null };
  static getDerivedStateFromError(error: Error): BoundaryState { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { this.props.onError?.(error, info); }
  reset = () => this.setState({ error: null });
  render() {
    if (!this.state.error) return this.props.children;
    const ar = (this.props.language ?? (document.documentElement.lang === 'ar' ? 'ar' : 'en')) === 'ar';
    return (
      <div role="alert" className="mx-auto my-10 max-w-md space-y-3 rounded-3xl border border-rose-300 bg-rose-50 p-6 text-center text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100">
        <AlertTriangle className="mx-auto h-8 w-8" aria-hidden="true" />
        <h2 className="text-lg font-bold">{ar ? 'حدث خطأ غير متوقع' : 'Something went wrong'}</h2>
        <p className="text-sm">{ar ? 'بياناتك المحلية محفوظة. حاول مرة أخرى أو أعد تحميل الصفحة.' : 'Your local data is safe. Try again or reload the page.'}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={this.reset} className="min-h-11 rounded-xl border border-current px-4 text-xs font-bold">{ar ? 'حاول مجدداً' : 'Try again'}</button>
          <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-xl bg-[#17171c] px-4 text-xs font-bold text-white dark:bg-white dark:text-[#17171c]">{ar ? 'إعادة التحميل' : 'Reload'}</button>
        </div>
      </div>
    );
  }
}
