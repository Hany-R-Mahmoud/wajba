import { ActiveTimer, GroceryItem, MonthlyPlan, Recipe, WeeklyPlan } from '../types';
import { INITIAL_RECIPES } from '../data/recipes';

const STORAGE_KEYS = {
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
  GOOGLE_SHEETS_CONFIG: 'wajba_sheets_config',
};

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

export function loadWeeklyPlan(): WeeklyPlan {
  try {
    // Check if URL has shared encoded plan first!
    const urlParams = new URLSearchParams(window.location.search);
    const sharedPlan = urlParams.get('plan');
    if (sharedPlan) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(sharedPlan)));
        if (decoded && decoded.days) {
          saveWeeklyPlan(decoded);
          // clean URL param gracefully
          window.history.replaceState({}, document.title, window.location.pathname);
          return decoded;
        }
      } catch (e) {
        console.warn('Failed to parse shared URL plan', e);
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
    const b64 = btoa(encodeURIComponent(jsonStr));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?plan=${encodeURIComponent(b64)}`;
  } catch {
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
