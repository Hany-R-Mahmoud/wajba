import { GroceryItem, Ingredient, IngredientAisle, Language, PantryItem, WeeklyPlan, MonthlyPlan, Recipe, DayMealSlotAssignment } from '../types';
import { SUBSTITUTIONS, SUBSTITUTION_VARIANT_MAP, SUBSTITUTION_SCOPE } from '../data/substitutions';
import { INITIAL_RECIPES } from '../data/recipes';

const REVERSE_VARIANT_MAP: Map<string, string> = new Map();
for (const [canonicalKey, variants] of Object.entries(SUBSTITUTION_VARIANT_MAP)) {
  for (const variant of variants) {
    REVERSE_VARIANT_MAP.set(variant, canonicalKey);
  }
}

function canonicalizeName(normalizedName: string): string {
  return REVERSE_VARIANT_MAP.get(normalizedName) ?? normalizedName;
}

function getSubstituteDisplayNames(
  canonicalTo: string,
  allRecipes: Recipe[]
): { substituteNameAr: string; substituteNameEn: string } | null {
  for (const r of allRecipes) {
    for (const ing of r.ingredients) {
      if (normalizeIngredientName(ing.nameEn) === canonicalTo) {
        return {
          substituteNameAr: ing.nameAr,
          substituteNameEn: ing.nameEn,
        };
      }
    }
  }
  for (const r of INITIAL_RECIPES) {
    for (const ing of r.ingredients) {
      if (normalizeIngredientName(ing.nameEn) === canonicalTo) {
        return {
          substituteNameAr: ing.nameAr,
          substituteNameEn: ing.nameEn,
        };
      }
    }
  }
  return null;
}

export function normalizeUnit(amount: number, unit: string): { amount: number; unitAr: string; unitEn: string } {
  const lowerUnit = unit.trim().toLowerCase();

  // Grams to Kilograms
  if (lowerUnit === 'جرام' || lowerUnit === 'g' || lowerUnit === 'gram' || lowerUnit === 'grams') {
    if (amount >= 1000) {
      return { amount: Math.round((amount / 1000) * 10) / 10, unitAr: 'كجم', unitEn: 'kg' };
    }
    return { amount, unitAr: 'جرام', unitEn: 'g' };
  }

  // Kilograms
  if (lowerUnit === 'كجم' || lowerUnit === 'كيلو' || lowerUnit === 'kg' || lowerUnit === 'kilogram') {
    return { amount, unitAr: 'كجم', unitEn: 'kg' };
  }

  // Milliliters to Liters
  if (lowerUnit === 'مل' || lowerUnit === 'ml' || lowerUnit === 'milliliter') {
    if (amount >= 1000) {
      return { amount: Math.round((amount / 1000) * 10) / 10, unitAr: 'لتر', unitEn: 'L' };
    }
    return { amount, unitAr: 'مل', unitEn: 'ml' };
  }

  // Liters
  if (lowerUnit === 'لتر' || lowerUnit === 'l' || lowerUnit === 'liter') {
    return { amount, unitAr: 'لتر', unitEn: 'L' };
  }

  // Tablespoons / Teaspoons
  if (lowerUnit.includes('ملعقة كبيرة') || lowerUnit.includes('tbsp')) {
    return { amount, unitAr: 'ملعقة كبيرة', unitEn: 'tbsp' };
  }
  if (lowerUnit.includes('ملعقة صغيرة') || lowerUnit.includes('tsp')) {
    return { amount, unitAr: 'ملعقة صغيرة', unitEn: 'tsp' };
  }

  // Pieces / Default
  return { amount, unitAr: unit, unitEn: unit };
}

export function generateGroceryListFromPlan(
  plan: WeeklyPlan | MonthlyPlan,
  allRecipes: Recipe[],
  existingCheckedIds: string[] = [],
  customExtraItems: GroceryItem[] = [],
  pantryItems: PantryItem[] = []
): GroceryItem[] {
  const mapKeyToGrocery: { [key: string]: GroceryItem } = {};

  const recipeMap = new Map<string, Recipe>();
  allRecipes.forEach((r) => recipeMap.set(r.id, r));

  const processSlotAssignment = (slotAssignment?: DayMealSlotAssignment) => {
    if (!slotAssignment) return;
    const recipe = recipeMap.get(slotAssignment.recipeId);
    if (!recipe) return;

    const scale = slotAssignment.servings / (recipe.servings || 1);

    recipe.ingredients.forEach((ing) => {
      const scaledAmount = ing.amount * scale;
      // Key based on English or Arabic lowercased name
      const key = `${normalizeIngredientName(ing.nameEn || ing.nameAr)}|${getUnitDimension(ing.unitEn || ing.unitAr)}`;

      if (mapKeyToGrocery[key]) {
        const currentItem = mapKeyToGrocery[key];
        const convertedAmount = convertAmount(scaledAmount, ing.unitEn || ing.unitAr, currentItem.unitEn);
        if (convertedAmount !== null) {
          currentItem.amount += convertedAmount;
          currentItem.requiredAmount = currentItem.amount;
        }
        if (!currentItem.recipeSources.includes(recipe.titleAr)) {
          currentItem.recipeSources.push(recipe.titleAr);
        }
      } else {
        mapKeyToGrocery[key] = {
          id: `g_${ing.id}_${key.replace(/\s+/g, '_')}`,
          nameAr: ing.nameAr,
          nameEn: ing.nameEn,
          amount: scaledAmount,
          unitAr: ing.unitAr,
          unitEn: ing.unitEn,
          aisle: ing.aisle || 'other',
          isChecked: existingCheckedIds.includes(`g_${ing.id}_${key.replace(/\s+/g, '_')}`),
          recipeSources: [recipe.titleAr],
          requiredAmount: scaledAmount,
        };
      }
    });
  };

  if ('days' in plan && Array.isArray(plan.days)) {
    // WeeklyPlan
    plan.days.forEach((day) => {
      Object.values(day.slots).forEach(processSlotAssignment);
    });
  } else if ('days' in plan && typeof plan.days === 'object') {
    // MonthlyPlan
    Object.values((plan as MonthlyPlan).days).forEach((dayPlan) => {
      Object.values(dayPlan.slots).forEach(processSlotAssignment);
    });
  }

  const recipesByTitleAr = new Map<string, Recipe[]>();
  for (const r of allRecipes) {
    const list = recipesByTitleAr.get(r.titleAr) || [];
    list.push(r);
    recipesByTitleAr.set(r.titleAr, list);
  }

  // Convert map to array and normalize amounts/units
  const aggregatedList: GroceryItem[] = Object.values(mapKeyToGrocery).map((item) => {
    const normalized = normalizeUnit(item.amount, item.unitAr);
    const requiredAmount = normalized.amount;
    const pantryAmount = pantryItems.reduce((total, pantryItem) => {
      if (normalizeIngredientName(pantryItem.nameEn || pantryItem.nameAr) !== normalizeIngredientName(item.nameEn || item.nameAr)) {
        return total;
      }

      const converted = convertAmount(pantryItem.amount, pantryItem.unitEn || pantryItem.unitAr, normalized.unitEn);
      return converted === null ? total : total + converted;
    }, 0);
    const remainingAmount = Math.max(0, requiredAmount - pantryAmount);
    const roundedRemaining = Math.round(remainingAmount * 10) / 10;
    const isCovered = roundedRemaining === 0;

    let suggestion: GroceryItem['suggestion'] = undefined;

    if (!isCovered && roundedRemaining > 0 && item.recipeSources.length > 0) {
      const itemNormName = normalizeIngredientName(item.nameEn || item.nameAr);
      const canonicalItemKey = canonicalizeName(itemNormName);

      const sourceRecipes: Recipe[] = [];
      for (const title of item.recipeSources) {
        const matches = recipesByTitleAr.get(title);
        if (matches && matches.length === 1) {
          sourceRecipes.push(matches[0]);
        }
      }

      for (const row of SUBSTITUTIONS) {
        if (row.from !== canonicalItemKey) {
          continue;
        }

        const hasAppliesToMatch = sourceRecipes.some(
          (r) => r.id.startsWith(SUBSTITUTION_SCOPE + '-') && row.appliesTo.includes(r.id)
        );
        if (!hasAppliesToMatch) {
          continue;
        }

        const breaksDietary = sourceRecipes.some((r) => {
          if (!r.dietaryTags || r.dietaryTags.length === 0) return false;
          return row.dietary.breaks.some((breakTag) => r.dietaryTags?.includes(breakTag));
        });
        if (breaksDietary) {
          continue;
        }

        let quantityCovered = false;
        if (row.confidence === 'تجريبي') {
          quantityCovered = pantryItems.some((pItem) => {
            const pNorm = normalizeIngredientName(pItem.nameEn || pItem.nameAr);
            return canonicalizeName(pNorm) === row.to && pItem.amount > 0;
          });
        } else {
          const substituteOnHand = pantryItems.reduce((total, pItem) => {
            const pNorm = normalizeIngredientName(pItem.nameEn || pItem.nameAr);
            if (canonicalizeName(pNorm) !== row.to) {
              return total;
            }
            const converted = convertAmount(pItem.amount, pItem.unitEn || pItem.unitAr, normalized.unitEn);
            return converted === null ? total : total + converted;
          }, 0);

          quantityCovered = substituteOnHand >= roundedRemaining;
        }

        if (!quantityCovered) {
          continue;
        }

        const displayNames = getSubstituteDisplayNames(row.to, allRecipes);
        if (displayNames) {
          suggestion = {
            rowId: row.id,
            substituteNameAr: displayNames.substituteNameAr,
            substituteNameEn: displayNames.substituteNameEn,
            reasonAr: row.reasonAr,
            reasonEn: row.reasonEn,
            confidence: row.confidence,
          };
          break;
        }
      }
    }

    return {
      ...item,
      amount: roundedRemaining,
      unitAr: normalized.unitAr,
      unitEn: normalized.unitEn,
      requiredAmount: Math.round(requiredAmount * 10) / 10,
      pantryAmount: Math.round(Math.min(requiredAmount, pantryAmount) * 10) / 10,
      isCovered,
      ...(suggestion ? { suggestion } : {}),
    };
  });

  // Add custom extra items
  customExtraItems.forEach((extra) => {
    aggregatedList.push({
      ...extra,
      isChecked: existingCheckedIds.includes(extra.id),
    });
  });

  return aggregatedList;
}

type UnitDimension = 'mass' | 'volume' | 'count' | 'spoon' | 'unknown';

export function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getUnitDimension(unit: string): UnitDimension {
  const lowerUnit = unit.trim().toLowerCase();
  if (['g', 'gram', 'grams', 'جرام', 'kg', 'kilogram', 'كيلو', 'كجم'].includes(lowerUnit)) return 'mass';
  if (['ml', 'milliliter', 'لتر', 'l', 'liter', 'مل'].includes(lowerUnit)) return 'volume';
  if (['tbsp', 'tsp', 'ملعقة كبيرة', 'ملعقة صغيرة'].some((item) => lowerUnit.includes(item))) return 'spoon';
  if (['pcs', 'piece', 'pieces', 'حبة', 'رغيف'].includes(lowerUnit)) return 'count';
  return 'unknown';
}

export function convertAmount(amount: number, fromUnit: string, toUnit: string): number | null {
  const from = fromUnit.trim().toLowerCase();
  const to = toUnit.trim().toLowerCase();
  const fromDimension = getUnitDimension(from);
  const toDimension = getUnitDimension(to);
  if (fromDimension !== toDimension || fromDimension === 'unknown') return from === to ? amount : null;

  if (fromDimension === 'mass') {
    const grams = ['kg', 'kilogram', 'كيلو', 'كجم'].includes(from) ? amount * 1000 : amount;
    return ['kg', 'kilogram', 'كيلو', 'كجم'].includes(to) ? grams / 1000 : grams;
  }

  if (fromDimension === 'volume') {
    const milliliters = ['l', 'liter', 'لتر'].includes(from) ? amount * 1000 : amount;
    return ['l', 'liter', 'لتر'].includes(to) ? milliliters / 1000 : milliliters;
  }

  if (fromDimension === 'spoon') {
    const teaspoons = from.includes('tbsp') || from.includes('كبيرة') ? amount * 3 : amount;
    return to.includes('tbsp') || to.includes('كبيرة') ? teaspoons / 3 : teaspoons;
  }

  return amount;
}

export const AISLE_LABELS: { [key in IngredientAisle]: { ar: string; en: string; icon: string } } = {
  produce: { ar: 'الخضار والفواكه الطازجة', en: 'Fresh Produce', icon: '🥬' },
  meat: { ar: 'اللحوم والدواجن والأسماك', en: 'Meat & Poultry', icon: '🥩' },
  dairy: { ar: 'الألبان والبيض والأجبان', en: 'Dairy & Eggs', icon: '🧀' },
  pantry: { ar: 'العطارة والتوابل والمؤن', en: 'Pantry & Spices', icon: '🧄' },
  bakery: { ar: 'المخبوزات والخبز', en: 'Bakery & Bread', icon: '🍞' },
  frozen: { ar: 'الأطعمة المجمدة', en: 'Frozen Foods', icon: '🧊' },
  other: { ar: 'مستلزمات أخرى', en: 'Other Essentials', icon: '🛍️' },
};
