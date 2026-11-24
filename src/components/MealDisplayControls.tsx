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
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-hairline/80 bg-soft/70 px-4 py-3 dark:border-night-line dark:bg-night-card/70">
      <div className="flex items-center gap-2 text-xs font-black text-ink dark:text-stone-100">
        <Eye className="h-4 w-4 text-coral-deep dark:text-coral" />
        <span>{isArabic ? 'عرض الوجبات' : 'Meal display'}</span>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-200">
        <input
          type="checkbox"
          checked={showAllMeals}
          onChange={(event) => onShowAllMealsChange(event.target.checked)}
          className="h-4 w-4 accent-coral-deep"
        />
        <span>{isArabic ? 'عرض الوجبات الثلاث' : 'Show all 3 meals'}</span>
      </label>

      {!showAllMeals && (
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-2 border-s border-hairline ps-3 dark:border-night-line"
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
                  className="h-4 w-4 accent-coral-deep disabled:opacity-60"
                />
                <span>
                  {isArabic ? option.labelAr : option.labelEn}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
