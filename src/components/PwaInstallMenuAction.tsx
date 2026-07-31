import {Download} from 'lucide-react';
import type {Language} from '../types';
import {usePwa} from '../pwa/PwaContext';

type PwaInstallMenuActionProps = Readonly<{language: Language; dark: boolean}>;

export function PwaInstallMenuAction({language, dark}: PwaInstallMenuActionProps) {
  const {isStandalone, installedHint, canInstall, install, openHelp} = usePwa();
  if (isStandalone || installedHint) return null;
  const isAr = language === 'ar';
  const label = isAr ? 'تثبيت وجبة' : 'INSTALL WAJBA';
  return (
    <button
      type="button"
      onClick={() => canInstall ? void install() : openHelp()}
      aria-label={label}
      title={label}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 text-[10px] font-bold tracking-[0.08em] transition-colors cursor-pointer ${dark ? 'border-[#ff7759]/70 text-[#ffb09e] hover:bg-[#ff7759]/10' : 'border-[#d86540]/70 text-[#b3482b] hover:bg-[#ff7759]/10'}`}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
