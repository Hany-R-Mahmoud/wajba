import {Download, ExternalLink, X} from 'lucide-react';
import type {Language} from '../types';
import {usePwa} from '../pwa/PwaContext';

type PwaStatusBarProps = Readonly<{language: Language; dark: boolean}>;

export function PwaStatusBar({language, dark}: PwaStatusBarProps) {
  const {showPromotion, isLikelyWebView, platform, canInstall, install, openHelp, dismissPromotion} = usePwa();
  if (!showPromotion) return null;
  const isAr = language === 'ar';
  const title = isLikelyWebView
    ? (isAr ? 'افتح وجبة في المتصفح للتثبيت' : 'Open Wajba in your browser to install')
    : platform === 'ios'
      ? (isAr ? 'أضف وجبة إلى الشاشة الرئيسية' : 'Add Wajba to your Home Screen')
      : (isAr ? 'ثبّت وجبة للوصول السريع' : 'Install Wajba for quick access');
  return (
    <div role="status" dir={isAr ? 'rtl' : 'ltr'} className={`relative z-30 mx-3 my-3 flex items-center gap-3 rounded-2xl border px-3 py-2.5 shadow-lg md:mx-auto md:max-w-3xl ${dark ? 'border-[#ff7759]/35 bg-[#162032]/95 text-white' : 'border-[#d86540]/25 bg-white/95 text-[#17171c]'}`}>
      <Download className="h-5 w-5 shrink-0 text-[#ff7759]" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-xs font-semibold leading-relaxed sm:text-sm">{title}</p>
      <button type="button" onClick={() => canInstall ? void install() : openHelp()} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-[#ff7759] px-3 text-xs font-bold text-[#d86540] transition hover:bg-[#ff7759] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7759]">
        {isLikelyWebView ? <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {isAr ? (isLikelyWebView ? 'فتح' : 'تثبيت') : (isLikelyWebView ? 'OPEN' : 'INSTALL')}
      </button>
      <button type="button" onClick={dismissPromotion} aria-label={isAr ? 'إخفاء إشعار التثبيت' : 'Dismiss installation notice'} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-stone-500 transition hover:text-[#ff7759] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7759]"><X className="h-4 w-4" aria-hidden="true" /></button>
    </div>
  );
}
