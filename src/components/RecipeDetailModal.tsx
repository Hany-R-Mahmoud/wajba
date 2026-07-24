import React, { useState } from 'react';
import { ActiveTimer, Language, MealSlot, Recipe } from '../types';
import { X, Clock, Users, Timer, Share2, Check, Plus, Minus, CalendarPlus, ShoppingBag, BookOpen, ThumbsUp, ChevronLeft, ChevronRight, Maximize2, Images } from 'lucide-react';
import { REGION_BADGES } from './RecipeCard';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  language: Language;
  onStartTimer: (timer: ActiveTimer) => void;
  onAddToPlanner: (recipe: Recipe, slot: MealSlot, dayId: string, servings: number) => void;
  onAddIngredientsToGrocery: (ingredients: Recipe['ingredients'], scale: number) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  language,
  onStartTimer,
  onAddToPlanner,
  onAddIngredientsToGrocery,
}) => {
  if (!recipe) return null;

  const isArabic = language === 'ar';
  const regionInfo = REGION_BADGES[recipe.region] || REGION_BADGES.general;

  const galleryList = recipe.galleryImages && recipe.galleryImages.length > 0
    ? recipe.galleryImages
    : [recipe.image];

  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [currentServings, setCurrentServings] = useState<number>(recipe.servings || 4);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedGrocery, setAddedGrocery] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('sat');
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>('lunch');

  const scale = currentServings / (recipe.servings || 1);
  const currentImage = galleryList[activeImgIdx] || recipe.image;

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % galleryList.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  const handleShareWhatsApp = () => {
    const text = isArabic
      ? `🍲 جرب وصفة: *${recipe.titleAr}*\n\n${recipe.descriptionAr}\n\n📖 مكونات لـ ${currentServings} أشخاص:\n${recipe.ingredients
          .map((i) => `• ${Math.round(i.amount * scale * 10) / 10} ${i.unitAr} ${i.nameAr}`)
          .join('\n')}\n\nشاركت من تطبيق وجبة Wajba 🍽️`
      : `🍲 Check out recipe: *${recipe.titleEn}*\n\n${recipe.descriptionEn}\n\n📖 Ingredients for ${currentServings} servings:\n${recipe.ingredients
          .map((i) => `• ${Math.round(i.amount * scale * 10) / 10} ${i.unitEn} ${i.nameEn}`)
          .join('\n')}\n\nShared via Wajba 🍽️`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddGrocery = () => {
    onAddIngredientsToGrocery(recipe.ingredients, scale);
    setAddedGrocery(true);
    setTimeout(() => setAddedGrocery(false), 2000);
  };

  const handleConfirmPlan = () => {
    onAddToPlanner(recipe, selectedSlot, selectedDay, currentServings);
    setPlannerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-200/80 dark:border-stone-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Hero Image Catalog */}
        <div className="relative h-72 sm:h-80 w-full bg-stone-950 flex-shrink-0 group overflow-hidden">
          <img
            src={currentImage}
            alt={isArabic ? recipe.titleAr : recipe.titleEn}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
            }}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-black/40" />

          {/* Top Actions Bar */}
          <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-10">
            {/* Catalog Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 shadow-md">
                <Images className="w-3.5 h-3.5" />
                <span>
                  {isArabic
                    ? `كتالوج الصور (${activeImgIdx + 1}/${galleryList.length})`
                    : `Image Gallery (${activeImgIdx + 1}/${galleryList.length})`}
                </span>
              </span>

              <button
                onClick={() => setIsLightboxOpen(true)}
                className="p-2 rounded-full bg-stone-900/80 hover:bg-amber-600 backdrop-blur-md text-white transition-all shadow-md"
                title={isArabic ? 'تكبير الصور' : 'Fullscreen Gallery'}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-stone-900/80 hover:bg-red-600 backdrop-blur-md text-white transition-all shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel Next/Prev Controls */}
          {galleryList.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 hover:bg-amber-600 text-white backdrop-blur-md transition-all shadow-lg z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 hover:bg-amber-600 text-white backdrop-blur-md transition-all shadow-lg z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Region & Header Metadata */}
          <div className="absolute bottom-16 right-4 left-4 text-white z-10">
            <span className={`inline-block mb-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${regionInfo.bg}`}>
              {isArabic ? regionInfo.ar : regionInfo.en}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-md">
              {isArabic ? recipe.titleAr : recipe.titleEn}
            </h2>
            <p className="text-xs text-amber-200/90 font-medium">
              {isArabic ? recipe.titleEn : recipe.titleAr}
            </p>
          </div>

          {/* Interactive Thumbnail Catalog Bar */}
          {galleryList.length > 1 && (
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-center gap-2 z-10">
              {galleryList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIdx(idx);
                  }}
                  className={`relative w-12 h-10 rounded-lg overflow-hidden border-2 transition-all shadow-md ${
                    activeImgIdx === idx
                      ? 'border-amber-400 scale-110 ring-2 ring-amber-400/50'
                      : 'border-white/40 opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumb ${idx + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
                    }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-stone-800 dark:text-stone-100">
          {/* Quick Stats Bar & Servings Scaler */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
            <div className="flex items-center gap-4 text-xs font-bold text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes} {isArabic ? 'دقيقة إجمالية' : 'total min'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>{recipe.votesCount.likes} {isArabic ? 'إعجاب' : 'likes'}</span>
              </div>
            </div>

            {/* Servings Scaler */}
            <div className="flex items-center gap-3 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-stone-700 shadow-xs">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                <Users className="w-4 h-4 inline me-1 text-amber-700" />
                {isArabic ? 'عدد الأشخاص:' : 'Servings:'}
              </span>
              <button
                onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
                className="p-1 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 hover:bg-amber-200"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-extrabold text-amber-900 dark:text-amber-300 min-w-[20px] text-center">
                {currentServings}
              </span>
              <button
                onClick={() => setCurrentServings(currentServings + 1)}
                className="p-1 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 hover:bg-amber-200"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dish Heritage / Story */}
          {(recipe.storyAr || recipe.storyEn) && (
            <div className="p-4 rounded-2xl bg-amber-100/50 dark:bg-stone-800/40 border-s-4 border-amber-600 dark:border-amber-500">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>{isArabic ? 'قصة وأصل الطبخة' : 'Recipe Heritage & Origin'}</span>
              </h4>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {isArabic ? recipe.storyAr : recipe.storyEn}
              </p>
            </div>
          )}

          {/* Ingredients Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-700" />
                <span>{isArabic ? 'المكونات المطلوبة' : 'Ingredients Needed'}</span>
              </h3>
              <button
                onClick={handleAddGrocery}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  addedGrocery
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                {addedGrocery ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>
                  {addedGrocery
                    ? isArabic
                      ? 'تمت الإضافة لقائمة التسوق!'
                      : 'Added to Grocery List!'
                    : isArabic
                    ? 'إضافة لقائمة التسوق'
                    : 'Add to Grocery List'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing) => {
                const scaledAmount = Math.round(ing.amount * scale * 10) / 10;
                return (
                  <div
                    key={ing.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-xs"
                  >
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {isArabic ? ing.nameAr : ing.nameEn}
                    </span>
                    <span className="font-bold text-amber-800 dark:text-amber-400 font-mono">
                      {scaledAmount} {isArabic ? ing.unitAr : ing.unitEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Steps & Instructions with Interactive Timer Triggers */}
          <div>
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>{isArabic ? 'خطوات التحضير والطهي' : 'Step-by-Step Instructions'}</span>
            </h3>

            <div className="space-y-3">
              {(isArabic ? recipe.instructionsAr : recipe.instructionsEn).map((step, idx) => {
                // Check if this step has an associated timer
                const timerStep = recipe.timerSteps?.find((t) => t.stepIndex === idx);

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-stone-800/40 border border-amber-200/40 dark:border-stone-800 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                        {step}
                      </p>

                      {/* Interactive Cooking Timer Trigger */}
                      {timerStep && (
                        <button
                          onClick={() => {
                            onStartTimer({
                              id: `t_${recipe.id}_${idx}_${Date.now()}`,
                              recipeId: recipe.id,
                              recipeTitleAr: recipe.titleAr,
                              recipeTitleEn: recipe.titleEn,
                              stepTitleAr: timerStep.titleAr,
                              stepTitleEn: timerStep.titleEn,
                              totalSeconds: timerStep.durationMinutes * 60,
                              remainingSeconds: timerStep.durationMinutes * 60,
                              isRunning: true,
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all animate-pulse"
                        >
                          <Timer className="w-3.5 h-3.5" />
                          <span>
                            {isArabic
                              ? `بدء مؤقت: ${timerStep.durationMinutes} دقيقة`
                              : `Start Timer: ${timerStep.durationMinutes} min`}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slot Assignment Drawer Form */}
          {plannerOpen && (
            <div className="p-4 rounded-2xl bg-amber-100 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 space-y-3">
              <h4 className="text-xs font-extrabold text-amber-950 dark:text-amber-200">
                {isArabic ? 'اختر اليوم والوجبة في الجدول:' : 'Assign Day & Meal Slot:'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold block mb-1">
                    {isArabic ? 'اليوم' : 'Day'}
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-700 font-bold"
                  >
                    <option value="sat">{isArabic ? 'السبت' : 'Saturday'}</option>
                    <option value="sun">{isArabic ? 'الأحد' : 'Sunday'}</option>
                    <option value="mon">{isArabic ? 'الإثنين' : 'Monday'}</option>
                    <option value="tue">{isArabic ? 'الثلاثاء' : 'Tuesday'}</option>
                    <option value="wed">{isArabic ? 'الأربعاء' : 'Wednesday'}</option>
                    <option value="thu">{isArabic ? 'الخميس' : 'Thursday'}</option>
                    <option value="fri">{isArabic ? 'الجمعة' : 'Friday'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold block mb-1">
                    {isArabic ? 'الوجبة' : 'Meal Slot'}
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value as MealSlot)}
                    className="w-full text-xs p-2 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-700 font-bold"
                  >
                    <option value="breakfast">{isArabic ? 'الإفطار الصباحي' : 'Breakfast'}</option>
                    <option value="lunch">{isArabic ? 'الغداء الرئيسي' : 'Lunch'}</option>
                    <option value="dinner">{isArabic ? 'العشاء' : 'Dinner'}</option>
                    <option value="suhoor">{isArabic ? 'السحور (رمضان)' : 'Suhoor'}</option>
                    <option value="iftar">{isArabic ? 'إفطار رمضان' : 'Iftar'}</option>
                    <option value="dessert">{isArabic ? 'الحلويات / تحلية' : 'Dessert'}</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleConfirmPlan}
                className="w-full py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold"
              >
                {isArabic ? 'تأكيد الإضافة للجدول' : 'Confirm Add to Plan'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-amber-50 dark:bg-stone-900 border-t border-amber-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الرابط' : 'Copy Link')}</span>
            </button>
          </div>

          <button
            onClick={() => setPlannerOpen(!plannerOpen)}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة لجدول الوجبات' : 'Add to Weekly Plan'}</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Overlay */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Lightbox Header */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                {activeImgIdx + 1} / {galleryList.length}
              </span>
              <h3 className="text-sm sm:text-base font-bold">
                {isArabic ? recipe.titleAr : recipe.titleEn}
              </h3>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Image & Navigation */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentImage}
              alt={isArabic ? recipe.titleAr : recipe.titleEn}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
              }}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {galleryList.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 p-3 rounded-full bg-stone-900/80 hover:bg-amber-600 text-white transition-all shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 p-3 rounded-full bg-stone-900/80 hover:bg-amber-600 text-white transition-all shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Thumbnails Catalog Footer */}
          {galleryList.length > 1 && (
            <div className="flex items-center justify-center gap-3 overflow-x-auto p-2 max-w-full z-10">
              {galleryList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImgIdx === idx
                      ? 'border-amber-400 scale-110 ring-2 ring-amber-400/50'
                      : 'border-stone-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Gallery Thumb ${idx + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
                    }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

