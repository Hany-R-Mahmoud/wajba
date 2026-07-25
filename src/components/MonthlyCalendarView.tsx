import React, { useState } from 'react';
import { Language, MealSlot, MonthlyPlan, Recipe } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Plus,
  Trash2,
  Sparkles,
  ShoppingBag,
  Share2,
  X,
  Utensils,
  Clock,
  Eye,
} from 'lucide-react';

interface MonthlyCalendarViewProps {
  monthlyPlan: MonthlyPlan;
  onUpdateMonthlyPlan: (plan: MonthlyPlan) => void;
  recipes: Recipe[];
  language: Language;
  onGoToGrocery: () => void;
  onOpenRecipeDetail: (recipe: Recipe) => void;
  onOpenFamilySync: () => void;
  onChangeMonth: (year: number, month: number) => void;
  onOpenCreateRecipeModal?: () => void;
}

const MONTH_NAMES = {
  ar: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

const WEEKDAY_NAMES = {
  ar: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
  en: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  monthlyPlan,
  onUpdateMonthlyPlan,
  recipes,
  language,
  onGoToGrocery,
  onOpenRecipeDetail,
  onOpenFamilySync,
  onChangeMonth,
  onOpenCreateRecipeModal,
}) => {
  const isArabic = language === 'ar';

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [assignModalSlot, setAssignModalSlot] = useState<MealSlot | null>(null);

  const recipeMap = new Map<string, Recipe>();
  recipes.forEach((r) => recipeMap.set(r.id, r));

  const slotsToDisplay: { key: MealSlot; labelAr: string; labelEn: string; icon: string }[] =
    monthlyPlan.isRamadanMode
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

  const year = monthlyPlan.year;
  const month = monthlyPlan.month;

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  // Navigation
  const handlePrevMonth = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    onChangeMonth(newYear, newMonth);
  };

  const handleNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    onChangeMonth(newYear, newMonth);
  };

  const handleGoToday = () => {
    onChangeMonth(todayYear, todayMonth);
  };

  const toggleRamadanMode = () => {
    onUpdateMonthlyPlan({
      ...monthlyPlan,
      isRamadanMode: !monthlyPlan.isRamadanMode,
    });
  };

  // Calendar matrix calculation
  // We align grid starting on Saturday (index 6 in standard JS getDay where 0=Sun, 6=Sat)
  // Weekday order: Sat (0), Sun (1), Mon (2), Tue (3), Wed (4), Thu (5), Fri (6)
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map JS getDay() (0=Sun..6=Sat) to our Sat-first index (Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6)
  const getSatFirstDayIndex = (jsDay: number) => (jsDay + 1) % 7;

  const startDayIndex = getSatFirstDayIndex(firstDayOfMonth.getDay());

  const calendarCells: Array<{
    dateKey: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  }> = [];

  // Previous month padding
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = startDayIndex - 1; i >= 0; i--) {
    const pDay = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const mStr = String(prevMonth + 1).padStart(2, '0');
    const dStr = String(pDay).padStart(2, '0');
    calendarCells.push({
      dateKey: `${prevYear}-${mStr}-${dStr}`,
      dayNumber: pDay,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dKey = `${year}-${mStr}-${dStr}`;
    const isToday = year === todayYear && month === todayMonth && d === todayDate;

    calendarCells.push({
      dateKey: dKey,
      dayNumber: d,
      isCurrentMonth: true,
      isToday,
    });
  }

  // Next month padding to reach multiple of 7 (usually 35 or 42)
  const totalCellsSoFar = calendarCells.length;
  const totalGridCells = Math.ceil(totalCellsSoFar / 7) * 7;
  for (let n = 1; n <= totalGridCells - totalCellsSoFar; n++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const mStr = String(nextMonth + 1).padStart(2, '0');
    const dStr = String(n).padStart(2, '0');
    calendarCells.push({
      dateKey: `${nextYear}-${mStr}-${dStr}`,
      dayNumber: n,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Auto fill entire month
  const handleAutoFillMonth = () => {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    let idx = 0;
    const newDays = { ...monthlyPlan.days };

    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dKey = `${year}-${mStr}-${dStr}`;

      const slots: { [key in MealSlot]?: { recipeId: string; servings: number } } = {};
      slotsToDisplay.forEach((s) => {
        if (shuffled[idx]) {
          slots[s.key] = {
            recipeId: shuffled[idx].id,
            servings: shuffled[idx].servings || 4,
          };
          idx = (idx + 1) % shuffled.length;
        }
      });
      newDays[dKey] = { slots };
    }

    onUpdateMonthlyPlan({
      ...monthlyPlan,
      days: newDays,
    });
  };

  const handleClearMonth = () => {
    if (
      confirm(
        isArabic
          ? 'هل أنت متأكد من مسح جميع وجبات الشهر؟'
          : 'Are you sure you want to clear all monthly meals?'
      )
    ) {
      onUpdateMonthlyPlan({
        ...monthlyPlan,
        days: {},
      });
    }
  };

  const handleAssignRecipeToDateSlot = (recipeId: string) => {
    if (!selectedDateKey || !assignModalSlot) return;

    const currentDayPlan = monthlyPlan.days[selectedDateKey] || { slots: {} };
    const recipe = recipeMap.get(recipeId);

    const updatedSlots = {
      ...currentDayPlan.slots,
      [assignModalSlot]: {
        recipeId,
        servings: recipe?.servings || 4,
      },
    };

    onUpdateMonthlyPlan({
      ...monthlyPlan,
      days: {
        ...monthlyPlan.days,
        [selectedDateKey]: {
          ...currentDayPlan,
          slots: updatedSlots,
        },
      },
    });

    setAssignModalSlot(null);
  };

  const handleRemoveDateSlot = (dateKey: string, slotKey: MealSlot) => {
    const currentDayPlan = monthlyPlan.days[dateKey];
    if (!currentDayPlan) return;

    const updatedSlots = { ...currentDayPlan.slots };
    delete updatedSlots[slotKey];

    onUpdateMonthlyPlan({
      ...monthlyPlan,
      days: {
        ...monthlyPlan.days,
        [dateKey]: {
          ...currentDayPlan,
          slots: updatedSlots,
        },
      },
    });
  };

  // Selected Day Details
  const selectedDayPlan = selectedDateKey ? monthlyPlan.days[selectedDateKey] : null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-[#162032] p-5 rounded-3xl border border-[#d9d9dd] dark:border-[#2b3a54] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Month Title & Controls */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-700 text-white rounded-2xl shadow-md">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl hover:bg-amber-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
                  title={isArabic ? 'الشهر السابق' : 'Previous Month'}
                >
                  {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                <h1 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 min-w-[160px] text-center">
                  {isArabic ? `${MONTH_NAMES.ar[month]} ${year}` : `${MONTH_NAMES.en[month]} ${year}`}
                </h1>

                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl hover:bg-amber-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
                  title={isArabic ? 'الشهر التالي' : 'Next Month'}
                >
                  {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleGoToday}
                  className="ms-2 px-3 py-1 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-colors"
                >
                  {isArabic ? 'اليوم' : 'Today'}
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {isArabic
                  ? 'خطط وجبات الشهر كاملاً وتصفح جدول العائلة بالتفصيل.'
                  : 'Plan your entire month of meals with smart family synchronization.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Ramadan Switcher */}
            <button
              onClick={toggleRamadanMode}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                monthlyPlan.isRamadanMode
                  ? 'bg-amber-900 text-amber-100 border-amber-700 dark:bg-amber-950'
                  : 'bg-amber-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-200 dark:border-stone-700'
              }`}
            >
              {monthlyPlan.isRamadanMode ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600" />
              )}
              <span>
                {monthlyPlan.isRamadanMode
                  ? isArabic
                    ? 'وضع رمضان'
                    : 'Ramadan Mode'
                  : isArabic
                  ? 'وضع عادي'
                  : 'Standard'}
              </span>
            </button>

            {/* Auto Fill Month */}
            <button
              onClick={handleAutoFillMonth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'اقتراح شهري' : 'Auto Fill Month'}</span>
            </button>

            {/* Family Sync */}
            <button
              onClick={onOpenFamilySync}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? 'مشاركة' : 'Share'}</span>
            </button>

            {/* Grocery */}
            <button
              onClick={onGoToGrocery}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isArabic ? 'قائمة التسوق الشهرية' : 'Monthly Grocery'}</span>
            </button>

            <button
              onClick={handleClearMonth}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title={isArabic ? 'تفريغ الشهر' : 'Clear Month'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white dark:bg-[#162032] rounded-3xl border border-[#d9d9dd] dark:border-[#2b3a54] shadow-sm overflow-hidden p-3 sm:p-4">
        {/* Weekday Titles Header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
          {(isArabic ? WEEKDAY_NAMES.ar : WEEKDAY_NAMES.en).map((dayName, idx) => (
            <div
              key={idx}
              className="py-2 text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100/60 dark:bg-stone-800/60 rounded-xl"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* 35/42 Calendar Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarCells.map((cell) => {
            const dayData = monthlyPlan.days[cell.dateKey];
            const slotCount = dayData?.slots ? Object.keys(dayData.slots).length : 0;

            return (
              <div
                key={cell.dateKey}
                onClick={() => setSelectedDateKey(cell.dateKey)}
                className={`min-h-[90px] sm:min-h-[115px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  !cell.isCurrentMonth
                    ? 'opacity-40 bg-stone-50 dark:bg-stone-950/20 border-stone-100 dark:border-stone-800/40'
                    : cell.isToday
                    ? 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                    : slotCount > 0
                    ? 'bg-amber-50/70 dark:bg-stone-800/60 border-amber-200 dark:border-stone-700 hover:border-amber-400'
                    : 'bg-white dark:bg-stone-900 border-amber-100 dark:border-stone-800 hover:bg-amber-50/40 dark:hover:bg-stone-800/40'
                }`}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-black w-6 h-6 rounded-full flex items-center justify-center ${
                      cell.isToday
                        ? 'bg-amber-600 text-white shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-stone-800 dark:text-stone-200'
                        : 'text-stone-400'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {slotCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-200 dark:bg-stone-700 text-amber-950 dark:text-amber-200">
                      {slotCount} {isArabic ? 'وجبات' : 'meals'}
                    </span>
                  )}
                </div>

                {/* Day Meals List Summary */}
                <div className="space-y-1 my-1 flex-1 overflow-hidden">
                  {dayData?.slots &&
                    slotsToDisplay.map((slotInfo) => {
                      const assignment = dayData.slots[slotInfo.key];
                      if (!assignment) return null;
                      const recipe = recipeMap.get(assignment.recipeId);
                      if (!recipe) return null;

                      return (
                        <div
                          key={slotInfo.key}
                          className="flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-stone-800/90 border border-amber-200/80 dark:border-stone-700 truncate text-stone-800 dark:text-stone-200 shadow-2xs"
                        >
                          <span className="flex-shrink-0">{slotInfo.icon}</span>
                          <span className="truncate">{isArabic ? recipe.titleAr : recipe.titleEn}</span>
                        </div>
                      );
                    })}
                </div>

                {/* Bottom Add Prompt */}
                {cell.isCurrentMonth && slotCount === 0 && (
                  <div className="text-[10px] font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity text-center pb-0.5">
                    + {isArabic ? 'إضافة' : 'Add'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Meal Manager Drawer/Modal */}
      {selectedDateKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-200/80 dark:border-stone-800 p-6 max-h-[85vh] flex flex-col text-stone-800 dark:text-stone-100 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-black text-amber-950 dark:text-amber-100">
                  {isArabic ? `جدول وجبات يوم: ${selectedDateKey}` : `Meals for Date: ${selectedDateKey}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDateKey(null)}
                className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meal Slots List */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {slotsToDisplay.map((slotInfo) => {
                const assignment = selectedDayPlan?.slots?.[slotInfo.key];
                const recipe = assignment ? recipeMap.get(assignment.recipeId) : null;

                return (
                  <div
                    key={slotInfo.key}
                    className="p-4 rounded-2xl border border-amber-200 dark:border-stone-800 bg-amber-50/40 dark:bg-stone-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <span className="text-base">{slotInfo.icon}</span>
                        <span>{isArabic ? slotInfo.labelAr : slotInfo.labelEn}</span>
                      </span>

                      {recipe && (
                        <button
                          onClick={() => handleRemoveDateSlot(selectedDateKey, slotInfo.key)}
                          className="text-stone-400 hover:text-rose-600 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'حذف' : 'Remove'}</span>
                        </button>
                      )}
                    </div>

                    {recipe ? (
                      <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-3 rounded-xl border border-amber-200/80 dark:border-stone-700">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => onOpenRecipeDetail(recipe)}
                        >
                          <img
                            src={recipe.image}
                            alt=""
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/recipe-placeholder.svg';
                            }}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <div>
                            <p className="text-xs font-black text-stone-900 dark:text-stone-100">
                              {isArabic ? recipe.titleAr : recipe.titleEn}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              {assignment?.servings} {isArabic ? 'أفراد' : 'servings'} •{' '}
                              {recipe.prepTimeMinutes + recipe.cookTimeMinutes}{' '}
                              {isArabic ? 'دقيقة' : 'mins'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setAssignModalSlot(slotInfo.key)}
                          className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200"
                        >
                          {isArabic ? 'تغيير' : 'Change'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssignModalSlot(slotInfo.key)}
                        className="w-full py-3 rounded-xl border-2 border-dashed border-amber-300 dark:border-stone-700 hover:bg-amber-100/50 dark:hover:bg-stone-800 text-amber-900 dark:text-amber-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-amber-700" />
                        <span>{isArabic ? 'اختر وجبة لهذا الموعد' : 'Select Recipe for Slot'}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDateKey(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md"
              >
                {isArabic ? 'حفظ وإغلاق' : 'Save & Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Recipe Sub-Modal */}
      {assignModalSlot && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-stone-800 p-6 max-h-[80vh] flex flex-col text-stone-800 dark:text-stone-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-stone-800">
              <h3 className="text-sm font-black text-amber-950 dark:text-amber-100">
                {isArabic ? 'اختر وصفة للجدول الشهرى:' : 'Select Recipe for Monthly Slot:'}
              </h3>
              <button
                onClick={() => setAssignModalSlot(null)}
                className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800"
              >
                ✕
              </button>
            </div>

            {onOpenCreateRecipeModal && (
              <div>
                <button
                  onClick={() => {
                    setAssignModalSlot(null);
                    setSelectedDateKey(null);
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
                  onClick={() => handleAssignRecipeToDateSlot(r.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 dark:bg-stone-800/60 hover:bg-amber-100 dark:hover:bg-stone-800 border border-amber-200/60 dark:border-stone-700 cursor-pointer transition-colors"
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
                      <p className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
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
