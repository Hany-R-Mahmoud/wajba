import React, { useState } from 'react';
import { DayPlanner, Language, MealSlot, Recipe, WeeklyPlan } from '../types';
import { Calendar, Moon, Sun, Trash2, Plus, Sparkles, Share2, ShoppingBag, Utensils, RefreshCw } from 'lucide-react';

interface WeeklyPlannerViewProps {
  plan: WeeklyPlan;
  onUpdatePlan: (plan: WeeklyPlan) => void;
  recipes: Recipe[];
  language: Language;
  onGoToGrocery: () => void;
  onOpenRecipeDetail: (recipe: Recipe) => void;
  onOpenFamilySync: () => void;
  onOpenCreateRecipeModal?: () => void;
}

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  plan,
  onUpdatePlan,
  recipes,
  language,
  onGoToGrocery,
  onOpenRecipeDetail,
  onOpenFamilySync,
  onOpenCreateRecipeModal,
}) => {
  const isArabic = language === 'ar';

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string>('sat');
  const [activeSlotKey, setActiveSlotKey] = useState<MealSlot>('lunch');

  const recipeMap = new Map<string, Recipe>();
  recipes.forEach((r) => recipeMap.set(r.id, r));

  const slotsToDisplay: { key: MealSlot; labelAr: string; labelEn: string; icon: string }[] = plan.isRamadanMode
    ? [
        { key: 'suhoor', labelAr: 'وجبة السحور المبارك', labelEn: 'Suhoor Meal', icon: '🌙' },
        { key: 'iftar', labelAr: 'وجبة الإفطار الرئيسي', labelEn: 'Iftar Feast', icon: '🌅' },
        { key: 'dessert', labelAr: 'الحلويات الرمضانية', labelEn: 'Ramadan Desserts', icon: '🍰' },
      ]
    : [
        { key: 'breakfast', labelAr: 'الإفطار الصباحي', labelEn: 'Breakfast', icon: '🍳' },
        { key: 'lunch', labelAr: 'الغداء الرئيسي', labelEn: 'Main Lunch', icon: '🍲' },
        { key: 'dinner', labelAr: 'العشاء', labelEn: 'Dinner', icon: '🥪' },
      ];

  const toggleRamadanMode = () => {
    onUpdatePlan({
      ...plan,
      isRamadanMode: !plan.isRamadanMode,
    });
  };

  const handleOpenAssign = (dayId: string, slotKey: MealSlot) => {
    setActiveDayId(dayId);
    setActiveSlotKey(slotKey);
    setAssignModalOpen(true);
  };

  const handleSelectRecipeForSlot = (recipeId: string) => {
    const updatedDays = plan.days.map((day) => {
      if (day.dayId === activeDayId) {
        const recipe = recipeMap.get(recipeId);
        return {
          ...day,
          slots: {
            ...day.slots,
            [activeSlotKey]: {
              recipeId,
              servings: recipe?.servings || 4,
            },
          },
        };
      }
      return day;
    });

    onUpdatePlan({ ...plan, days: updatedDays });
    setAssignModalOpen(false);
  };

  const handleRemoveSlot = (dayId: string, slotKey: MealSlot) => {
    const updatedDays = plan.days.map((day) => {
      if (day.dayId === dayId) {
        const newSlots = { ...day.slots };
        delete newSlots[slotKey];
        return { ...day, slots: newSlots };
      }
      return day;
    });
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const handleClearWeek = () => {
    if (confirm(isArabic ? 'هل انت متأكد من تفريغ جدول الأسبوع؟' : 'Clear all meals in weekly planner?')) {
      const clearedDays = plan.days.map((d) => ({ ...d, slots: {} }));
      onUpdatePlan({ ...plan, days: clearedDays });
    }
  };

  const handleRandomizeArabPlan = () => {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    let idx = 0;

    const randomizedDays = plan.days.map((d) => {
      const newSlots: DayPlanner['slots'] = {};
      slotsToDisplay.forEach((slotInfo) => {
        if (shuffled[idx]) {
          newSlots[slotInfo.key] = {
            recipeId: shuffled[idx].id,
            servings: shuffled[idx].servings || 4,
          };
          idx = (idx + 1) % shuffled.length;
        }
      });
      return { ...d, slots: newSlots };
    });

    onUpdatePlan({ ...plan, days: randomizedDays });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls Bar */}
      <div className="bg-white dark:bg-[#162032] p-5 rounded-3xl border border-[#d9d9dd] dark:border-[#2b3a54] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-700" />
            <h1 className="text-2xl font-extrabold text-amber-950 dark:text-amber-100">
              {isArabic ? 'جدول الوجبات العائلي الأسبوعي' : 'Weekly Family Meal Planner'}
            </h1>
          </div>
          <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mt-1">
            {isArabic
              ? 'صمم وجبات الأسبوع وقم بتوليد قائمة التسوق التلقائية المجمعة فوراً.'
              : 'Assign meals across days and generate a combined smart grocery list instantly.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ramadan Mode Switcher */}
          <button
            onClick={toggleRamadanMode}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              plan.isRamadanMode
                ? 'bg-amber-900 text-amber-100 border-amber-700 dark:bg-amber-950'
                : 'bg-amber-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-200 dark:border-stone-700'
            }`}
          >
            {plan.isRamadanMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
            <span>{plan.isRamadanMode ? (isArabic ? 'وضع رمضان' : 'Ramadan Mode') : (isArabic ? 'وضع عادي' : 'Standard')}</span>
          </button>

          {/* Randomize Arab Plan */}
          <button
            onClick={handleRandomizeArabPlan}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-colors"
            title={isArabic ? 'اقتراح جدول عربي متنوع تلقائياً' : 'Randomize Arab Plan'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isArabic ? 'اقتراح أسبوعي' : 'Auto Fill'}</span>
          </button>

          {/* Family Share Link */}
          <button
            onClick={onOpenFamilySync}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isArabic ? 'مشاركة العائلة' : 'Share'}</span>
          </button>

          {/* Generate Smart Grocery */}
          <button
            onClick={onGoToGrocery}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isArabic ? 'توليد قائمة التسوق' : 'Generate Grocery List'}</span>
          </button>

          <button
            onClick={handleClearWeek}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            title={isArabic ? 'تفريغ الجدول' : 'Clear Plan'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {plan.days.map((day) => (
          <div
            key={day.dayId}
            className="bg-white dark:bg-[#162032] rounded-2xl border border-[#d9d9dd] dark:border-[#2b3a54] shadow-xs flex flex-col overflow-hidden"
          >
            {/* Day Header */}
            <div className="bg-amber-100/70 dark:bg-stone-800/80 px-3 py-2.5 text-center border-b border-amber-200/60 dark:border-stone-700">
              <h3 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                {isArabic ? day.dayNameAr : day.dayNameEn}
              </h3>
            </div>

            {/* Slots */}
            <div className="p-2.5 flex-1 space-y-2.5">
              {slotsToDisplay.map((slotInfo) => {
                const assignment = day.slots[slotInfo.key];
                const recipe = assignment ? recipeMap.get(assignment.recipeId) : null;

                return (
                  <div
                    key={slotInfo.key}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      recipe
                        ? 'bg-amber-50/80 dark:bg-stone-800/90 border-amber-300 dark:border-stone-700'
                        : 'bg-stone-50/50 dark:bg-stone-950/40 border-dashed border-amber-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1">
                      <span>
                        {slotInfo.icon} {isArabic ? slotInfo.labelAr : slotInfo.labelEn}
                      </span>
                      {recipe && (
                        <button
                          onClick={() => handleRemoveSlot(day.dayId, slotInfo.key)}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {recipe ? (
                      <div
                        className="cursor-pointer group"
                        onClick={() => onOpenRecipeDetail(recipe)}
                      >
                        <div className="relative h-20 w-full rounded-lg overflow-hidden mb-1.5">
                          <img
                            src={recipe.image}
                            alt={isArabic ? recipe.titleAr : recipe.titleEn}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/recipe-placeholder.svg';
                            }}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/60 text-amber-200 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                            {assignment?.servings} {isArabic ? 'فرد' : 'servings'}
                          </div>
                        </div>
                        <p className="font-extrabold text-stone-800 dark:text-stone-100 line-clamp-1">
                          {isArabic ? recipe.titleAr : recipe.titleEn}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenAssign(day.dayId, slotInfo.key)}
                        className="w-full py-3 rounded-lg bg-amber-100/40 hover:bg-amber-100 dark:hover:bg-stone-800 text-amber-900 dark:text-amber-200 font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-700" />
                        <span>{isArabic ? 'إضافة وجبة' : 'Add Meal'}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Assign Recipe Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-200/80 dark:border-stone-800 p-6 max-h-[85vh] flex flex-col text-stone-800 dark:text-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-stone-800 mb-3">
              <div>
                <h3 className="text-base font-bold text-amber-950 dark:text-amber-200">
                  {isArabic ? 'اختر وجبة للجدول الأسبوعي:' : 'Select Recipe for Slot:'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {isArabic ? 'اختر من الوصفات المتاحة أو أضف وجبتك الخاصة' : 'Select from recipes or add a new custom meal'}
                </p>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800">
                ✕
              </button>
            </div>

            {onOpenCreateRecipeModal && (
              <div className="mb-3">
                <button
                  onClick={() => {
                    setAssignModalOpen(false);
                    onOpenCreateRecipeModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isArabic ? 'إضافة وجبة خاصة جديدة يدوياً 🍳' : 'Create & Add New Custom Meal 🍳'}</span>
                </button>
              </div>
            )}

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {recipes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleSelectRecipeForSlot(r.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 dark:bg-stone-800/60 hover:bg-amber-100 dark:hover:bg-stone-800 border border-amber-200/60 dark:border-stone-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.image}
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/recipe-placeholder.svg';
                      }}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                        {isArabic ? r.titleAr : r.titleEn}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {isArabic ? r.descriptionAr : r.descriptionEn}
                      </p>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-amber-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
