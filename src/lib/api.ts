/**
 * Small fetch wrapper for Wajba's own `/api/*` endpoints.
 *
 * - every call has a timeout (default 10 s) so the UI never waits forever;
 * - reads (and writes marked `idempotent`) retry once on network errors,
 *   timeouts and 5xx, with a short backoff;
 * - failures become an `ApiError` with a `kind` the UI can map to a message,
 *   so components never show raw server text.
 */

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'auth'
  | 'forbidden'
  | 'conflict'
  | 'rate-limit'
  | 'too-large'
  | 'unavailable'
  | 'server'
  | 'invalid'
  | 'client';

export class ApiError extends Error {
  constructor(
    public readonly kind: ApiErrorKind,
    public readonly status: number | null = null,
  ) {
    super(`API ${kind}${status ? ` (${status})` : ''}`);
    this.name = 'ApiError';
  }

  /** True when trying again later could succeed. */
  get retryable(): boolean {
    return ['network', 'timeout', 'unavailable', 'server', 'rate-limit'].includes(this.kind);
  }
}

export function kindFromStatus(status: number): ApiErrorKind {
  if (status === 401) return 'auth';
  if (status === 403) return 'forbidden';
  if (status === 409) return 'conflict';
  if (status === 413) return 'too-large';
  if (status === 429) return 'rate-limit';
  if (status === 503) return 'unavailable';
  if (status >= 500) return 'server';
  return 'client';
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT';
  /** Better Auth session token; sent as `Bearer session:<token>`. */
  token?: string;
  body?: unknown;
  timeoutMs?: number;
  /** Retries after the first attempt. Default: 1 for GET or `idempotent`, else 0. */
  retries?: number;
  /** Safe to repeat without a second effect (for example an upsert). */
  idempotent?: boolean;
  signal?: AbortSignal;
  /** Test seam. */
  fetchImpl?: typeof fetch;
  backoffMs?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function attempt<T>(url: string, options: ApiRequestOptions): Promise<T> {
  const { method = 'GET', token, body, timeoutMs = 10_000, signal, fetchImpl = fetch } = options;
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    const response = await fetchImpl(url, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer session:${token}` } : {}),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });
    if (!response.ok) throw new ApiError(kindFromStatus(response.status), response.status);
    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError('invalid', response.status);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (signal?.aborted && !timedOut) throw error; // caller cancelled: let it pass through
    throw new ApiError(timedOut ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

export async function apiRequest<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const retries = options.retries ?? (method === 'GET' || options.idempotent ? 1 : 0);
  let lastError: unknown;
  for (let tryNumber = 0; tryNumber <= retries; tryNumber++) {
    try {
      return await attempt<T>(url, options);
    } catch (error) {
      lastError = error;
      const retryable = error instanceof ApiError && error.retryable && error.kind !== 'rate-limit';
      if (!retryable || tryNumber === retries || options.signal?.aborted) break;
      await sleep((options.backoffMs ?? 400) * (tryNumber + 1));
    }
  }
  throw lastError;
}

/** Bilingual, user-safe text for an API failure. */
export function apiErrorMessage(error: unknown, ar: boolean): string {
  const kind = error instanceof ApiError ? error.kind : 'client';
  const table: Record<ApiErrorKind, [string, string]> = {
    network: ['No connection. Your local data is safe. Check the network and try again.', 'لا يوجد اتصال. بياناتك المحلية محفوظة. تحقق من الشبكة وحاول مجدداً.'],
    timeout: ['The server took too long to answer. Try again.', 'استغرق الخادم وقتاً طويلاً في الرد. حاول مجدداً.'],
    auth: ['Your session has expired. Sign in again.', 'انتهت الجلسة. سجل الدخول مجدداً.'],
    forbidden: ['You are not allowed to do this.', 'غير مسموح لك بهذا الإجراء.'],
    conflict: ['The shared plan changed. Refresh before publishing again.', 'تغير الجدول المشترك. حدّثه قبل النشر مرة أخرى.'],
    'rate-limit': ['Too many attempts. Try in 10 minutes.', 'محاولات كثيرة. حاول بعد ١٠ دقائق.'],
    'too-large': ['The backup is too large to save online.', 'النسخة الاحتياطية كبيرة جداً للحفظ على الإنترنت.'],
    unavailable: ['This service is not available right now. Your local data is safe.', 'الخدمة غير متاحة الآن. بياناتك المحلية محفوظة.'],
    server: ['Something went wrong on our side. Try again.', 'حدث خطأ من جانبنا. حاول مجدداً.'],
    invalid: ['The server sent an unexpected answer. Try again.', 'أرسل الخادم رداً غير متوقع. حاول مجدداً.'],
    client: ['Request failed. Check membership or invitation and try again.', 'تعذر الطلب. تحقق من العضوية أو الدعوة وحاول مجدداً.'],
  };
  return table[kind][ar ? 1 : 0];
}
