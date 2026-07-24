export type Language = 'ar' | 'en';

export type Region = 'egypt' | 'levant' | 'gulf' | 'maghreb' | 'general';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'suhoor' | 'iftar' | 'dessert';

export type IngredientAisle = 'produce' | 'meat' | 'dairy' | 'pantry' | 'bakery' | 'frozen' | 'other';

export interface Ingredient {
  id: string;
  nameAr: string;
  nameEn: string;
  amount: number;
  unitAr: string;
  unitEn: string;
  aisle: IngredientAisle;
}

export interface CookingTimerStep {
  stepIndex: number;
  titleAr: string;
  titleEn: string;
  durationMinutes: number;
}

export interface Recipe {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  region: Region;
  mealType: MealSlot[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isRamadanSpecial?: boolean;
  tags: string[];
  image: string;
  galleryImages?: string[];
  storyAr?: string;
  storyEn?: string;
  ingredients: Ingredient[];
  instructionsAr: string[];
  instructionsEn: string[];
  timerSteps?: CookingTimerStep[];
  votesCount: { likes: number; dislikes: number };
  rating: number;
  isCustom?: boolean;
}

export interface DayMealSlotAssignment {
  recipeId: string;
  servings: number;
  customNote?: string;
}

export interface DayPlanner {
  dayId: string; // e.g. 'sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'
  dayNameAr: string;
  dayNameEn: string;
  slots: {
    [key in MealSlot]?: DayMealSlotAssignment;
  };
}

export interface WeeklyPlan {
  id: string;
  name: string;
  isRamadanMode: boolean;
  days: DayPlanner[];
  updatedAt: string;
}

export interface MonthDayPlan {
  slots: {
    [key in MealSlot]?: DayMealSlotAssignment;
  };
  notes?: string;
}

export interface MonthlyPlan {
  id: string;
  year: number;
  month: number; // 0..11
  isRamadanMode: boolean;
  days: {
    [dateStr: string]: MonthDayPlan;
  };
  updatedAt: string;
}

export interface GroceryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  amount: number;
  unitAr: string;
  unitEn: string;
  aisle: IngredientAisle;
  isChecked: boolean;
  recipeSources: string[]; // Recipe titles
  isCustomExtra?: boolean;
}

export interface ActiveTimer {
  id: string;
  recipeId: string;
  recipeTitleAr: string;
  recipeTitleEn: string;
  stepTitleAr: string;
  stepTitleEn: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export interface GroupSyncConfig {
  familyName: string;
  googleSheetsUrl?: string;
  lastSyncedAt?: string;
}
