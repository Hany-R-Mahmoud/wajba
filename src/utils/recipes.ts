import type { DietaryTag, Recipe } from '../types';

export const DIETARY_LABELS: Record<DietaryTag, { ar: string; en: string }> = {
  vegetarian: { ar: 'نباتي', en: 'Vegetarian' },
  vegan: { ar: 'نباتي صرف', en: 'Vegan' },
  'gluten-free': { ar: 'خالٍ من الغلوتين', en: 'Gluten-free' },
  'dairy-free': { ar: 'خالٍ من الألبان', en: 'Dairy-free' },
  'nut-free': { ar: 'خالٍ من المكسرات', en: 'Nut-free' },
  spicy: { ar: 'حار', en: 'Spicy' },
};

export function filterRecipesByDietaryTag(recipes: Recipe[], tag: DietaryTag | 'all'): Recipe[] {
  if (tag === 'all') return recipes;
  return recipes.filter((recipe) => recipe.dietaryTags?.includes(tag));
}
