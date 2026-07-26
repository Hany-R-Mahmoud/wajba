import {
  ActiveTimer,
  DIETARY_TAGS,
  GroceryItem,
  MonthlyPlan,
  PantryItem,
  Recipe,
  WeeklyPlan,
  WajbaBackup,
  WajbaBackupState,
} from '../types';
import { INITIAL_RECIPES } from '../data/recipes';

export const STORAGE_KEYS = {
  LANGUAGE: 'wajba_language',
  THEME: 'wajba_theme',
  FAVORITES: 'wajba_favorites',
  VOTES: 'wajba_votes',
  CUSTOM_RECIPES: 'wajba_custom_recipes',
  WEEKLY_PLAN: 'wajba_weekly_plan',
  MONTHLY_PLAN: 'wajba_monthly_plan',
  GROCERY_CHECKED: 'wajba_grocery_checked',
  GROCERY_EXTRAS: 'wajba_grocery_extras',
  ACTIVE_TIMERS: 'wajba_active_timers',
  PANTRY_ITEMS: 'wajba_pantry_items',
  GOOGLE_SHEETS_CONFIG: 'wajba_sheets_config',
};

const MONTHLY_PLAN_PREFIX = `${STORAGE_KEYS.MONTHLY_PLAN}_`;

export const DEFAULT_WEEKLY_PLAN: WeeklyPlan = {
  id: 'current_plan',
  name: 'جدول العائلة الأسبوعي',
  isRamadanMode: false,
  updatedAt: new Date().toISOString(),
  days: [
    { dayId: 'sat', dayNameAr: 'السبت', dayNameEn: 'Saturday', slots: {} },
    { dayId: 'sun', dayNameAr: 'الأحد', dayNameEn: 'Sunday', slots: {} },
    { dayId: 'mon', dayNameAr: 'الإثنين', dayNameEn: 'Monday', slots: {} },
    { dayId: 'tue', dayNameAr: 'الثلاثاء', dayNameEn: 'Tuesday', slots: {} },
    { dayId: 'wed', dayNameAr: 'الأربعاء', dayNameEn: 'Wednesday', slots: {} },
    { dayId: 'thu', dayNameAr: 'الخميس', dayNameEn: 'Thursday', slots: {} },
    { dayId: 'fri', dayNameAr: 'الجمعة', dayNameEn: 'Friday', slots: {} },
  ],
};

// Seed initial meal plan with iconic Egyptian/Arabic dishes so the user gets a vibrant filled experience immediately
export function getInitialWeeklyPlanWithSeed(): WeeklyPlan {
  const plan: WeeklyPlan = JSON.parse(JSON.stringify(DEFAULT_WEEKLY_PLAN));
  // Sat: Ful Medames & Ta'ameya breakfast, Macarona Beamel lunch
  plan.days[0].slots.breakfast = { recipeId: 'egypt-taameya-ful', servings: 4 };
  plan.days[0].slots.lunch = { recipeId: 'egypt-macarona-beamel', servings: 6 };

  // Sun: Shakshuka breakfast, Macarona Beamel dinner
  plan.days[1].slots.breakfast = { recipeId: 'arabic-shakshuka', servings: 4 };
  plan.days[1].slots.dinner = { recipeId: 'egypt-macarona-beamel', servings: 8 };

  // Mon: Alexandrian Liver dinner
  plan.days[2].slots.dinner = { recipeId: 'egypt-alex-liver', servings: 4 };

  // Tue: Hawawshi lunch
  plan.days[3].slots.lunch = { recipeId: 'egypt-hawawshi', servings: 4 };

  // Wed: Molokhia lunch
  plan.days[4].slots.lunch = { recipeId: 'egypt-molokhia', servings: 4 };

  // Thu: Kabsa dinner, Om Ali dessert
  plan.days[5].slots.dinner = { recipeId: 'gulf-kabsa', servings: 6 };
  plan.days[5].slots.dessert = { recipeId: 'egypt-om-ali', servings: 6 };

  // Fri: Fatteh lunch
  plan.days[6].slots.lunch = { recipeId: 'egypt-fatteh', servings: 6 };

  return plan;
}

export function loadStoredLanguage(): 'ar' | 'en' {
  const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  return (saved as 'ar' | 'en') || 'ar';
}

export function saveStoredLanguage(lang: 'ar' | 'en') {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

export function loadStoredTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  return (saved as 'light' | 'dark') || 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark') {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function loadFavorites(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : ['egypt-macarona-beamel', 'egypt-fatteh', 'egypt-molokhia'];
  } catch {
    return ['egypt-macarona-beamel', 'egypt-fatteh'];
  }
}

export function saveFavorites(favorites: string[]) {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

export function loadVotes(): { [recipeId: string]: 'like' | 'dislike' } {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.VOTES);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveVote(recipeId: string, voteType: 'like' | 'dislike') {
  const votes = loadVotes();
  votes[recipeId] = voteType;
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
}

export function loadCustomRecipes(): Recipe[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_RECIPES);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCustomRecipe(recipe: Recipe): Recipe[] {
  const current = loadCustomRecipes();
  const updated = [recipe, ...current.filter((r) => r.id !== recipe.id)];
  localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(updated));
  return updated;
}

export function deleteCustomRecipe(recipeId: string): Recipe[] {
  const updated = loadCustomRecipes().filter((recipe) => recipe.id !== recipeId);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(updated));
  return updated;
}

export function decodePlanFromUrl(encodedStr: string): WeeklyPlan | null {
  try {
    const decodedParam = decodeURIComponent(encodedStr);

    // Attempt 1: Standard Base64 of UTF-8 Bytes
    try {
      const binary = atob(decodedParam);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.days)) {
        return parsed as WeeklyPlan;
      }
    } catch {
      // Ignore and try fallback
    }

    // Attempt 2: Base64 of percent-encoded UTF-8
    try {
      const binary = atob(decodedParam);
      const jsonStr = decodeURIComponent(binary);
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.days)) {
        return parsed as WeeklyPlan;
      }
    } catch {
      // Ignore and try fallback
    }

    // Attempt 3: Direct JSON parameter
    try {
      const parsed = JSON.parse(decodedParam);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.days)) {
        return parsed as WeeklyPlan;
      }
    } catch {
      // Ignore
    }
  } catch (e) {
    console.warn('Failed to decode plan from URL', e);
  }
  return null;
}

export function loadWeeklyPlan(): WeeklyPlan {
  try {
    // Check if URL has shared encoded plan first!
    const urlParams = new URLSearchParams(window.location.search);
    const sharedPlan = urlParams.get('plan');
    if (sharedPlan) {
      const decoded = decodePlanFromUrl(sharedPlan);
      if (decoded) {
        saveWeeklyPlan(decoded);
        // clean URL param gracefully
        window.history.replaceState({}, document.title, window.location.pathname);
        return decoded;
      }
    }

    const saved = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  const initialSeeded = getInitialWeeklyPlanWithSeed();
  saveWeeklyPlan(initialSeeded);
  return initialSeeded;
}

export function saveWeeklyPlan(plan: WeeklyPlan) {
  plan.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(plan));
}

export function encodePlanToUrl(plan: WeeklyPlan): string {
  try {
    const jsonStr = JSON.stringify(plan);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const b64 = btoa(binary);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?plan=${encodeURIComponent(b64)}`;
  } catch (e) {
    console.error('Failed to encode plan to URL', e);
    return window.location.href;
  }
}

export function loadGroceryCheckedIds(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GROCERY_CHECKED);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveGroceryCheckedIds(checkedIds: string[]) {
  localStorage.setItem(STORAGE_KEYS.GROCERY_CHECKED, JSON.stringify(checkedIds));
}

export function loadGroceryExtras(): GroceryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GROCERY_EXTRAS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveGroceryExtras(extras: GroceryItem[]) {
  localStorage.setItem(STORAGE_KEYS.GROCERY_EXTRAS, JSON.stringify(extras));
}

export function loadActiveTimers(): ActiveTimer[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TIMERS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveActiveTimers(timers: ActiveTimer[]) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMERS, JSON.stringify(timers));
}

export function loadPantryItems(): PantryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PANTRY_ITEMS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function savePantryItems(items: PantryItem[]) {
  localStorage.setItem(STORAGE_KEYS.PANTRY_ITEMS, JSON.stringify(items));
}

export function getInitialMonthlyPlanWithSeed(year: number, month: number): MonthlyPlan {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: MonthlyPlan['days'] = {};

  // Sample recipe IDs to distribute nicely
  const sampleRecipes = [
    'egypt-macarona-beamel',
    'egypt-fatteh',
    'egypt-molokhia',
    'arabic-shakshuka',
    'egypt-hawawshi',
    'gulf-kabsa',
    'levant-mansaf',
    'egypt-alex-liver',
    'egypt-taameya-ful',
    'egypt-om-ali',
    'levant-hummus-falafel',
  ];

  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    const dateObj = new Date(year, month, d);
    const dayOfWeek = dateObj.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat

    const slots: MonthlyPlan['days'][string]['slots'] = {};

    // Friday = Fatteh or Kabsa
    if (dayOfWeek === 5) {
      slots.lunch = { recipeId: d % 2 === 0 ? 'egypt-fatteh' : 'gulf-kabsa', servings: 6 };
    }
    // Saturday = Macarona Beamel or Alexandria Liver
    else if (dayOfWeek === 6) {
      slots.lunch = { recipeId: d % 2 === 0 ? 'egypt-macarona-beamel' : 'egypt-alex-liver', servings: 4 };
    }
    // Sunday = Shakshuka breakfast, Macarona Beamel dinner
    else if (dayOfWeek === 0) {
      slots.breakfast = { recipeId: 'arabic-shakshuka', servings: 4 };
      if (d % 3 === 0) slots.dinner = { recipeId: 'egypt-macarona-beamel', servings: 6 };
    }
    // Tuesday = Molokhia
    else if (dayOfWeek === 2) {
      slots.lunch = { recipeId: 'egypt-molokhia', servings: 4 };
    }
    // Thursday = Hawawshi or Mansaf
    else if (dayOfWeek === 4) {
      slots.dinner = { recipeId: d % 2 === 0 ? 'egypt-hawawshi' : 'levant-mansaf', servings: 4 };
    }

    days[dateKey] = { slots };
  }

  return {
    id: `monthly_${year}_${month}`,
    year,
    month,
    isRamadanMode: false,
    days,
    updatedAt: new Date().toISOString(),
  };
}

export function loadMonthlyPlan(year?: number, month?: number): MonthlyPlan {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  const key = `${STORAGE_KEYS.MONTHLY_PLAN}_${y}_${m}`;

  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }

  const initial = getInitialMonthlyPlanWithSeed(y, m);
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

export function saveMonthlyPlan(plan: MonthlyPlan) {
  plan.updatedAt = new Date().toISOString();
  const key = `${STORAGE_KEYS.MONTHLY_PLAN}_${plan.year}_${plan.month}`;
  localStorage.setItem(key, JSON.stringify(plan));
}

export function loadAllMonthlyPlans(): MonthlyPlan[] {
  const plans: MonthlyPlan[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(MONTHLY_PLAN_PREFIX)) continue;

    const value = localStorage.getItem(key);
    if (!value) continue;

    try {
      const plan: unknown = JSON.parse(value);
      if (isMonthlyPlan(plan)) plans.push(plan);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
  }

  return plans;
}

export function createWajbaBackup(state: WajbaBackupState): WajbaBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'Wajba',
    state,
  };
}

export function parseWajbaBackup(value: unknown): WajbaBackup | null {
  if (!isRecord(value) || value.version !== 1 || value.app !== 'Wajba' || !isRecord(value.state)) {
    return null;
  }

  const state = value.state;
  if (
    (state.language !== 'ar' && state.language !== 'en') ||
    (state.theme !== 'light' && state.theme !== 'dark') ||
    !Array.isArray(state.favorites) ||
    !state.favorites.every((item): item is string => typeof item === 'string') ||
    !isVotes(state.votes) ||
    !Array.isArray(state.customRecipes) ||
    !state.customRecipes.every(isRecipe) ||
    !isWeeklyPlan(state.weeklyPlan) ||
    !Array.isArray(state.monthlyPlans) ||
    !state.monthlyPlans.every(isMonthlyPlan) ||
    !Array.isArray(state.groceryCheckedIds) ||
    !state.groceryCheckedIds.every((item): item is string => typeof item === 'string') ||
    !Array.isArray(state.groceryExtras) ||
    !state.groceryExtras.every(isGroceryItem) ||
    !Array.isArray(state.pantryItems) ||
    !state.pantryItems.every(isPantryItem)
  ) {
    return null;
  }

  return {
    version: 1,
    exportedAt: typeof value.exportedAt === 'string' ? value.exportedAt : new Date().toISOString(),
    app: 'Wajba',
    state: {
      language: state.language,
      theme: state.theme,
      favorites: state.favorites,
      votes: state.votes,
      customRecipes: state.customRecipes,
      weeklyPlan: state.weeklyPlan,
      monthlyPlans: state.monthlyPlans,
      groceryCheckedIds: state.groceryCheckedIds,
      groceryExtras: state.groceryExtras,
      pantryItems: state.pantryItems,
    },
  };
}

export function createCurrentWajbaBackup(): WajbaBackup {
  return createWajbaBackup({
    language: loadStoredLanguage(),
    theme: loadStoredTheme(),
    favorites: loadFavorites(),
    votes: loadVotes(),
    customRecipes: loadCustomRecipes(),
    weeklyPlan: loadWeeklyPlan(),
    monthlyPlans: loadAllMonthlyPlans(),
    groceryCheckedIds: loadGroceryCheckedIds(),
    groceryExtras: loadGroceryExtras(),
    pantryItems: loadPantryItems(),
  });
}

export function replaceWajbaState(state: WajbaBackupState) {
  const previousState = createCurrentWajbaBackup().state;
  try {
    writeWajbaState(state);
  } catch (error) {
    try {
      writeWajbaState(previousState);
    } catch (rollbackError) {
      if (rollbackError instanceof Error) throw rollbackError;
      throw error;
    }
    throw error;
  }
}

function writeWajbaState(state: WajbaBackupState) {
  saveStoredLanguage(state.language);
  saveStoredTheme(state.theme);
  saveFavorites(state.favorites);
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(state.votes));
  localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(state.customRecipes));
  saveWeeklyPlan(state.weeklyPlan);
  saveGroceryCheckedIds(state.groceryCheckedIds);
  saveGroceryExtras(state.groceryExtras);
  savePantryItems(state.pantryItems);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMERS);

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(MONTHLY_PLAN_PREFIX)) localStorage.removeItem(key);
  }
  state.monthlyPlans.forEach(saveMonthlyPlan);
}

export function clearWajbaUserData() {
  const keysToRemove = Object.values(STORAGE_KEYS);
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(MONTHLY_PLAN_PREFIX)) localStorage.removeItem(key);
  }
}

export function detectStorageIssues(): string | null {
  const ignoredKeys = new Set([STORAGE_KEYS.LANGUAGE, STORAGE_KEYS.THEME]);
  const wajbaKeys = new Set(Object.values(STORAGE_KEYS));

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || ignoredKeys.has(key) || (!wajbaKeys.has(key) && !key.startsWith(MONTHLY_PLAN_PREFIX))) continue;
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) continue;

    try {
      JSON.parse(rawValue);
    } catch (error) {
      if (error instanceof SyntaxError) return key;
      throw error;
    }
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isVotes(value: unknown): value is { [recipeId: string]: 'like' | 'dislike' } {
  if (!isRecord(value)) return false;
  return Object.values(value).every((vote) => vote === 'like' || vote === 'dislike');
}

function isVoteCounts(value: unknown): boolean {
  return isRecord(value) && isNonNegativeNumber(value.likes) && isNonNegativeNumber(value.dislikes);
}

function isRecipe(value: unknown): value is Recipe {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    isString(value.titleAr) &&
    isString(value.titleEn) &&
    isString(value.descriptionAr) &&
    isString(value.descriptionEn) &&
    isRegion(value.region) &&
    Array.isArray(value.mealType) &&
    value.mealType.every(isMealSlot) &&
    isNonNegativeNumber(value.prepTimeMinutes) &&
    isNonNegativeNumber(value.cookTimeMinutes) &&
    isPositiveNumber(value.servings) &&
    isDifficulty(value.difficulty) &&
    Array.isArray(value.tags) &&
    value.tags.every(isString) &&
    (value.dietaryTags === undefined || (Array.isArray(value.dietaryTags) && value.dietaryTags.every(isDietaryTag))) &&
    isString(value.image) &&
    Array.isArray(value.ingredients) &&
    value.ingredients.every(isIngredient) &&
    isStringArray(value.instructionsAr) &&
    isStringArray(value.instructionsEn) &&
    isVoteCounts(value.votesCount) &&
    isNonNegativeNumber(value.rating)
  );
}

function isWeeklyPlan(value: unknown): value is WeeklyPlan {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    typeof value.isRamadanMode === 'boolean' &&
    isString(value.updatedAt) &&
    Array.isArray(value.days) &&
    value.days.every(isDayPlanner)
  );
}

function isMonthlyPlan(value: unknown): value is MonthlyPlan {
  return (
    isRecord(value) &&
    isString(value.id) &&
    Number.isInteger(value.year) &&
    typeof value.month === 'number' &&
    value.month >= 0 &&
    value.month <= 11 &&
    typeof value.isRamadanMode === 'boolean' &&
    isString(value.updatedAt) &&
    isRecord(value.days) &&
    Object.values(value.days).every(isMonthDayPlan)
  );
}

function isGroceryItem(value: unknown): value is GroceryItem {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.nameAr) &&
    isString(value.nameEn) &&
    isNonNegativeNumber(value.amount) &&
    isString(value.unitAr) &&
    isString(value.unitEn) &&
    isAisle(value.aisle) &&
    typeof value.isChecked === 'boolean' &&
    isStringArray(value.recipeSources)
  );
}

function isPantryItem(value: unknown): value is PantryItem {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.nameAr) &&
    isString(value.nameEn) &&
    isPositiveNumber(value.amount) &&
    isString(value.unitAr) &&
    isString(value.unitEn) &&
    isAisle(value.aisle) &&
    isString(value.updatedAt)
  );
}

function isIngredient(value: unknown): boolean {
  return isRecord(value) && isString(value.id) && isString(value.nameAr) && isString(value.nameEn) && isPositiveNumber(value.amount) && isString(value.unitAr) && isString(value.unitEn) && isAisle(value.aisle);
}

function isDayPlanner(value: unknown): boolean {
  return isRecord(value) && isString(value.dayId) && isString(value.dayNameAr) && isString(value.dayNameEn) && isSlotMap(value.slots);
}

function isMonthDayPlan(value: unknown): boolean {
  return isRecord(value) && isSlotMap(value.slots) && (value.notes === undefined || isString(value.notes));
}

function isSlotMap(value: unknown): boolean {
  return isRecord(value) && Object.values(value).every((assignment) => assignment === undefined || isDayMealSlotAssignment(assignment));
}

function isDayMealSlotAssignment(value: unknown): boolean {
  return isRecord(value) && isString(value.recipeId) && isPositiveNumber(value.servings) && (value.customNote === undefined || isString(value.customNote));
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isRegion(value: unknown): boolean {
  return value === 'egypt' || value === 'levant' || value === 'gulf' || value === 'maghreb' || value === 'general';
}

function isMealSlot(value: unknown): boolean {
  return value === 'breakfast' || value === 'lunch' || value === 'dinner' || value === 'snack' || value === 'suhoor' || value === 'iftar' || value === 'dessert';
}

function isDifficulty(value: unknown): boolean {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

function isAisle(value: unknown): boolean {
  return value === 'produce' || value === 'meat' || value === 'dairy' || value === 'pantry' || value === 'bakery' || value === 'frozen' || value === 'other';
}

function isDietaryTag(value: unknown): boolean {
  return typeof value === 'string' && DIETARY_TAGS.includes(value as (typeof DIETARY_TAGS)[number]);
}
