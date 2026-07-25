import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ActiveTimer, GroceryItem, Language, MealSlot, MonthlyPlan, PantryItem, Recipe, WeeklyPlan, WajbaBackup } from './types';
import { INITIAL_RECIPES } from './data/recipes';
import { generateGroceryListFromPlan } from './utils/aggregator';
import {
  loadActiveTimers,
  loadCustomRecipes,
  loadFavorites,
  loadGroceryCheckedIds,
  loadGroceryExtras,
  loadMonthlyPlan,
  loadPantryItems,
  loadStoredLanguage,
  loadStoredTheme,
  loadVotes,
  loadWeeklyPlan,
  saveActiveTimers,
  saveCustomRecipe,
  saveFavorites,
  saveGroceryCheckedIds,
  saveGroceryExtras,
  savePantryItems,
  saveMonthlyPlan,
  saveStoredLanguage,
  saveStoredTheme,
  saveVote,
  saveWeeklyPlan,
  deleteCustomRecipe,
  replaceWajbaState,
  clearWajbaUserData,
  detectStorageIssues,
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
import { PantryView } from './components/PantryView';
import { SettingsView } from './components/SettingsView';
import { PublicRecipeNotFound, PublicRecipePage } from './components/PublicRecipePage';
import { getPublicRecipeRoute, updateSeo } from './utils/seo';
import { Calendar, CalendarDays } from 'lucide-react';

type DashboardTab = 'recipes' | 'planner' | 'grocery' | 'pantry' | 'leaderboard' | 'settings';

const DASHBOARD_PATHS: Record<DashboardTab, string> = {
  recipes: '/dashboard',
  planner: '/dashboard/planner',
  grocery: '/dashboard/grocery',
  pantry: '/dashboard/pantry',
  leaderboard: '/dashboard/leaderboard',
  settings: '/dashboard/settings',
};

function getDashboardTab(pathname: string): DashboardTab | null {
  if (pathname === '/dashboard' || pathname === '/dashboard/') return 'recipes';
  const tab = pathname.match(/^\/dashboard\/(planner|grocery|pantry|leaderboard|settings)\/?$/)?.[1];
  return (tab as DashboardTab | undefined) ?? null;
}

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const dashboardTab = useMemo(() => getDashboardTab(pathname), [pathname]);
  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const [currentTab, setCurrentTab] = useState<DashboardTab>(() => getDashboardTab(window.location.pathname) ?? 'recipes');

  useEffect(() => {
    if (dashboardTab) setCurrentTab(dashboardTab);
  }, [dashboardTab]);

  const navigateToTab = (tab: DashboardTab) => {
    const nextPath = DASHBOARD_PATHS[tab];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setPathname(nextPath);
    setCurrentTab(tab);
  };

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
  const publicRecipeRoute = useMemo(() => getPublicRecipeRoute(allRecipes, pathname), [allRecipes, pathname]);

  useEffect(() => {
    updateSeo(publicRecipeRoute.recipe, publicRecipeRoute.isRecipePath && !publicRecipeRoute.recipe, isDashboardRoute);
  }, [isDashboardRoute, publicRecipeRoute]);

  const [favorites, setFavorites] = useState<string[]>(loadFavorites());
  const [userVotes, setUserVotes] = useState<{ [recipeId: string]: 'like' | 'dislike' }>(loadVotes());
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(loadWeeklyPlan());
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlan>(() => loadMonthlyPlan());
  const [plannerMode, setPlannerMode] = useState<'weekly' | 'monthly'>('weekly');

  const [groceryCheckedIds, setGroceryCheckedIds] = useState<string[]>(loadGroceryCheckedIds());
  const [groceryExtras, setGroceryExtras] = useState<GroceryItem[]>(loadGroceryExtras());
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(loadPantryItems());
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>(loadActiveTimers());

  // Modals
  const [selectedDetailRecipe, setSelectedDetailRecipe] = useState<Recipe | null>(null);
  const [createRecipeModalOpen, setCreateRecipeModalOpen] = useState(false);
  const [familySyncModalOpen, setFamilySyncModalOpen] = useState(false);
  const [recipeBeingEdited, setRecipeBeingEdited] = useState<Recipe | null>(null);
  const [lastDeletedRecipe, setLastDeletedRecipe] = useState<Recipe | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [storageIssue, setStorageIssue] = useState<string | null>(() => detectStorageIssues());

  // Derived Grocery List based on current planner mode
  const groceryList = useMemo(() => {
    const planToUse = plannerMode === 'monthly' ? monthlyPlan : weeklyPlan;
    return generateGroceryListFromPlan(
      planToUse,
      allRecipes,
      groceryCheckedIds,
      groceryExtras,
      pantryItems
    );
  }, [plannerMode, weeklyPlan, monthlyPlan, allRecipes, groceryCheckedIds, groceryExtras, pantryItems]);

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
    setRecipeBeingEdited(null);
    setCreateRecipeModalOpen(false);
    setStatusMessage({ type: 'success', text: language === 'ar' ? 'تم حفظ الوصفة بنجاح.' : 'Recipe saved successfully.' });
  };

  const handleOpenCreateRecipeModal = () => {
    setRecipeBeingEdited(null);
    setCreateRecipeModalOpen(true);
  };

  const handleDeleteCustomRecipe = (recipe: Recipe) => {
    const updated = deleteCustomRecipe(recipe.id);
    setCustomRecipes(updated);
    setLastDeletedRecipe(recipe);
    setSelectedDetailRecipe(null);
    setStatusMessage({ type: 'success', text: language === 'ar' ? 'تم حذف الوصفة. يمكنك التراجع الآن.' : 'Recipe deleted. You can undo now.' });
  };

  const handleUndoDeleteRecipe = () => {
    if (!lastDeletedRecipe) return;
    setCustomRecipes(saveCustomRecipe(lastDeletedRecipe));
    setLastDeletedRecipe(null);
    setStatusMessage({ type: 'success', text: language === 'ar' ? 'تمت استعادة الوصفة.' : 'Recipe restored.' });
  };

  const handleUpdatePantry = (items: PantryItem[]) => {
    setPantryItems(items);
    savePantryItems(items);
  };

  const handleImportBackup = (backup: WajbaBackup) => {
    try {
      replaceWajbaState(backup.state);
      window.location.reload();
    } catch (error) {
      setStatusMessage({ type: 'error', text: error instanceof Error ? error.message : (language === 'ar' ? 'تعذر استعادة النسخة.' : 'Backup restore failed.') });
    }
  };

  const handleClearUserData = () => {
    clearWajbaUserData();
    window.location.reload();
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
    navigateToTab('planner');
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

  if (publicRecipeRoute.isRecipePath) {
    return publicRecipeRoute.recipe ? (
      <PublicRecipePage recipe={publicRecipeRoute.recipe} language={language} />
    ) : (
      <PublicRecipeNotFound language={language} />
    );
  }

  if (pathname === '/') {
    return (
      <LandingPage
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        onEnterDashboard={() => navigateToTab('recipes')}
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
            navigateToTab(tab);
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        activeTimers={activeTimers}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {storageIssue && (
          <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100">
            <span>{language === 'ar' ? `تعذر قراءة بيانات محلية تالفة: ${storageIssue}. يمكنك تصدير ما يمكن قراءته أو مسح البيانات من الإعدادات.` : `A local data value could not be read: ${storageIssue}. Export readable data or clear local data in Settings.`}</span>
            <button type="button" onClick={() => { navigateToTab('settings'); setStorageIssue(null); }} className="rounded-lg border border-current px-3 py-1 text-xs font-bold">{language === 'ar' ? 'فتح الإعدادات' : 'Open Settings'}</button>
          </div>
        )}
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
            onOpenCreateRecipeModal={handleOpenCreateRecipeModal}
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
                onGoToGrocery={() => navigateToTab('grocery')}
                onOpenRecipeDetail={(recipe) => setSelectedDetailRecipe(recipe)}
                onOpenFamilySync={() => setFamilySyncModalOpen(true)}
                onOpenCreateRecipeModal={handleOpenCreateRecipeModal}
              />
            ) : (
              <MonthlyCalendarView
                monthlyPlan={monthlyPlan}
                onUpdateMonthlyPlan={handleUpdateMonthlyPlan}
                recipes={allRecipes}
                language={language}
                onGoToGrocery={() => navigateToTab('grocery')}
                onOpenRecipeDetail={(recipe) => setSelectedDetailRecipe(recipe)}
                onOpenFamilySync={() => setFamilySyncModalOpen(true)}
                onChangeMonth={handleChangeMonth}
                onOpenCreateRecipeModal={handleOpenCreateRecipeModal}
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

        {currentTab === 'pantry' && (
          <PantryView
            items={pantryItems}
            language={language}
            onUpdateItems={handleUpdatePantry}
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

        {currentTab === 'settings' && (
          <SettingsView
            language={language}
            theme={theme}
            onLanguageChange={setLanguage}
            onThemeToggle={toggleTheme}
            isRamadanMode={weeklyPlan.isRamadanMode}
            onToggleRamadanMode={() =>
              handleUpdateWeeklyPlan({
                ...weeklyPlan,
                isRamadanMode: !weeklyPlan.isRamadanMode,
              })
            }
            onImportBackup={handleImportBackup}
            onClearUserData={handleClearUserData}
          />
        )}
      </main>

      {statusMessage && (
        <div
          role={statusMessage.type === 'error' ? 'alert' : 'status'}
          className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-[60] max-w-md rounded-2xl border px-4 py-3 text-sm shadow-xl ${
            statusMessage.type === 'error'
              ? 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span>{statusMessage.text}</span>
            {lastDeletedRecipe && (
              <button
                type="button"
                onClick={handleUndoDeleteRecipe}
                className="shrink-0 rounded-lg border border-current px-2.5 py-1 text-xs font-bold"
              >
                {language === 'ar' ? 'تراجع' : 'Undo'}
              </button>
            )}
            <button type="button" onClick={() => setStatusMessage(null)} className="text-lg leading-none" aria-label={language === 'ar' ? 'إغلاق' : 'Dismiss'}>
              ×
            </button>
          </div>
        </div>
      )}

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
          onEditRecipe={selectedDetailRecipe.isCustom ? () => {
            setRecipeBeingEdited(selectedDetailRecipe);
            setCreateRecipeModalOpen(true);
            setSelectedDetailRecipe(null);
          } : undefined}
          onDeleteRecipe={selectedDetailRecipe.isCustom ? () => handleDeleteCustomRecipe(selectedDetailRecipe) : undefined}
        />
      )}

      {/* Create Custom Recipe Modal */}
      {createRecipeModalOpen && (
        <CreateRecipeModal
          onClose={() => {
            setCreateRecipeModalOpen(false);
            setRecipeBeingEdited(null);
          }}
          language={language}
          onSaveRecipe={handleSaveCustomRecipe}
          initialRecipe={recipeBeingEdited}
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
