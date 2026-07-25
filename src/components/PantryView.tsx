import React, { useState } from 'react';
import { Check, Pencil, Plus, Trash2, Warehouse, X } from 'lucide-react';
import type { IngredientAisle, Language, PantryItem } from '../types';
import { AISLE_LABELS } from '../utils/aggregator';

interface PantryViewProps {
  items: PantryItem[];
  language: Language;
  onUpdateItems: (items: PantryItem[]) => void;
}

const AISLE_OPTIONS: IngredientAisle[] = ['produce', 'meat', 'dairy', 'pantry', 'bakery', 'frozen', 'other'];

export const PantryView: React.FC<PantryViewProps> = ({ items, language, onUpdateItems }) => {
  const isArabic = language === 'ar';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [amount, setAmount] = useState('');
  const [unitAr, setUnitAr] = useState('');
  const [unitEn, setUnitEn] = useState('');
  const [aisle, setAisle] = useState<IngredientAisle>('pantry');
  const [error, setError] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setNameAr('');
    setNameEn('');
    setAmount('');
    setUnitAr('');
    setUnitEn('');
    setAisle('pantry');
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!nameAr.trim() || !nameEn.trim() || !unitEn.trim() || !unitAr.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError(isArabic ? 'أكمل الاسم والوحدة وأدخل كمية أكبر من صفر.' : 'Enter both names, both units, and an amount greater than zero.');
      return;
    }

    const nextItem: PantryItem = {
      id: editingId ?? `pantry_${Date.now()}`,
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      amount: parsedAmount,
      unitAr: unitAr.trim(),
      unitEn: unitEn.trim(),
      aisle,
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      onUpdateItems(items.map((item) => (item.id === editingId ? nextItem : item)));
    } else {
      const duplicate = items.find((item) => item.nameEn.trim().toLowerCase() === nextItem.nameEn.toLowerCase() && item.unitEn.trim().toLowerCase() === nextItem.unitEn.toLowerCase());
      onUpdateItems(duplicate
        ? items.map((item) => item.id === duplicate.id ? { ...item, amount: item.amount + nextItem.amount, updatedAt: nextItem.updatedAt } : item)
        : [nextItem, ...items]);
    }
    resetForm();
  };

  const handleEdit = (item: PantryItem) => {
    setEditingId(item.id);
    setNameAr(item.nameAr);
    setNameEn(item.nameEn);
    setAmount(String(item.amount));
    setUnitAr(item.unitAr);
    setUnitEn(item.unitEn);
    setAisle(item.aisle);
    setError('');
  };

  const handleDelete = (item: PantryItem) => {
    if (!window.confirm(isArabic ? `حذف ${item.nameAr} من المخزن؟` : `Remove ${item.nameEn} from the pantry?`)) return;
    onUpdateItems(items.filter((candidate) => candidate.id !== item.id));
    if (editingId === item.id) resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#17171c] p-6 text-white shadow-xs dark:bg-[#162032]">
        <div className="flex items-start gap-3">
          <Warehouse className="mt-1 h-6 w-6 text-[#ff7759]" aria-hidden="true" />
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-stone-300">{isArabic ? 'مخزن المنزل' : 'Home Pantry'}</p>
            <h1 className="mt-1 text-2xl font-bold">{isArabic ? 'اعرف ما لديك قبل التسوق' : 'Know what you have before you shop'}</h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-300">{isArabic ? 'تخصم وجبة كميات المخزن من قائمة التسوق تلقائياً. لا يتم استهلاك المخزون عند وضع علامة الشراء.' : 'Wajba subtracts pantry quantities from your grocery list. Checking a grocery item never consumes pantry stock.'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-[#d9d9dd] bg-white p-5 shadow-xs dark:border-[#2b3a54] dark:bg-[#162032]" aria-labelledby="pantry-form-title">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="pantry-form-title" className="text-lg font-bold">{editingId ? (isArabic ? 'تعديل عنصر' : 'Edit item') : (isArabic ? 'إضافة إلى المخزن' : 'Add pantry item')}</h2>
          {editingId && <button type="button" onClick={resetForm} className="flex items-center gap-1 text-xs font-bold text-stone-500"><X className="h-4 w-4" />{isArabic ? 'إلغاء' : 'Cancel'}</button>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-bold">{isArabic ? 'الاسم بالعربية' : 'Arabic name'}<input value={nameAr} onChange={(event) => setNameAr(event.target.value)} className="mt-1 w-full rounded-xl border border-[#d9d9dd] bg-[#eeece7] p-2.5 text-sm dark:border-[#2b3a54] dark:bg-stone-800" /></label>
          <label className="text-sm font-bold">{isArabic ? 'الاسم بالإنجليزية' : 'English name'}<input value={nameEn} onChange={(event) => setNameEn(event.target.value)} className="mt-1 w-full rounded-xl border border-[#d9d9dd] bg-[#eeece7] p-2.5 text-sm dark:border-[#2b3a54] dark:bg-stone-800" /></label>
          <label className="text-sm font-bold">{isArabic ? 'الكمية' : 'Amount'}<input type="number" min="0.1" step="0.1" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1 w-full rounded-xl border border-[#d9d9dd] bg-[#eeece7] p-2.5 text-sm dark:border-[#2b3a54] dark:bg-stone-800" /></label>
          <label className="text-sm font-bold">{isArabic ? 'الوحدة بالعربية' : 'Arabic unit'}<input value={unitAr} onChange={(event) => setUnitAr(event.target.value)} placeholder={isArabic ? 'جرام' : 'grams'} className="mt-1 w-full rounded-xl border border-[#d9d9dd] bg-[#eeece7] p-2.5 text-sm dark:border-[#2b3a54] dark:bg-stone-800" /></label>
          <label className="text-sm font-bold">{isArabic ? 'الوحدة بالإنجليزية' : 'English unit'}<input value={unitEn} onChange={(event) => setUnitEn(event.target.value)} placeholder="g" className="mt-1 w-full rounded-xl border border-[#d9d9dd] bg-[#eeece7] p-2.5 text-sm dark:border-[#2b3a54] dark:bg-stone-800" /></label>
          <label className="text-sm font-bold">{isArabic ? 'القسم' : 'Aisle'}<select value={aisle} onChange={(event) => setAisle(AISLE_OPTIONS.find((option) => option === event.target.value) ?? 'other')} className="mt-1 w-full rounded-xl border border-[#d9d9dd] bg-[#eeece7] p-2.5 text-sm dark:border-[#2b3a54] dark:bg-stone-800">{AISLE_OPTIONS.map((option) => <option key={option} value={option}>{isArabic ? AISLE_LABELS[option].ar : AISLE_LABELS[option].en}</option>)}</select></label>
        </div>
        {error && <p role="alert" className="mt-3 text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>}
        <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#17171c] px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-[#17171c]"><Plus className="h-4 w-4 text-[#ff7759]" />{editingId ? (isArabic ? 'حفظ التعديل' : 'Save changes') : (isArabic ? 'إضافة عنصر' : 'Add item')}</button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#d9d9dd] p-10 text-center dark:border-[#2b3a54]"><Warehouse className="mx-auto h-8 w-8 text-stone-400" /><p className="mt-3 font-bold">{isArabic ? 'المخزن فارغ' : 'Your pantry is empty'}</p><p className="mt-1 text-sm text-stone-500">{isArabic ? 'أضف المكونات الموجودة لديك لتقليل قائمة التسوق.' : 'Add ingredients you already have to reduce your shopping list.'}</p></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.id} className="rounded-2xl border border-[#d9d9dd] bg-white p-4 dark:border-[#2b3a54] dark:bg-[#162032]"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{isArabic ? item.nameAr : item.nameEn}</h3><p className="mt-1 text-sm text-stone-500">{item.amount} {isArabic ? item.unitAr : item.unitEn}</p><p className="mt-2 text-xs text-stone-400">{isArabic ? AISLE_LABELS[item.aisle].ar : AISLE_LABELS[item.aisle].en}</p></div><div className="flex gap-1"><button type="button" onClick={() => handleEdit(item)} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800" aria-label={isArabic ? 'تعديل' : 'Edit'}><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => handleDelete(item)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950" aria-label={isArabic ? 'حذف' : 'Delete'}><Trash2 className="h-4 w-4" /></button></div></div></article>)}</div>
      )}
      <p className="flex items-center gap-2 text-xs text-stone-500"><Check className="h-4 w-4 text-emerald-600" />{isArabic ? 'المطابقة تعتمد على الاسم والوحدة المتوافقة.' : 'Matching uses the ingredient name and compatible units.'}</p>
    </div>
  );
};
