import type { DietaryTag, Recipe } from '../types';

export const DIETARY_LABELS: Record<DietaryTag, { ar: string; en: string }> = {
  vegetarian: { ar: 'نباتي', en: 'Vegetarian' },
  vegan: { ar: 'نباتي صرف', en: 'Vegan' },
  'gluten-free': { ar: 'خالٍ من الغلوتين', en: 'Gluten-free' },
  'dairy-free': { ar: 'خالٍ من الألبان', en: 'Dairy-free' },
  'nut-free': { ar: 'خالٍ من المكسرات', en: 'Nut-free' },
  spicy: { ar: 'حار', en: 'Spicy' },
};

const MEAT_KEYWORDS = [
  'لحم', 'دجاج', 'كفتة', 'سمك', 'جمبري', 'سجق', 'كبدة', 'حمام', 'موزة', 'فراخ', 'بط', 'لحمة', 'شاورما', 'كباب', 'سجوق',
  'beef', 'chicken', 'lamb', 'mutton', 'pork', 'fish', 'shrimp', 'seafood', 'liver', 'pigeon', 'meat', 'kofta', 'shawarma', 'kabab'
];

const DAIRY_KEYWORDS = [
  'حليب', 'لبن', 'قشطة', 'جبن', 'جبنة', 'زبدة', 'سمن', 'كريمة', 'بشاميل',
  'milk', 'butter', 'cream', 'cheese', 'ghee', 'béchamel', 'bechamel', 'yogurt', 'curd'
];

const GLUTEN_KEYWORDS = [
  'مكرونة', 'دقيق', 'قمح', 'خبز', 'سميد', 'شعرية', 'برغل', 'فطير', 'كشك',
  'pasta', 'flour', 'wheat', 'bread', 'semolina', 'vermicelli', 'bulgur', 'dough', 'pastry'
];

const NUT_KEYWORDS = [
  'مكسرات', 'فسدق', 'فستق', 'لوز', 'صنوبر', 'كاجو', 'سوداني', 'جوز',
  'nuts', 'pistachio', 'almond', 'pine nut', 'cashew', 'peanut', 'walnut'
];

const SPICY_KEYWORDS = [
  'شطة', 'فلفل حار', 'فلفل أحر', 'حار', 'دقة',
  'spicy', 'chili', 'hot pepper', 'jalapeno'
];

export function getRecipeDietaryTags(recipe: Recipe): DietaryTag[] {
  if (recipe.dietaryTags && recipe.dietaryTags.length > 0) {
    return recipe.dietaryTags;
  }
  const tagsSet = new Set<DietaryTag>();
  const fullText = (
    recipe.titleAr + ' ' + recipe.titleEn + ' ' +
    recipe.descriptionAr + ' ' + recipe.descriptionEn + ' ' +
    recipe.tags.join(' ') + ' ' +
    recipe.ingredients.map((i) => `${i.nameAr} ${i.nameEn}`).join(' ')
  ).toLowerCase();

  const hasMeat = MEAT_KEYWORDS.some((k) => fullText.includes(k));
  const hasDairy = DAIRY_KEYWORDS.some((k) => fullText.includes(k));
  const hasGluten = GLUTEN_KEYWORDS.some((k) => fullText.includes(k));
  const hasNuts = NUT_KEYWORDS.some((k) => fullText.includes(k));
  const isSpicy = SPICY_KEYWORDS.some((k) => fullText.includes(k));

  if (!hasMeat) tagsSet.add('vegetarian');
  if (!hasMeat && !hasDairy) tagsSet.add('vegan');
  if (!hasGluten) tagsSet.add('gluten-free');
  if (!hasDairy) tagsSet.add('dairy-free');
  if (!hasNuts) tagsSet.add('nut-free');
  if (isSpicy) tagsSet.add('spicy');

  return Array.from(tagsSet);
}

export function filterRecipesByDietaryTag(recipes: Recipe[], tag: DietaryTag | 'all'): Recipe[] {
  if (tag === 'all') return recipes;
  return recipes.filter((recipe) => getRecipeDietaryTags(recipe).includes(tag));
}

