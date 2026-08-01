import React from 'react';
import { Eye } from 'lucide-react';
import { Language, MealSlot } from '../types';

export interface MealDisplayOption {
  key: MealSlot;
  labelAr: string;
  labelEn: string;
  icon: string;
}

interface MealDisplayControlsProps {
  language: Language;
  options: MealDisplayOption[];
  showAllMeals: boolean;
  selectedMealSlots: MealSlot[];
  onShowAllMealsChange: (showAll: boolean) => void;
  onToggleMealSlot: (slot: MealSlot) => void;
}

export const MealDisplayControls: React.FC<MealDisplayControlsProps> = ({
  language,
  options,
  showAllMeals,
  selectedMealSlots,
  onShowAllMealsChange,
  onToggleMealSlot,
}) => {
  const isArabic = language === 'ar';

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/70">
      <div className="flex items-center gap-2 text-xs font-black text-amber-950 dark:text-amber-100">
        <Eye className="h-4 w-4 text-amber-700 dark:text-amber-300" />
        <span>{isArabic ? 'عرض الوجبات' : 'Meal display'}</span>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-200">
        <input
          type="checkbox"
          checked={showAllMeals}
          onChange={(event) => onShowAllMealsChange(event.target.checked)}
          className="h-4 w-4 accent-amber-700"
        />
        <span>{isArabic ? 'عرض الوجبات الثلاث' : 'Show all 3 meals'}</span>
      </label>

      {!showAllMeals && (
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-2 border-s border-amber-200 ps-3 dark:border-stone-700"
          role="group"
          aria-label={isArabic ? 'اختر الوجبات الظاهرة' : 'Select visible meals'}
        >
          {options.map((option) => {
            const isSelected = selectedMealSlots.includes(option.key);
            const isOnlySelected = isSelected && selectedMealSlots.length === 1;

            return (
              <label
                key={option.key}
                className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-200"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isOnlySelected}
                  onChange={() => onToggleMealSlot(option.key)}
                  className="h-4 w-4 accent-amber-700 disabled:opacity-60"
                />
                <span>
                  {option.icon} {isArabic ? option.labelAr : option.labelEn}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
