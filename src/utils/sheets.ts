import { GroceryItem, IngredientAisle, WeeklyPlan } from '../types';
import { AISLE_LABELS, localizeRecipeSource } from './aggregator';

export interface SheetsSyncStatus {
  lastSync?: string;
  isSyncing: boolean;
  error?: string;
}

export function exportPlanAndGroceryToCSV(_plan: WeeklyPlan | null, groceryList: GroceryItem[], isArabic: boolean): string {
  const headers = isArabic
    ? ['القسم', 'اسم الصنف', 'الكمية', 'الوحدة', 'الوصفات التابعة']
    : ['Aisle Category', 'Item Name', 'Quantity', 'Unit', 'Recipe Sources'];

  const rows = groceryList.map((item) => [
    (AISLE_LABELS[item.aisle as IngredientAisle] ?? AISLE_LABELS.other)[isArabic ? 'ar' : 'en'],
    isArabic ? item.nameAr : item.nameEn,
    item.amount,
    isArabic ? item.unitAr : item.unitEn,
    item.recipeSources.map((src) => localizeRecipeSource(src, isArabic)).join(' | '),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

  return csvContent;
}

export function downloadCSV(filename: string, text: string) {
  const blob = new Blob(['\uFEFF' + text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Optional Google Sheets Sync via Apps Script Web App Endpoint.
 * Users can paste their Google Apps Script Web App URL to sync real-time plans.
 */
export async function syncPlanWithGoogleSheets(
  webAppUrl: string,
  plan: WeeklyPlan,
  groceryList: GroceryItem[]
): Promise<boolean> {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    throw new Error('Please provide a valid Google Apps Script URL');
  }

  const payload = {
    action: 'savePlan',
    plan,
    groceryList,
    updatedAt: new Date().toISOString(),
  };

  const response = await fetch(webAppUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return true;
}
