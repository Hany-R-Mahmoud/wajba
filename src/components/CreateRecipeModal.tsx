import React, { useEffect, useState } from 'react';
import { DIETARY_TAGS, CookingTimerStep, DietaryTag, Ingredient, IngredientAisle, Language, MealSlot, Recipe, Region } from '../types';
import { X, Plus, Trash2, Save, Sparkles, Clock, Image as ImageIcon, BookOpen, Layers, Check } from 'lucide-react';

interface CreateRecipeModalProps {
  onClose: () => void;
  language: Language;
  onSaveRecipe: (recipe: Recipe) => void;
  initialRecipe?: Recipe | null;
}

const PRESET_IMAGES = [
  { labelAr: 'طواجن ووجبات مصرية', labelEn: 'Stew & Tajine', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80' },
  { labelAr: 'أرز وكشري ومندي', labelEn: 'Rice & Mandi', url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80' },
  { labelAr: 'مشويات وكباب', labelEn: 'Grills & Kebabs', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80' },
  { labelAr: 'سلطات ومقبلات', labelEn: 'Salads & Mezza', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80' },
  { labelAr: 'فطائر وسمبوسك', labelEn: 'Pastries & Pies', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80' },
  { labelAr: 'حلويات شرقية', labelEn: 'Eastern Sweets', url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=80' },
  { labelAr: 'إفطار وشكشوكة', labelEn: 'Breakfast & Eggs', url: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1000&q=80' },
  { labelAr: 'شوربة وحساء', labelEn: 'Soups & Broth', url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14e8?auto=format&fit=crop&w=1000&q=80' },
];

const MEAL_SLOT_OPTIONS: { id: MealSlot; labelAr: string; labelEn: string; icon: string }[] = [
  { id: 'breakfast', labelAr: 'إفطار', labelEn: 'Breakfast', icon: '🍳' },
  { id: 'lunch', labelAr: 'غداء', labelEn: 'Lunch', icon: '🍲' },
  { id: 'dinner', labelAr: 'عشاء', labelEn: 'Dinner', icon: '🥪' },
  { id: 'suhoor', labelAr: 'سحور', labelEn: 'Suhoor', icon: '🌙' },
  { id: 'iftar', labelAr: 'إفطار رمضان', labelEn: 'Iftar', icon: '🌅' },
  { id: 'dessert', labelAr: 'حلويات', labelEn: 'Dessert', icon: '🍰' },
  { id: 'snack', labelAr: 'وجبة خفيفة', labelEn: 'Snack', icon: '🍿' },
];

export const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
  onClose,
  language,
  onSaveRecipe,
  initialRecipe,
}) => {
  const isArabic = language === 'ar';

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [region, setRegion] = useState<Region>('egypt');
  const [mealTypes, setMealTypes] = useState<MealSlot[]>(['lunch', 'dinner']);
  const [prepTime, setPrepTime] = useState(20);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isRamadanSpecial, setIsRamadanSpecial] = useState(false);
  const [tagsInput, setTagsInput] = useState('وصفة خاصة, عائلية');
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [extraImage1, setExtraImage1] = useState('');
  const [extraImage2, setExtraImage2] = useState('');
  const [extraImage3, setExtraImage3] = useState('');
  const [storyAr, setStoryAr] = useState('');
  const [storyEn, setStoryEn] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'c_1', nameAr: 'أرز بسمتي أو مصري', nameEn: 'Rice', amount: 300, unitAr: 'جرام', unitEn: 'g', aisle: 'pantry' },
    { id: 'c_2', nameAr: 'ثوم مفروم وبصل', nameEn: 'Garlic & Onion', amount: 2, unitAr: 'حبة', unitEn: 'pcs', aisle: 'produce' },
  ]);

  const [instructionsAr, setInstructionsAr] = useState<string[]>([
    'اغسل المكونات ونظفها جيداً.',
    'طهي المكونات على نار متوسطة حتى تمام النضج.',
  ]);

  const [instructionsEn, setInstructionsEn] = useState<string[]>([
    'Wash and prep all ingredients cleanly.',
    'Cook over medium heat until tender and well infused.',
  ]);

  const [timerSteps, setTimerSteps] = useState<CookingTimerStep[]>([
    { stepIndex: 1, titleAr: 'طهي الوجبة بالفرن', titleEn: 'Bake Dish in Oven', durationMinutes: 25 },
  ]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (!initialRecipe) return;
    setTitleAr(initialRecipe.titleAr);
    setTitleEn(initialRecipe.titleEn);
    setDescriptionAr(initialRecipe.descriptionAr);
    setDescriptionEn(initialRecipe.descriptionEn);
    setRegion(initialRecipe.region);
    setMealTypes(initialRecipe.mealType);
    setPrepTime(initialRecipe.prepTimeMinutes);
    setCookTime(initialRecipe.cookTimeMinutes);
    setServings(initialRecipe.servings);
    setDifficulty(initialRecipe.difficulty);
    setIsRamadanSpecial(Boolean(initialRecipe.isRamadanSpecial));
    setTagsInput(initialRecipe.tags.join(', '));
    setDietaryTags(initialRecipe.dietaryTags ?? []);
    setImageUrl(initialRecipe.image);
    setExtraImage1(initialRecipe.galleryImages?.[1] ?? '');
    setExtraImage2(initialRecipe.galleryImages?.[2] ?? '');
    setExtraImage3(initialRecipe.galleryImages?.[3] ?? '');
    setStoryAr(initialRecipe.storyAr ?? '');
    setStoryEn(initialRecipe.storyEn ?? '');
    setIngredients(initialRecipe.ingredients);
    setInstructionsAr(initialRecipe.instructionsAr);
    setInstructionsEn(initialRecipe.instructionsEn);
    setTimerSteps(initialRecipe.timerSteps ?? []);
  }, [initialRecipe]);

  const toggleMealType = (slot: MealSlot) => {
    if (mealTypes.includes(slot)) {
      if (mealTypes.length > 1) {
        setMealTypes(mealTypes.filter((s) => s !== slot));
      }
    } else {
      setMealTypes([...mealTypes, slot]);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: `c_${Date.now()}_${ingredients.length}`,
        nameAr: '',
        nameEn: '',
        amount: 100,
        unitAr: 'جرام',
        unitEn: 'g',
        aisle: 'pantry',
      },
    ]);
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddInstruction = () => {
    setInstructionsAr([...instructionsAr, '']);
    setInstructionsEn([...instructionsEn, '']);
  };

  const handleRemoveInstruction = (idx: number) => {
    setInstructionsAr(instructionsAr.filter((_, i) => i !== idx));
    setInstructionsEn(instructionsEn.filter((_, i) => i !== idx));
  };

  const handleAddTimerStep = () => {
    setTimerSteps([
      ...timerSteps,
      {
        stepIndex: timerSteps.length + 1,
        titleAr: 'مؤقت طهي خاص',
        titleEn: 'Custom Cooking Timer',
        durationMinutes: 15,
      },
    ]);
  };

  const handleRemoveTimerStep = (idx: number) => {
    setTimerSteps(timerSteps.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validIngredients = ingredients.filter((ing) => ing.nameAr.trim() && ing.nameEn.trim() && Number.isFinite(ing.amount) && ing.amount > 0);
    if (!titleAr.trim() || !titleEn.trim() || servings <= 0 || validIngredients.length === 0) {
      setValidationError(isArabic ? 'أدخل العنوانين، وعدد أفراد صحيح، ومكوناً صالحاً واحداً على الأقل.' : 'Enter both titles, a positive serving count, and at least one valid ingredient.');
      return;
    }
    if (isSaving) return;
    setValidationError('');
    setIsSaving(true);

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newRecipe: Recipe = {
      id: initialRecipe?.id ?? `custom_${Date.now()}`,
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim() || titleAr.trim(),
      descriptionAr: descriptionAr.trim() || (isArabic ? 'وصفة عائلية ممتازة محبوكة بعناية' : 'Delicious family recipe'),
      descriptionEn: descriptionEn.trim() || descriptionAr.trim() || 'Delicious family recipe',
      region,
      mealType: mealTypes,
      prepTimeMinutes: Number(prepTime) || 20,
      cookTimeMinutes: Number(cookTime) || 30,
      servings: Number(servings) || 4,
      difficulty,
      isRamadanSpecial,
      tags: parsedTags.length > 0 ? parsedTags : ['وصفة خاصة', 'عائلية'],
      image: imageUrl.trim() || PRESET_IMAGES[0].url,
      galleryImages: [
        imageUrl.trim() || PRESET_IMAGES[0].url,
        extraImage1.trim(),
        extraImage2.trim(),
        extraImage3.trim(),
      ].filter(Boolean),
      storyAr: storyAr.trim() || (isArabic ? 'وصفة عائلية تناقلتها الأجيال بطعم مميز وأصيل.' : 'A cherished family recipe passed down with pride.'),
      storyEn: storyEn.trim() || storyAr.trim() || 'A cherished family recipe passed down with pride.',
      dietaryTags,
      ingredients: validIngredients,
      instructionsAr: instructionsAr.filter((inst) => inst.trim().length > 0),
      instructionsEn: instructionsEn.filter((inst) => inst.trim().length > 0),
      timerSteps: timerSteps.filter((ts) => ts.titleAr.trim().length > 0 && ts.durationMinutes > 0),
      votesCount: { likes: 1, dislikes: 0 },
      rating: 5.0,
      isCustom: true,
    };

    onSaveRecipe({
      ...newRecipe,
      votesCount: initialRecipe?.votesCount ?? newRecipe.votesCount,
      rating: initialRecipe?.rating ?? newRecipe.rating,
    });
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="recipe-modal-title" className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-200/80 dark:border-stone-800 p-5 sm:p-7 my-6 max-h-[92vh] overflow-y-auto text-stone-800 dark:text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200 dark:border-stone-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 font-black">
              🍲
            </div>
            <div>
              <h2 id="recipe-modal-title" className="text-base sm:text-lg font-extrabold text-amber-950 dark:text-amber-200">
                {initialRecipe ? (isArabic ? 'تعديل الوصفة الخاصة' : 'Edit Custom Recipe') : (isArabic ? 'إضافة وجبة أو وصفة خاصة جديدة' : 'Add New Custom Meal & Recipe')}
              </h2>
              <p className="text-[11px] text-stone-500">
                {isArabic
                  ? 'قم بإدخال تفاصيل الوجبة والمكونات لتظهر في الاستكشاف والجدول وقائمة التسوق تلقائياً.'
                  : 'Enter dish details, ingredients & timers to integrate with your planner & grocery list.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
          {/* Section 1: Titles & Descriptions */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700/80">
            <h3 className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>{isArabic ? '1. العنوان والوصف الرئيسي:' : '1. Title & Description:'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="recipe-title-ar" className="block mb-1 font-bold">{isArabic ? 'اسم الوجبة بالعربية *' : 'Meal Title (Arabic) *'}</label>
                <input
                  id="recipe-title-ar"
                  type="text"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  aria-invalid={Boolean(validationError && !titleAr.trim())}
                  aria-describedby={validationError ? 'recipe-validation-error' : undefined}
                  placeholder={isArabic ? 'مثال: صينية كفتة بالبطاطس' : 'e.g. Kofta with Potatoes'}
                  className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold text-amber-950 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div>
                <label htmlFor="recipe-title-en" className="block mb-1 font-bold">{isArabic ? 'الاسم بالإنجليزية *' : 'Meal Title (English) *'}</label>
                <input
                  id="recipe-title-en"
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  aria-invalid={Boolean(validationError && !titleEn.trim())}
                  aria-describedby={validationError ? 'recipe-validation-error' : undefined}
                  placeholder="Kofta with Baked Potatoes"
                  className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'وصف مختصر (عربي)' : 'Short Description (Arabic)'}</label>
                <textarea
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder={isArabic ? 'وصف مشهي للطبق وعناصره النكهية...' : 'Short appetizing description...'}
                  className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'وصف مختصر (إنجليزي)' : 'Short Description (English)'}</label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Savory spiced meat patties baked with tomato slice and garlic..."
                  className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Meal Slots, Region, Servings & Times */}
          <div className="space-y-4 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700/80">
            <h3 className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>{isArabic ? '2. نوع الوجبة والمنطقة والأوقات:' : '2. Meal Type, Region & Timings:'}</span>
            </h3>

            {/* Meal Slots Multi-Select */}
            <div>
              <label className="block mb-1.5 font-bold">{isArabic ? 'تحديد خانة الوجبة في الجدول (اختر واحدة أو أكثر):' : 'Select Applicable Meal Slots:'}</label>
              <div className="flex flex-wrap gap-1.5">
                {MEAL_SLOT_OPTIONS.map((slot) => {
                  const isSelected = mealTypes.includes(slot.id);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => toggleMealType(slot.id)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-amber-800 text-white shadow-xs'
                          : 'bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-100/50'
                      }`}
                    >
                      <span>{slot.icon}</span>
                      <span>{isArabic ? slot.labelAr : slot.labelEn}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 ms-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'المنطقة' : 'Region'}</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold"
                >
                  <option value="egypt">مصر 🇪🇬</option>
                  <option value="levant">بلاد الشام 🇱🇧</option>
                  <option value="gulf">الخليج 🇸🇦</option>
                  <option value="maghreb">المغرب العربي 🇲🇦</option>
                  <option value="general">عربي عام 🌍</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'التحضير (دقيقة)' : 'Prep (mins)'}</label>
                <input
                  type="number"
                  min="5"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'الطهي (دقيقة)' : 'Cook (mins)'}</label>
                <input
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'عدد الأفراد' : 'Servings'}</label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'الصعوبة' : 'Difficulty'}</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold"
                >
                  <option value="easy">{isArabic ? 'سهل' : 'Easy'}</option>
                  <option value="medium">{isArabic ? 'متوسط' : 'Medium'}</option>
                  <option value="hard">{isArabic ? 'صعب' : 'Hard'}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-200/60 dark:border-stone-700/60">
              <label className="flex items-center gap-2 cursor-pointer font-extrabold text-amber-900 dark:text-amber-200">
                <input
                  type="checkbox"
                  checked={isRamadanSpecial}
                  onChange={(e) => setIsRamadanSpecial(e.target.checked)}
                  className="w-4 h-4 text-amber-700 rounded-md focus:ring-amber-500"
                />
                <span>{isArabic ? 'وجبة رمضانية خاصة 🌙' : 'Ramadan Special Recipe 🌙'}</span>
              </label>

              <div className="flex-1 min-w-[200px]">
                <label className="block mb-1 font-bold">{isArabic ? 'الوسوم (مفصولة بفواصل)' : 'Tags (comma separated)'}</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="وصفة خاصة, عائلية, سريع"
                  className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
            </div>
            <div className="border-t border-amber-200/60 pt-3 dark:border-stone-700/60">
              <p className="mb-2 font-bold">{isArabic ? 'الوسوم الغذائية الإرشادية:' : 'Informational dietary tags:'}</p>
              <div className="flex flex-wrap gap-2">
                {DIETARY_TAGS.map((tag) => {
                  const labels: Record<DietaryTag, { ar: string; en: string }> = {
                    vegetarian: { ar: 'نباتي', en: 'Vegetarian' },
                    vegan: { ar: 'نباتي صرف', en: 'Vegan' },
                    'gluten-free': { ar: 'خالٍ من الغلوتين', en: 'Gluten-free' },
                    'dairy-free': { ar: 'خالٍ من الألبان', en: 'Dairy-free' },
                    'nut-free': { ar: 'خالٍ من المكسرات', en: 'Nut-free' },
                    spicy: { ar: 'حار', en: 'Spicy' },
                  };
                  return <label key={tag} className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 dark:bg-stone-900"><input type="checkbox" checked={dietaryTags.includes(tag)} onChange={(event) => setDietaryTags(event.target.checked ? [...dietaryTags, tag] : dietaryTags.filter((candidate) => candidate !== tag))} />{isArabic ? labels[tag].ar : labels[tag].en}</label>;
                })}
              </div>
              <p className="mt-2 text-[11px] text-stone-500">{isArabic ? 'تحقق دائماً من المكونات والحساسيات.' : 'Always verify ingredients and allergens.'}</p>
            </div>
          </div>

          {/* Section 3: Photo & Media */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700/80">
            <h3 className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-700" />
              <span>{isArabic ? '3. صورة الوجبة (اختر من الصور الجاهزة أو ادخل رابطك الخاص):' : '3. Recipe Cover Photo (Select Preset or Custom URL):'}</span>
            </h3>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setImageUrl(preset.url)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                    imageUrl === preset.url
                      ? 'border-amber-700 ring-2 ring-amber-600/40'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/recipe-placeholder.svg';
                    }}
                    referrerPolicy="no-referrer"
                    className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-stone-900/40 flex items-end p-1">
                    <span className="text-[10px] font-bold text-white leading-tight">
                      {isArabic ? preset.labelAr : preset.labelEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block mb-1 font-bold">{isArabic ? 'رابط الصورة الرئيسية للطبق (URL)' : 'Primary Main Image URL'}</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600 font-mono text-[11px]"
              />
            </div>

            {/* Extra Catalog Images */}
            <div className="pt-2 border-t border-amber-200/60 dark:border-stone-700/60">
              <label className="block mb-1 font-bold text-amber-900 dark:text-amber-200">
                {isArabic ? 'إضافة صور إضافية لكتالوج الوجبة (اختياري - حتى 3 صور إضافية):' : 'Additional Catalog Images (Optional - up to 3 extra images):'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                <input
                  type="text"
                  value={extraImage1}
                  onChange={(e) => setExtraImage1(e.target.value)}
                  placeholder={isArabic ? 'رابط صورة إضافية 1' : 'Extra Image 1 URL'}
                  className="p-2 rounded-xl border border-amber-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-[10px]"
                />
                <input
                  type="text"
                  value={extraImage2}
                  onChange={(e) => setExtraImage2(e.target.value)}
                  placeholder={isArabic ? 'رابط صورة إضافية 2' : 'Extra Image 2 URL'}
                  className="p-2 rounded-xl border border-amber-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-[10px]"
                />
                <input
                  type="text"
                  value={extraImage3}
                  onChange={(e) => setExtraImage3(e.target.value)}
                  placeholder={isArabic ? 'رابط صورة إضافية 3' : 'Extra Image 3 URL'}
                  className="p-2 rounded-xl border border-amber-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-[10px]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Cultural Story / Heritage */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700/80">
            <h3 className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>{isArabic ? '4. قصة وتراث الوجبة (اختياري):' : '4. Dish Heritage & Story (Optional):'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'القصة بالعربية' : 'Story in Arabic'}</label>
                <textarea
                  rows={2}
                  value={storyAr}
                  onChange={(e) => setStoryAr(e.target.value)}
                  placeholder="سر الوصفة العائلية أو تاريخ وأصل الطبق..."
                  className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold">{isArabic ? 'القصة بالإنجليزية' : 'Story in English'}</label>
                <textarea
                  rows={2}
                  value={storyEn}
                  onChange={(e) => setStoryEn(e.target.value)}
                  placeholder="Family secret heritage or origin story of the meal..."
                  className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Ingredients with Aisle Classification */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>{isArabic ? '5. المكونات والمقادير (تجمع تلقائياً بقائمة التسوق):' : '5. Ingredients & Quantities (Aggregated in Grocery List):'}</span>
              </h3>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-3 py-1.5 rounded-xl bg-amber-800 text-white font-bold text-xs flex items-center gap-1 hover:bg-amber-900 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'مكون جديد' : 'Add Ingredient'}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-700 grid grid-cols-12 gap-1.5 items-center">
                  <input
                    type="text"
                    value={ing.nameAr}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].nameAr = e.target.value;
                      if (!updated[idx].nameEn) updated[idx].nameEn = e.target.value;
                      setIngredients(updated);
                    }}
                    placeholder={isArabic ? 'المكون (مثال: لحم ضأن)' : 'Ingredient name'}
                    className="col-span-5 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold"
                  />

                  <input
                    type="number"
                    value={ing.amount}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].amount = Number(e.target.value);
                      setIngredients(updated);
                    }}
                    className="col-span-2 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono font-bold"
                  />

                  <select
                    value={ing.unitAr}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].unitAr = e.target.value;
                      updated[idx].unitEn = e.target.value;
                      setIngredients(updated);
                    }}
                    className="col-span-2 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-[11px] font-bold"
                  >
                    <option value="جرام">جرام</option>
                    <option value="كجم">كجم</option>
                    <option value="مل">مل</option>
                    <option value="لتر">لتر</option>
                    <option value="كوب">كوب</option>
                    <option value="ملعقة">ملعقة</option>
                    <option value="فصوص">فصوص</option>
                    <option value="حبة">حبة</option>
                    <option value="قطع">قطع</option>
                  </select>

                  <select
                    value={ing.aisle}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].aisle = e.target.value as IngredientAisle;
                      setIngredients(updated);
                    }}
                    className="col-span-2 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-[10px] font-bold"
                  >
                    <option value="produce">خضار وفواكه 🥦</option>
                    <option value="meat">لحوم وطيور 🥩</option>
                    <option value="dairy">ألبان وجبن 🧀</option>
                    <option value="pantry">بقالة وبهارات 🧂</option>
                    <option value="bakery">مخبوزات 🍞</option>
                    <option value="frozen">مجمدات 🧊</option>
                    <option value="other">أخرى 📦</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="col-span-1 p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Instructions / Preparation Steps */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-amber-900 dark:text-amber-300">
                {isArabic ? '6. خطوات التحضير والطهي (خطوة بخطوة):' : '6. Cooking Instructions (Step-by-Step):'}
              </h3>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-3 py-1.5 rounded-xl bg-amber-800 text-white font-bold text-xs flex items-center gap-1 hover:bg-amber-900 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'خطوة جديدة' : 'Add Step'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {instructionsAr.map((inst, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-stone-700 text-amber-900 dark:text-amber-200 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={inst}
                    onChange={(e) => {
                      const updated = [...instructionsAr];
                      updated[idx] = e.target.value;
                      setInstructionsAr(updated);
                      // sync english if empty
                      if (!instructionsEn[idx]) {
                        const updatedEn = [...instructionsEn];
                        updatedEn[idx] = e.target.value;
                        setInstructionsEn(updatedEn);
                      }
                    }}
                    placeholder={isArabic ? `اكتب تفاصيل الخطوة رقم ${idx + 1}...` : `Step ${idx + 1} description...`}
                    className="flex-1 p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold"
                  />
                  {instructionsAr.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Interactive Cooking Timers */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>{isArabic ? '7. مؤقتات طهي تفاعلية للوصفة (مؤقت بالدقائق):' : '7. Interactive Recipe Timers (Step Timers in Minutes):'}</span>
              </h3>
              <button
                type="button"
                onClick={handleAddTimerStep}
                className="px-3 py-1.5 rounded-xl bg-amber-800 text-white font-bold text-xs flex items-center gap-1 hover:bg-amber-900 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'مؤقت جديد' : 'Add Timer'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {timerSteps.map((ts, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-white dark:bg-stone-900 rounded-xl border border-amber-200 dark:border-stone-700">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 min-w-[60px]">
                    {isArabic ? `مؤقت ${idx + 1}` : `Timer ${idx + 1}`}
                  </span>
                  <input
                    type="text"
                    value={ts.titleAr}
                    onChange={(e) => {
                      const updated = [...timerSteps];
                      updated[idx].titleAr = e.target.value;
                      updated[idx].titleEn = e.target.value;
                      setTimerSteps(updated);
                    }}
                    placeholder={isArabic ? 'اسم الخطوة المؤقتة (مثال: سلق الأرز)' : 'Timer Step Name'}
                    className="flex-1 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      value={ts.durationMinutes}
                      onChange={(e) => {
                        const updated = [...timerSteps];
                        updated[idx].durationMinutes = Number(e.target.value);
                        setTimerSteps(updated);
                      }}
                      className="w-16 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono font-bold"
                    />
                    <span className="text-stone-500 text-[11px] font-bold me-1">{isArabic ? 'دقيقة' : 'm'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTimerStep(idx)}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-amber-200 dark:border-stone-800 flex items-center justify-between">
            {validationError && <p id="recipe-validation-error" role="alert" className="max-w-sm text-rose-700 dark:text-rose-300">{validationError}</p>}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 font-bold hover:bg-stone-300 text-stone-800 dark:text-stone-200"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold flex items-center gap-2 shadow-lg shadow-amber-900/20 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? (isArabic ? 'جارٍ الحفظ...' : 'Saving...') : (initialRecipe ? (isArabic ? 'حفظ التعديلات' : 'Save changes') : (isArabic ? 'حفظ الوجبة في المكتبة والجدول' : 'Save Meal to Treasury'))}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
