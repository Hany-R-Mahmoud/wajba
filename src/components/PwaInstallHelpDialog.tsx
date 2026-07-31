import {useEffect, useState} from 'react';
import {Copy, ExternalLink, X} from 'lucide-react';
import type {Language} from '../types';
import {usePwa} from '../pwa/PwaContext';

type PwaInstallHelpDialogProps = Readonly<{language: Language; dark: boolean}>;

export function PwaInstallHelpDialog({language, dark}: PwaInstallHelpDialogProps) {
  const {helpOpen, closeHelp, platform, isLikelyWebView, androidIntentUrl, currentUrl, copyCurrentUrl, confirmInstalled} = usePwa();
  const [copied, setCopied] = useState(false);
  const isAr = language === 'ar';

  useEffect(() => {
    if (!helpOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeHelp(); };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = ''; };
  }, [closeHelp, helpOpen]);

  if (!helpOpen) return null;
  const copy = async () => { setCopied(await copyCurrentUrl()); window.setTimeout(() => setCopied(false), 2400); };
  const title = isAr ? 'تثبيت وجبة' : 'Install Wajba';
  const browserInstructions = platform === 'ios'
    ? (isAr ? 'في Safari اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية». إذا كنت داخل تطبيق آخر، افتح الرابط في Safari أولاً.' : 'In Safari, tap Share, then “Add to Home Screen”. If you are inside another app, open this link in Safari first.')
    : (isAr ? 'في Chrome أو المتصفح المتوافق، افتح قائمة المتصفح واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».' : 'In Chrome or a compatible browser, open the browser menu and choose “Install app” or “Add to Home screen”.');
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeHelp(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="pwa-install-title" dir={isAr ? 'rtl' : 'ltr'} className={`w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl ${dark ? 'border-white/15 bg-[#162032] text-white' : 'border-[#17171c]/15 bg-white text-[#17171c]'}`}>
        <div className="flex items-center justify-between border-b border-current/10 px-5 py-4"><h2 id="pwa-install-title" className="text-lg font-bold">{title}</h2><button type="button" onClick={closeHelp} aria-label={isAr ? 'إغلاق' : 'Close'} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-stone-500 hover:text-[#ff7759] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7759]"><X className="h-5 w-5" aria-hidden="true" /></button></div>
        <div className="max-h-[min(82dvh,38rem)] space-y-5 overflow-y-auto px-5 py-5">
          {isLikelyWebView && androidIntentUrl ? <a href={androidIntentUrl} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#ff7759] px-4 text-sm font-bold text-[#d86540] hover:bg-[#ff7759] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7759]"><ExternalLink className="h-4 w-4" aria-hidden="true" />{isAr ? 'محاولة الفتح في المتصفح' : 'Try opening in browser'}</a> : null}
          <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">{browserInstructions}</p>
          <div className="space-y-2"><label htmlFor="pwa-current-url" className="block text-xs font-bold text-[#d86540]">{isAr ? 'رابط وجبة' : 'Wajba link'}</label><textarea id="pwa-current-url" readOnly value={currentUrl} dir="ltr" rows={3} className="w-full resize-none rounded-xl border border-current/15 bg-transparent p-3 text-left text-xs leading-6 outline-none focus:border-[#ff7759]" /><button type="button" onClick={() => void copy()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-current/20 px-3 text-xs font-bold hover:border-[#ff7759] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7759]"><Copy className="h-4 w-4" aria-hidden="true" />{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy link')}</button><p className="text-xs leading-6 text-stone-600 dark:text-stone-300">{isAr ? 'إذا منع التطبيق فتح المتصفح أو النسخ، اضغط مطولاً على الرابط وحدد «نسخ»، ثم افتحه في Safari أو Chrome.' : 'If the host blocks browser launch or copying, press and hold the link, select “Copy”, then open it in Safari or Chrome.'}</p></div>
          <button type="button" onClick={confirmInstalled} className="min-h-11 text-xs font-semibold text-stone-600 underline decoration-[#ff7759] underline-offset-4 hover:text-[#d86540] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7759]">{isAr ? 'التطبيق مثبت بالفعل' : 'I already installed the app'}</button>
        </div>
      </section>
    </div>
  );
}
