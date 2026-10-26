import type { Recipe, WeeklyPlan } from '../types.js';
import { parseWajbaBackup } from './storage.js';
import { INITIAL_RECIPES } from '../data/recipes.js';

export interface FamilyPlan { weeklyPlan: WeeklyPlan; customRecipes: Recipe[] }
export interface FamilyGroup {
  id: string; name: string; owner_id: string; revision: number;
  plan: FamilyPlan | null; is_owner: boolean; member_count: number;
}
export interface FamilyMember { user_id: string; name: string; is_owner: boolean }

export function referencedFamilyPlan(weeklyPlan: WeeklyPlan, customRecipes: Recipe[]): FamilyPlan {
  const ids = new Set(weeklyPlan.days.flatMap(day => Object.values(day.slots).map(slot => slot?.recipeId)));
  return { weeklyPlan, customRecipes: customRecipes.filter(recipe => ids.has(recipe.id)) };
}

// Fresh IDs preserve recipes already saved on this device.
export function prepareFamilyImport(plan: FamilyPlan, makeId: () => string): FamilyPlan {
  const ids = new Map(plan.customRecipes.map(recipe => [recipe.id, `custom-${makeId()}`]));
  return {
    customRecipes: plan.customRecipes.map(recipe => ({ ...recipe, id: ids.get(recipe.id)!, isCustom: true })),
    weeklyPlan: { ...plan.weeklyPlan, days: plan.weeklyPlan.days.map(day => ({ ...day,
      slots: Object.fromEntries(Object.entries(day.slots).map(([key, slot]) => [key,
        slot ? { ...slot, recipeId: ids.get(slot.recipeId) ?? slot.recipeId } : slot])),
    })) },
  };
}

export function parseFamilyPlan(value: unknown): FamilyPlan | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  const backup = parseWajbaBackup({ version: 1, app: 'Wajba', state: {
    language: 'en', theme: 'light', favorites: [], votes: {}, monthlyPlans: [],
    groceryCheckedIds: [], groceryExtras: [], pantryItems: [],
    weeklyPlan: candidate.weeklyPlan, customRecipes: candidate.customRecipes,
  } });
  if (!backup || backup.state.weeklyPlan.days.length !== 7) return null;
  const ids = backup.state.weeklyPlan.days.map(day => day.dayId);
  if (new Set(ids).size !== 7 || !ids.every(id => ['sat','sun','mon','tue','wed','thu','fri'].includes(id))) return null;
  const recipes = backup.state.customRecipes;
  if (new Set(recipes.map(recipe => recipe.id)).size !== recipes.length) return null;
  const known = new Set([...INITIAL_RECIPES, ...recipes].map(recipe => recipe.id));
  const slots = backup.state.weeklyPlan.days.flatMap(day => Object.entries(day.slots));
  if (!slots.every(([key, slot]) => ['breakfast','lunch','dinner','snack','suhoor','iftar','dessert'].includes(key) && slot && known.has(slot.recipeId))) return null;
  return referencedFamilyPlan(backup.state.weeklyPlan, recipes);
}
