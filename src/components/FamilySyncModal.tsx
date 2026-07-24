import React, { useState } from 'react';
import { Language, WeeklyPlan, GroceryItem } from '../types';
import { X, Users, Share2, Copy, Check, FileSpreadsheet, Download, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { encodePlanToUrl } from '../utils/storage';
import { syncPlanWithGoogleSheets, downloadCSV, exportPlanAndGroceryToCSV } from '../utils/sheets';

interface FamilySyncModalProps {
  plan: WeeklyPlan;
  groceryList: GroceryItem[];
  onClose: () => void;
  language: Language;
  onImportPlan: (plan: WeeklyPlan) => void;
}

export const FamilySyncModal: React.FC<FamilySyncModalProps> = ({
  plan,
  groceryList,
  onClose,
  language,
  onImportPlan,
}) => {
  const isArabic = language === 'ar';

  const [copiedLink, setCopiedLink] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const sharedUrl = encodePlanToUrl(plan);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSyncSheets = async () => {
    if (!sheetsUrl.trim()) return;
    setSyncing(true);
    setSyncMessage(null);
    try {
      await syncPlanWithGoogleSheets(sheetsUrl, plan, groceryList);
      setSyncMessage(isArabic ? 'تمت المزامنة بنجاح مع جدول Google Sheets!' : 'Synced successfully with Google Sheets!');
    } catch (err: any) {
      setSyncMessage(err.message || 'Failed to sync');
    } finally {
      setSyncing(false);
    }
  };

  const handleDownloadCSV = () => {
    const csvData = exportPlanAndGroceryToCSV(plan, groceryList, isArabic);
    downloadCSV('wajba_family_plan.csv', csvData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-200/80 dark:border-stone-800 p-6 my-8 text-stone-800 dark:text-stone-100 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-extrabold text-amber-950 dark:text-amber-100">
              {isArabic ? 'المشاركة العائلية والمزامنة السحابية' : 'Family Share & Cloud Sync'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Link Sharing Option */}
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 space-y-2">
          <h3 className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-amber-700" />
            <span>{isArabic ? 'رابط الخطة المباشر للعائلة:' : 'Direct Family Share URL:'}</span>
          </h3>
          <p className="text-[11px] text-stone-600 dark:text-stone-400">
            {isArabic
              ? 'شارك هذا الرابط المباشر مع أفراد العائلة أو الشريك في المنزل لفتح نفس الجدول وقائمة التسوق فوراً بدون تسجيل دخول.'
              : 'Share this live link with family members to open the exact meal plan & grocery list instantly.'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              readOnly
              type="text"
              value={sharedUrl}
              className="flex-1 p-2 text-xs rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-stone-500 select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الرابط' : 'Copy Link')}</span>
            </button>
          </div>
        </div>

        {/* Google Sheets Remote Sync Option */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2">
          <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{isArabic ? 'مزامنة Google Sheets (اختياري):' : 'Google Sheets Sync (Optional):'}</span>
          </h3>
          <p className="text-[11px] text-stone-500">
            {isArabic
              ? 'يمكنك ربط تطبيق وجبة برابط تطبيق Google Apps Script الخاص بك لمزامنة الجدول مجاناً بدون خادم.'
              : 'Optionally connect a Google Apps Script URL for free lightweight remote sheet synchronization.'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="url"
              value={sheetsUrl}
              onChange={(e) => setSheetsUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="flex-1 p-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono"
            />
            <button
              disabled={syncing}
              onClick={handleSyncSheets}
              className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 flex-shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{isArabic ? 'مزامنة' : 'Sync'}</span>
            </button>
          </div>

          {syncMessage && (
            <p className="text-[11px] font-bold text-emerald-600 pt-1">{syncMessage}</p>
          )}
        </div>

        {/* JSON Backup & Export Option */}
        <div className="p-4 rounded-2xl bg-amber-100/60 dark:bg-stone-800/60 border border-amber-300 dark:border-stone-700 space-y-2">
          <h3 className="text-xs font-bold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-amber-700" />
            <span>{isArabic ? 'تصدير نسخة احتياطية لكافة بيانات التطبيق (JSON):' : 'Export Full Data Backup (JSON):'}</span>
          </h3>
          <p className="text-[11px] text-stone-600 dark:text-stone-400">
            {isArabic
              ? 'تنزيل نسخة احتياطية شاملة لجميع الجداول الأسبوعية والشهرية، وقوائم التسوق، والوصفات المحفوظة.'
              : 'Download a complete JSON backup of all weekly/monthly meal plans, grocery lists, and saved recipes.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                const fullBackup = {
                  weeklyPlan: plan,
                  groceryList,
                  exportedAt: new Date().toISOString(),
                  app: 'Wajba Meal Planner',
                };
                const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `wajba_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تحميل النسخة الاحتياطية (JSON)' : 'Download JSON Backup'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-300 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isArabic ? 'تحميل جدول CSV' : 'Export CSV File'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
