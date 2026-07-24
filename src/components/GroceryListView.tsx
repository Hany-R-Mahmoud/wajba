import React, { useState } from 'react';
import { GroceryItem, IngredientAisle, Language } from '../types';
import { AISLE_LABELS } from '../utils/aggregator';
import { ShoppingBag, CheckSquare, Square, Plus, Share2, Copy, Download, Printer, Trash2, CheckCircle2 } from 'lucide-react';
import { downloadCSV, exportPlanAndGroceryToCSV } from '../utils/sheets';

interface GroceryListViewProps {
  groceryList: GroceryItem[];
  language: Language;
  onToggleCheckItem: (itemId: string) => void;
  onAddCustomExtra: (extraItem: GroceryItem) => void;
  onRemoveCustomExtra: (itemId: string) => void;
  onClearChecked: () => void;
}

export const GroceryListView: React.FC<GroceryListViewProps> = ({
  groceryList,
  language,
  onToggleCheckItem,
  onAddCustomExtra,
  onRemoveCustomExtra,
  onClearChecked,
}) => {
  const isArabic = language === 'ar';

  const [extraName, setExtraName] = useState('');
  const [extraAmount, setExtraAmount] = useState(1);
  const [extraUnit, setExtraUnit] = useState('حبة');
  const [copiedText, setCopiedText] = useState(false);

  const totalCount = groceryList.length;
  const checkedCount = groceryList.filter((i) => i.isChecked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Group items by aisle
  const groupedByAisle: { [key in IngredientAisle]?: GroceryItem[] } = {};
  groceryList.forEach((item) => {
    const aisle = item.aisle || 'other';
    if (!groupedByAisle[aisle]) {
      groupedByAisle[aisle] = [];
    }
    groupedByAisle[aisle]!.push(item);
  });

  const handleAddExtraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraName.trim()) return;

    const newItem: GroceryItem = {
      id: `extra_${Date.now()}`,
      nameAr: extraName,
      nameEn: extraName,
      amount: extraAmount,
      unitAr: extraUnit,
      unitEn: extraUnit,
      aisle: 'other',
      isChecked: false,
      recipeSources: [isArabic ? 'إضافة شخصية' : 'Custom Add'],
      isCustomExtra: true,
    };

    onAddCustomExtra(newItem);
    setExtraName('');
  };

  const handleShareWhatsApp = () => {
    let text = isArabic
      ? `🛒 *قائمة تسوق المقادير لجدول الوجبات - وجبة Wajba*\n\n`
      : `🛒 *Grocery Checklist - Wajba Meal Planner*\n\n`;

    Object.entries(groupedByAisle).forEach(([aisleKey, items]) => {
      const labelInfo = AISLE_LABELS[aisleKey as IngredientAisle] || AISLE_LABELS.other;
      text += `${labelInfo.icon} *${isArabic ? labelInfo.ar : labelInfo.en}*:\n`;
      items?.forEach((item) => {
        const checkMark = item.isChecked ? '✅' : '▫️';
        text += `${checkMark} ${item.amount} ${isArabic ? item.unitAr : item.unitEn} ${isArabic ? item.nameAr : item.nameEn}\n`;
      });
      text += `\n`;
    });

    text += isArabic ? `تم إنشاؤها عبر تطبيق وجبة 🍽️` : `Generated via Wajba App 🍽️`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyText = () => {
    let text = isArabic ? `🛒 قائمة تسوق المقادير - وجبة:\n\n` : `🛒 Grocery Checklist - Wajba:\n\n`;
    groceryList.forEach((item) => {
      text += `[${item.isChecked ? 'X' : ' '}] ${item.amount} ${isArabic ? item.unitAr : item.unitEn} - ${isArabic ? item.nameAr : item.nameEn}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csvStr = exportPlanAndGroceryToCSV({} as any, groceryList, isArabic);
    downloadCSV('wajba_grocery_list.csv', csvStr);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Progress Bar */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-amber-200/80 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-amber-950 dark:text-amber-100">
                {isArabic ? 'قائمة التسوق الذكية المجمعة' : 'Smart Aggregated Grocery List'}
              </h1>
              <p className="text-xs text-stone-500">
                {isArabic
                  ? 'تم دمج وتجميع كافة مقادير الوجبات المحددة في الجدول حسب أقسام السوبرماركت.'
                  : 'All ingredients from your week plan combined and organized by supermarket aisles.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إرسال بالواتساب' : 'WhatsApp'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5"
            >
              {copiedText ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ نصي' : 'Copy')}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold"
              title={isArabic ? 'تصدير CSV' : 'Export CSV'}
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold"
              title={isArabic ? 'طباعة القائمة' : 'Print List'}
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Purchase Progress */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-stone-700 dark:text-stone-300">
            <span>
              {isArabic
                ? `تقدم التسوق: تم شراء ${checkedCount} من إجمالي ${totalCount} عنصر`
                : `Shopping Progress: ${checkedCount} of ${totalCount} items completed`}
            </span>
            <span className="font-mono text-amber-800 dark:text-amber-400">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden p-0.5 border border-stone-200/60 dark:border-stone-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 to-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Extra Item Form */}
      <form
        onSubmit={handleAddExtraSubmit}
        className="bg-amber-50/80 dark:bg-stone-800/60 p-4 rounded-2xl border border-amber-200/60 dark:border-stone-700 flex flex-wrap items-center gap-3 no-print"
      >
        <span className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1">
          <Plus className="w-4 h-4 text-amber-700" />
          {isArabic ? 'إضافة عنصر إضافي:' : 'Add Extra Item:'}
        </span>

        <input
          type="text"
          value={extraName}
          onChange={(e) => setExtraName(e.target.value)}
          placeholder={isArabic ? 'مثال: مناديل ورقية، صابون أطباق...' : 'e.g. Paper towels, dish soap'}
          className="flex-1 min-w-[180px] p-2 text-xs rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-semibold"
        />

        <input
          type="number"
          value={extraAmount}
          onChange={(e) => setExtraAmount(Number(e.target.value))}
          className="w-16 p-2 text-xs rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold font-mono text-center"
        />

        <input
          type="text"
          value={extraUnit}
          onChange={(e) => setExtraUnit(e.target.value)}
          placeholder="الوحدة"
          className="w-20 p-2 text-xs rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-semibold"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold"
        >
          {isArabic ? 'إضافة' : 'Add'}
        </button>
      </form>

      {/* Aisle Grouped Grocery Sections */}
      {groceryList.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-amber-200/80 dark:border-stone-800 p-8 space-y-3">
          <div className="text-4xl">🛒</div>
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            {isArabic ? 'قائمة التسوق فارغة حالياً' : 'Your grocery checklist is empty'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isArabic
              ? 'قم بإضافة وجبات إلى جدول الأسبوع لتوليد مقادير التسوق تلقائياً.'
              : 'Add meals to your weekly planner to generate your shopping list automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(Object.keys(groupedByAisle) as IngredientAisle[]).map((aisleKey) => {
            const items = groupedByAisle[aisleKey] || [];
            if (items.length === 0) return null;

            const labelInfo = AISLE_LABELS[aisleKey] || AISLE_LABELS.other;

            return (
              <div
                key={aisleKey}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-amber-200/80 dark:border-stone-800 overflow-hidden shadow-xs"
              >
                {/* Aisle Header */}
                <div className="bg-amber-50/80 dark:bg-stone-800/80 px-4 py-2.5 border-b border-amber-200/60 dark:border-stone-700 flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-2">
                    <span className="text-base">{labelInfo.icon}</span>
                    <span>{isArabic ? labelInfo.ar : labelInfo.en}</span>
                  </h3>
                  <span className="text-[11px] font-bold text-stone-500">
                    {items.length} {isArabic ? 'عنصر' : 'items'}
                  </span>
                </div>

                {/* Aisle Checklist Items */}
                <div className="divide-y divide-stone-100 dark:divide-stone-800/80 p-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onToggleCheckItem(item.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer select-none ${
                        item.isChecked
                          ? 'bg-stone-100/60 dark:bg-stone-800/40 text-stone-400 line-through'
                          : 'hover:bg-amber-50/60 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-amber-700 dark:text-amber-400">
                          {item.isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                          ) : (
                            <Square className="w-5 h-5 text-stone-400" />
                          )}
                        </button>
                        <div>
                          <p className="text-xs font-bold">
                            {isArabic ? item.nameAr : item.nameEn}
                          </p>
                          {item.recipeSources.length > 0 && (
                            <p className="text-[10px] text-stone-400 truncate max-w-xs">
                              {isArabic ? 'من: ' : 'From: '} {item.recipeSources.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold font-mono text-amber-900 dark:text-amber-300">
                          {item.amount} {isArabic ? item.unitAr : item.unitEn}
                        </span>

                        {item.isCustomExtra && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveCustomExtra(item.id);
                            }}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
