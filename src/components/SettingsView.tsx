import React, { useRef, useState } from 'react';
import { AlertTriangle, Download, FileUp, Moon, ShieldCheck, Sun, Trash2 } from 'lucide-react';
import type { Language, WajbaBackup } from '../types';
import { createCurrentWajbaBackup, parseWajbaBackup } from '../utils/storage';

interface SettingsViewProps {
  language: Language;
  theme: 'light' | 'dark';
  onLanguageChange: (language: Language) => void;
  onThemeToggle: () => void;
  onImportBackup: (backup: WajbaBackup) => void;
  onClearUserData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ language, theme, onLanguageChange, onThemeToggle, onImportBackup, onClearUserData }) => {
  const isArabic = language === 'ar';
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(createCurrentWajbaBackup(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wajba_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: isArabic ? 'تم تصدير النسخة الاحتياطية.' : 'Backup exported.' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : (isArabic ? 'تعذر التصدير.' : 'Export failed.') });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const backup = parseWajbaBackup(parsed);
      if (!backup) {
        setMessage({ type: 'error', text: isArabic ? 'ملف النسخة الاحتياطية غير صالح.' : 'This backup file is invalid.' });
      } else if (window.confirm(isArabic ? 'سيتم استبدال البيانات المحلية الحالية. هل تريد المتابعة؟' : 'This will replace the current local data. Continue?')) {
        onImportBackup(backup);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof SyntaxError ? (isArabic ? 'ملف JSON غير صالح.' : 'The file is not valid JSON.') : (isArabic ? 'تعذر قراءة الملف.' : 'Could not read the file.') });
    } finally {
      event.target.value = '';
    }
  };

  const handleClear = () => {
    if (window.confirm(isArabic ? 'سيتم حذف كل بيانات وجبة المحلية واستعادة البيانات التجريبية. هل أنت متأكد؟' : 'Delete all local Wajba data and restore seeded defaults?')) onClearUserData();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div><p className="text-xs font-mono uppercase tracking-wider text-[#ff7759]">{isArabic ? 'الإعدادات والبيانات' : 'Settings & data'}</p><h1 className="mt-1 text-3xl font-bold">{isArabic ? 'تحكم في تجربة وجبة' : 'Control your Wajba experience'}</h1></div>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-[#d9d9dd] bg-white p-5 dark:border-[#2b3a54] dark:bg-[#162032]"><h2 className="font-bold">{isArabic ? 'اللغة' : 'Language'}</h2><div className="mt-3 flex gap-2"><button type="button" aria-pressed={isArabic} onClick={() => onLanguageChange('ar')} className={`rounded-xl px-4 py-2 text-sm font-bold ${isArabic ? 'bg-[#17171c] text-white' : 'bg-[#eeece7] dark:bg-stone-800'}`}>العربية</button><button type="button" aria-pressed={!isArabic} onClick={() => onLanguageChange('en')} className={`rounded-xl px-4 py-2 text-sm font-bold ${!isArabic ? 'bg-[#17171c] text-white' : 'bg-[#eeece7] dark:bg-stone-800'}`}>English</button></div></div>
        <div className="rounded-3xl border border-[#d9d9dd] bg-white p-5 dark:border-[#2b3a54] dark:bg-[#162032]"><h2 className="font-bold">{isArabic ? 'المظهر' : 'Theme'}</h2><button type="button" onClick={onThemeToggle} className="mt-3 flex items-center gap-2 rounded-xl bg-[#eeece7] px-4 py-2 text-sm font-bold dark:bg-stone-800">{theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}{theme === 'light' ? (isArabic ? 'تفعيل الوضع الداكن' : 'Use dark mode') : (isArabic ? 'تفعيل الوضع الفاتح' : 'Use light mode')}</button></div>
      </section>
      <section className="rounded-3xl border border-[#d9d9dd] bg-white p-5 dark:border-[#2b3a54] dark:bg-[#162032]"><div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-5 w-5 text-emerald-600" /><div><h2 className="font-bold">{isArabic ? 'بياناتك محلية' : 'Your data stays local'}</h2><p className="mt-1 text-sm text-stone-500">{isArabic ? 'وجبة تحفظ خططك ووصفاتك والمخزن في هذا المتصفح فقط. لا يوجد حساب أو خادم مطلوب.' : 'Wajba stores plans, recipes, and pantry data in this browser. No account or server is required.'}</p></div></div></section>
      <section className="rounded-3xl border border-[#d9d9dd] bg-white p-5 dark:border-[#2b3a54] dark:bg-[#162032]"><h2 className="font-bold">{isArabic ? 'النسخ الاحتياطي والاستعادة' : 'Backup and restore'}</h2><p className="mt-1 text-sm text-stone-500">{isArabic ? 'يتضمن الملف كل البيانات المحلية الدائمة، ويستبدل البيانات الحالية بعد التأكيد.' : 'The file contains durable local data and replaces current data after confirmation.'}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl bg-[#17171c] px-4 py-2.5 text-sm font-bold text-white"><Download className="h-4 w-4 text-[#ff7759]" />{isArabic ? 'تصدير JSON' : 'Export JSON'}</button><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-[#eeece7] px-4 py-2.5 text-sm font-bold dark:bg-stone-800"><FileUp className="h-4 w-4" />{isArabic ? 'استعادة JSON' : 'Restore JSON'}</button><input ref={inputRef} type="file" accept="application/json,.json" onChange={handleImport} className="hidden" /></div>{message && <p role={message.type === 'error' ? 'alert' : 'status'} className={`mt-3 text-sm font-bold ${message.type === 'error' ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{message.text}</p>}</section>
      <section className="rounded-3xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/40"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 h-5 w-5 text-rose-700 dark:text-rose-300" /><div><h2 className="font-bold text-rose-900 dark:text-rose-100">{isArabic ? 'حذف البيانات المحلية' : 'Clear local data'}</h2><p className="mt-1 text-sm text-rose-800 dark:text-rose-200">{isArabic ? 'يحذف الخطط والوصفات الخاصة والمفضلة والمخزن ويعيد بيانات البداية.' : 'Deletes plans, custom recipes, favorites, pantry data, and restores seeded defaults.'}</p><button type="button" onClick={handleClear} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white"><Trash2 className="h-4 w-4" />{isArabic ? 'حذف كل البيانات المحلية' : 'Clear all local data'}</button></div></div></section>
    </div>
  );
};
