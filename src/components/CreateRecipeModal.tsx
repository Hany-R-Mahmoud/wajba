import React, { useState } from 'react';
import { Ingredient, IngredientAisle, Language, Recipe, Region } from '../types';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface CreateRecipeModalProps {
  onClose: () => void;
  language: Language;
  onSaveRecipe: (recipe: Recipe) => void;
}

export const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
  onClose,
  language,
  onSaveRecipe,
}) => {
  const isArabic = language === 'ar';

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [region, setRegion] = useState<Region>('egypt');
  const [prepTime, setPrepTime] = useState(20);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [imageUrl, setImageUrl] = useState('');
  const [storyAr, setStoryAr] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'c_1', nameAr: 'أرز مصري', nameEn: 'Egyptian Rice', amount: 300, unitAr: 'جرام', unitEn: 'g', aisle: 'pantry' },
  ]);

  const [instructionsAr, setInstructionsAr] = useState<string[]>([
    'اغسل المكونات جيداً وطهيها على نار هادئة.',
  ]);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) return;

    const newRecipe: Recipe = {
      id: `custom_${Date.now()}`,
      titleAr,
      titleEn: titleEn || titleAr,
      descriptionAr,
      descriptionEn: descriptionEn || descriptionAr,
      region,
      mealType: ['lunch', 'dinner'],
      prepTimeMinutes: Number(prepTime),
      cookTimeMinutes: Number(cookTime),
      servings: Number(servings),
      difficulty,
      tags: ['وصفة خاصة', 'عائلية'],
      image: imageUrl || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
      storyAr,
      ingredients,
      instructionsAr,
      instructionsEn: instructionsAr,
      votesCount: { likes: 1, dislikes: 0 },
      rating: 5.0,
      isCustom: true,
    };

    onSaveRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-200/80 dark:border-stone-800 p-6 my-8 max-h-[90vh] overflow-y-auto text-stone-800 dark:text-stone-100">
        <div className="flex items-center justify-between pb-4 border-b border-amber-200 dark:border-stone-800 mb-4">
          <h2 className="text-lg font-bold text-amber-950 dark:text-amber-200">
            {isArabic ? 'إضافة وصفة خاصة جديدة 🍳' : 'Add Custom Heritage Recipe 🍳'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold">{isArabic ? 'اسم الوصفة بالعربية *' : 'Recipe Title (Arabic) *'}</label>
              <input
                required
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: كفتة داوود باشا بالصلصة"
                className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
            <div>
              <label className="block mb-1 font-bold">{isArabic ? 'الاسم بالإنجليزية' : 'Recipe Title (English)'}</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Dawood Basha Meatballs"
                className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold">{isArabic ? 'وصف قصير' : 'Short Description'}</label>
            <textarea
              rows={2}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="وصف مشهي للطبق وعناصره الرئيسية..."
              className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block mb-1 font-bold">{isArabic ? 'المنطقة' : 'Region'}</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
              >
                <option value="egypt">مصر 🇪🇬</option>
                <option value="levant">بلاد الشام 🇱🇧</option>
                <option value="gulf">الخليج 🇸🇦</option>
                <option value="maghreb">المغرب العربي 🇲🇦</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-bold">{isArabic ? 'وقت التحضير (دقيقة)' : 'Prep Time (m)'}</label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold">{isArabic ? 'وقت الطهي (دقيقة)' : 'Cook Time (m)'}</label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold">{isArabic ? 'الأشخاص' : 'Servings'}</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-amber-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold">{isArabic ? 'رابط الصورة (اختياري)' : 'Image URL (optional)'}</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            />
          </div>

          {/* Ingredients Form */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="font-extrabold text-amber-900 dark:text-amber-300">{isArabic ? 'المكونات:' : 'Ingredients:'}</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إضافة مكون' : 'Add Ingredient'}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ing.nameAr}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].nameAr = e.target.value;
                      updated[idx].nameEn = e.target.value;
                      setIngredients(updated);
                    }}
                    placeholder={isArabic ? 'اسم المكون (مثال: لحم مفروم)' : 'Item name'}
                    className="flex-1 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                  <input
                    type="number"
                    value={ing.amount}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].amount = Number(e.target.value);
                      setIngredients(updated);
                    }}
                    className="w-16 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                  <select
                    value={ing.unitAr}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].unitAr = e.target.value;
                      updated[idx].unitEn = e.target.value;
                      setIngredients(updated);
                    }}
                    className="w-20 p-2 rounded-lg border border-amber-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  >
                    <option value="جرام">جرام</option>
                    <option value="كجم">كجم</option>
                    <option value="مل">مل</option>
                    <option value="لتر">لتر</option>
                    <option value="حبة">حبة</option>
                    <option value="ملعقة">ملعقة</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-amber-200 dark:border-stone-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 font-bold"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isArabic ? 'حفظ الوصفة' : 'Save Recipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
