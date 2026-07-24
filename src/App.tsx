import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ActiveTimer, GroceryItem, Language, MealSlot, MonthlyPlan, Recipe, WeeklyPlan } from './types';
import { INITIAL_RECIPES } from './data/recipes';
import { generateGroceryListFromPlan } from './utils/aggregator';
import {
  loadActiveTimers,
  loadCustomRecipes,
  loadFavorites,
  loadGroceryCheckedIds,
  loadGroceryExtras,
  loadMonthlyPlan,
  loadStoredLanguage,
  loadStoredTheme,
  loadVotes,
  loadWeeklyPlan,
  saveActiveTimers,
  saveCustomRecipe,
  saveFavorites,
  saveGroceryCheckedIds,
  saveGroceryExtras,
  saveMonthlyPlan,
  saveStoredLanguage,
  saveStoredTheme,
  saveVote,
  saveWeeklyPlan,
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { RecipeExplorer } from './components/RecipeExplorer';
import { WeeklyPlannerView } from './components/WeeklyPlannerView';
import { MonthlyCalendarView } from './components/MonthlyCalendarView';
import { GroceryListView } from './components/GroceryListView';
import { TopTenLeaderboard } from './components/TopTenLeaderboard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { CreateRecipeModal } from './components/CreateRecipeModal';
import { FamilySyncModal } from './components/FamilySyncModal';
import { CookingTimerBar } from './components/CookingTimerBar';
import { Calendar, CalendarDays } from 'lucide-react';

export default function App() {
  // Landing Page vs Dashboard View state
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // 1. Language & Theme Setup
  const [language, setLanguage] = useState<Language>(loadStoredLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(loadStoredTheme());

  useEffect(() => {
    saveStoredLanguage(language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  useEffect(() => {
    saveStoredTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Data State
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(loadCustomRecipes());
  const allRecipes = useMemo(() => {
    return [...customRecipes, ...INITIAL_RECIPES];
  }, [customRecipes]);

  const [favorites, setFavorites] = useState<string[]>(loadFavorites());
  const [userVotes, setUserVotes] = useState<{ [recipeId: string]: 'like' | 'dislike' }>(loadVotes());
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(loadWeeklyPlan());
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlan>(() => loadMonthlyPlan());
  const [plannerMode, setPlannerMode] = useState<'weekly' | 'monthly'>('weekly');

  const [groceryCheckedIds, setGroceryCheckedIds] = useState<string[]>(loadGroceryCheckedIds());
  const [groceryExtras, setGroceryExtras] = useState<GroceryItem[]>(loadGroceryExtras());
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>(loadActiveTimers());

  // Navigation Tab State
  const [currentTab, setCurrentTab] = useState<'recipes' | 'planner' | 'grocery' | 'leaderboard' | 'family'>('recipes');

  // Modals
  const [selectedDetailRecipe, setSelectedDetailRecipe] = useState<Recipe | null>(null);
  const [createRecipeModalOpen, setCreateRecipeModalOpen] = useState(false);
  const [familySyncModalOpen, setFamilySyncModalOpen] = useState(false);

  // Derived Grocery List based on current planner mode
  const groceryList = useMemo(() => {
    const planToUse = plannerMode === 'monthly' ? monthlyPlan : weeklyPlan;
    return generateGroceryListFromPlan(
      planToUse,
      allRecipes,
      groceryCheckedIds,
      groceryExtras
    );
  }, [plannerMode, weeklyPlan, monthlyPlan, allRecipes, groceryCheckedIds, groceryExtras]);

  // Handlers
  const handleToggleFavorite = (recipeId: string) => {
    const updated = favorites.includes(recipeId)
      ? favorites.filter((id) => id !== recipeId)
      : [...favorites, recipeId];
    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleVote = (recipeId: string, type: 'like' | 'dislike') => {
    saveVote(recipeId, type);
    setUserVotes({ ...userVotes, [recipeId]: type });

    const recipeIndex = INITIAL_RECIPES.findIndex((r) => r.id === recipeId);
    if (recipeIndex !== -1) {
      const recipe = INITIAL_RECIPES[recipeIndex];
      if (type === 'like') {
        recipe.votesCount.likes += 1;
      } else {
        recipe.votesCount.dislikes += 1;
      }
    }
  };

  const handleUpdateWeeklyPlan = (newPlan: WeeklyPlan) => {
    setWeeklyPlan(newPlan);
    saveWeeklyPlan(newPlan);
  };

  const handleUpdateMonthlyPlan = (newPlan: MonthlyPlan) => {
    setMonthlyPlan(newPlan);
    saveMonthlyPlan(newPlan);
  };

  const handleChangeMonth = (year: number, month: number) => {
    const loaded = loadMonthlyPlan(year, month);
    setMonthlyPlan(loaded);
  };

  const handleToggleCheckGroceryItem = (itemId: string) => {
    const updated = groceryCheckedIds.includes(itemId)
      ? groceryCheckedIds.filter((id) => id !== itemId)
      : [...groceryCheckedIds, itemId];
    setGroceryCheckedIds(updated);
    saveGroceryCheckedIds(updated);
  };

  const handleAddGroceryExtra = (extraItem: GroceryItem) => {
    const updated = [extraItem, ...groceryExtras];
    setGroceryExtras(updated);
    saveGroceryExtras(updated);
  };

  const handleRemoveGroceryExtra = (itemId: string) => {
    const updated = groceryExtras.filter((i) => i.id !== itemId);
    setGroceryExtras(updated);
    saveGroceryExtras(updated);
  };

  const handleClearGroceryChecked = () => {
    setGroceryCheckedIds([]);
    saveGroceryCheckedIds([]);
  };

  const handleSaveCustomRecipe = (recipe: Recipe) => {
    const updated = saveCustomRecipe(recipe);
    setCustomRecipes(updated);
  };

  const handleStartTimer = (timer: ActiveTimer) => {
    const updated = [timer, ...activeTimers];
    setActiveTimers(updated);
    saveActiveTimers(updated);
  };

  const handleUpdateTimers = useCallback((timers: ActiveTimer[]) => {
    setActiveTimers(timers);
    saveActiveTimers(timers);
  }, []);

  const handleAddToPlanner = (
    recipe: Recipe,
    slotKey: MealSlot,
    dayId: string,
    servings: number
  ) => {
    const updatedDays = weeklyPlan.days.map((day) => {
      if (day.dayId === dayId) {
        return {
          ...day,
          slots: {
            ...day.slots,
            [slotKey]: {
              recipeId: recipe.id,
              servings,
            },
          },
        };
      }
      return day;
    });

    const newPlan = { ...weeklyPlan, days: updatedDays };
    setWeeklyPlan(newPlan);
    saveWeeklyPlan(newPlan);
    setSelectedDetailRecipe(null);
    setCurrentTab('planner');
  };

  const handleAddIngredientsToGrocery = (
    ingredients: Recipe['ingredients'],
    scale: number
  ) => {
    // Adds ingredients as custom extras
    const newExtras: GroceryItem[] = ingredients.map((ing) => ({
      id: `ing_extra_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nameAr: ing.nameAr,
      nameEn: ing.nameEn,
      amount: Math.round(ing.amount * scale * 10) / 10,
      unitAr: ing.unitAr,
      unitEn: ing.unitEn,
      aisle: ing.aisle || 'other',
      isChecked: false,
      recipeSources: [language === 'ar' ? 'إضافة من الوصفة' : 'Recipe Add'],
      isCustomExtra: true,
    }));

    const updated = [...newExtras, ...groceryExtras];
    setGroceryExtras(updated);
    saveGroceryExtras(updated);
  };

  if (showLanding) {
    return (
      <LandingPage
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        onEnterDashboard={() => setShowLanding(false)}
        isRamadanMode={weeklyPlan.isRamadanMode}
        onToggleRamadanMode={() =>
          handleUpdateWeeklyPlan({
            ...weeklyPlan,
            isRamadanMode: !weeklyPlan.isRamadanMode,
          })
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-stone-900 dark:bg-[#0c1220] dark:text-slate-100 flex flex-col font-sans transition-colors pb-24">
      {/* Top Main Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'family') {
            setFamilySyncModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        isRamadanMode={weeklyPlan.isRamadanMode}
        onToggleRamadanMode={() =>
          handleUpdateWeeklyPlan({
            ...weeklyPlan,
            isRamadanMode: !weeklyPlan.isRamadanMode,
          })
        }
        activeTimers={activeTimers}
        onOpenLanding={() => setShowLanding(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'recipes' && (
          <RecipeExplorer
            recipes={allRecipes}
            language={language}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            userVotes={userVotes}
            onVote={handleVote}
            onSelectRecipe={(recipe) => setSelectedDetailRecipe(recipe)}
            onQuickAddToPlanner={(recipe) => setSelectedDetailRecipe(recipe)}
            onOpenCreateRecipeModal={() => setCreateRecipeModalOpen(true)}
          />
        )}

        {currentTab === 'planner' && (
          <div className="space-y-6">
            {/* View Mode Toggle Switcher */}
            <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-2.5 rounded-2xl border border-amber-200/80 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-1.5 bg-amber-100/70 dark:bg-stone-800 p-1.5 rounded-xl">
                <button
                  onClick={() => setPlannerMode('weekly')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    plannerMode === 'weekly'
                      ? 'bg-amber-700 text-white shadow-md shadow-amber-800/20'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-700/60'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الجدول الأسبوعي' : 'Weekly Plan'}</span>
                </button>

                <button
                  onClick={() => setPlannerMode('monthly')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    plannerMode === 'monthly'
                      ? 'bg-amber-700 text-white shadow-md shadow-amber-800/20'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-700/60'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'ar' ? 'التقويم الشهري' : 'Monthly Calendar'}</span>
                </button>
              </div>

              <div className="text-xs font-bold text-amber-900/70 dark:text-amber-200/70 hidden sm:block px-3">
                {plannerMode === 'weekly'
                  ? language === 'ar'
                    ? 'عرض الأيام السبعة للأسبوع'
                    : 'Showing 7-day weekly view'
                  : language === 'ar'
                  ? 'عرض التقويم الشهري الكامل'
                  : 'Showing full monthly calendar grid'}
              </div>
            </div>

            {/* Render Weekly or Monthly Planner View */}
            {plannerMode === 'weekly' ? (
              <WeeklyPlannerView
                plan={weeklyPlan}
                onUpdatePlan={handleUpdateWeeklyPlan}
                recipes={allRecipes}
                language={language}
                onGoToGrocery={() => setCurrentTab('grocery')}
                onOpenRecipeDetail={(recipe) => setSelectedDetailRecipe(recipe)}
                onOpenFamilySync={() => setFamilySyncModalOpen(true)}
                onOpenCreateRecipeModal={() => setCreateRecipeModalOpen(true)}
              />
            ) : (
              <MonthlyCalendarView
                monthlyPlan={monthlyPlan}
                onUpdateMonthlyPlan={handleUpdateMonthlyPlan}
                recipes={allRecipes}
                language={language}
                onGoToGrocery={() => setCurrentTab('grocery')}
                onOpenRecipeDetail={(recipe) => setSelectedDetailRecipe(recipe)}
                onOpenFamilySync={() => setFamilySyncModalOpen(true)}
                onChangeMonth={handleChangeMonth}
                onOpenCreateRecipeModal={() => setCreateRecipeModalOpen(true)}
              />
            )}
          </div>
        )}

        {currentTab === 'grocery' && (
          <GroceryListView
            groceryList={groceryList}
            language={language}
            onToggleCheckItem={handleToggleCheckGroceryItem}
            onAddCustomExtra={handleAddGroceryExtra}
            onRemoveCustomExtra={handleRemoveGroceryExtra}
            onClearChecked={handleClearGroceryChecked}
          />
        )}

        {currentTab === 'leaderboard' && (
          <TopTenLeaderboard
            recipes={allRecipes}
            language={language}
            userVotes={userVotes}
            onVote={handleVote}
            onSelectRecipe={(recipe) => setSelectedDetailRecipe(recipe)}
          />
        )}
      </main>

      {/* Persistent Floating Cooking Timers Bar */}
      <CookingTimerBar
        timers={activeTimers}
        language={language}
        onUpdateTimers={handleUpdateTimers}
      />

      {/* Recipe Detail View Modal */}
      {selectedDetailRecipe && (
        <RecipeDetailModal
          recipe={selectedDetailRecipe}
          onClose={() => setSelectedDetailRecipe(null)}
          language={language}
          onStartTimer={handleStartTimer}
          onAddToPlanner={handleAddToPlanner}
          onAddIngredientsToGrocery={handleAddIngredientsToGrocery}
        />
      )}

      {/* Create Custom Recipe Modal */}
      {createRecipeModalOpen && (
        <CreateRecipeModal
          onClose={() => setCreateRecipeModalOpen(false)}
          language={language}
          onSaveRecipe={handleSaveCustomRecipe}
        />
      )}

      {/* Family Sync Modal */}
      {familySyncModalOpen && (
        <FamilySyncModal
          plan={weeklyPlan}
          groceryList={groceryList}
          onClose={() => setFamilySyncModalOpen(false)}
          language={language}
          onImportPlan={handleUpdateWeeklyPlan}
        />
      )}
    </div>
  );
}
