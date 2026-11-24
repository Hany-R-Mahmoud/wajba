import React, { lazy, Suspense, useState, useEffect, useMemo, useCallback } from 'react';
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
  saveFamilyWeek,
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
  clearMonthlyAssignmentsForDates,
  clearMonthlyPlanAssignments,
  clearPersistedMonthlyAssignmentsForDates,
  clearWeeklyPlanAssignments,
  getCurrentWeekDateKeys,
  detectStorageIssues,
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { readInvite } from './components/FamilyGroups';
import { prepareFamilyImport } from './utils/family';
import { LandingPage } from './components/LandingPage';
import { CookingTimerBar } from './components/CookingTimerBar';
import { PublicSeasonsPage } from './components/PublicSeasonsPage';
import { ErrorBoundary, LoadingState } from './components/AsyncState';
import { PublicRecipeNotFound, PublicRecipePage } from './components/PublicRecipePage';
import { getPublicRecipeRoute, updateSeo } from './utils/seo';
import { Calendar, CalendarDays } from 'lucide-react';
import {PwaInstallHelpDialog} from './components/PwaInstallHelpDialog';
import {PwaStatusBar} from './components/PwaStatusBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FEATURE_FLAGS } from './config/features';

// Dashboard views and modals load on first use, so the landing page and public pages do not pay for them.
const lazyNamed = <T extends React.ComponentType<any>>(load: () => Promise<Record<string, unknown>>, name: string) =>
  lazy(async () => ({ default: (await load())[name] as T }));
const RecipeExplorer = lazyNamed(() => import('./components/RecipeExplorer'), 'RecipeExplorer');
const WeeklyPlannerView = lazyNamed(() => import('./components/WeeklyPlannerView'), 'WeeklyPlannerView');
const MonthlyCalendarView = lazyNamed(() => import('./components/MonthlyCalendarView'), 'MonthlyCalendarView');
const GroceryListView = lazyNamed(() => import('./components/GroceryListView'), 'GroceryListView');
const TopTenLeaderboard = lazyNamed(() => import('./components/TopTenLeaderboard'), 'TopTenLeaderboard');
const RecipeDetailModal = lazyNamed(() => import('./components/RecipeDetailModal'), 'RecipeDetailModal');
const CreateRecipeModal = lazyNamed(() => import('./components/CreateRecipeModal'), 'CreateRecipeModal');
const FamilySyncModal = lazyNamed(() => import('./components/FamilySyncModal'), 'FamilySyncModal');
const PantryView = lazyNamed(() => import('./components/PantryView'), 'PantryView');
const SeasonalView = lazyNamed(() => import('./components/SeasonalView'), 'SeasonalView');
const SettingsView = lazyNamed(() => import('./components/SettingsView'), 'SettingsView');

/** Lazy modal host: a failed chunk load shows the standard error card instead of breaking the app. */
function LazyModal({ language, children }: { language: Language; children: React.ReactNode }) {
  return <ErrorBoundary language={language}><Suspense fallback={null}>{children}</Suspense></ErrorBoundary>;
}

type DashboardTab = 'recipes' | 'planner' | 'grocery' | 'seasons' | 'pantry' | 'leaderboard' | 'settings';

const DASHBOARD_PATHS: Record<DashboardTab, string> = {
  planner: '/dashboard',
  recipes: '/dashboard/recipes',
  grocery: '/dashboard/grocery',
  seasons: '/dashboard/seasons',
  pantry: '/dashboard/pantry',
  leaderboard: '/dashboard/leaderboard',
  settings: '/dashboard/settings',
};

function getDashboardTab(pathname: string): DashboardTab | null {
  if (pathname === '/dashboard' || pathname === '/dashboard/') return 'planner';
  const tab = pathname.match(/^\/dashboard\/(recipes|planner|grocery|seasons|pantry|leaderboard|settings)\/?$/)?.[1];
  if (tab === 'leaderboard' && !FEATURE_FLAGS.leaderboard) return null;
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
  const isSeasonsRoute = /^\/seasons\/?$/.test(pathname);
  const [currentTab, setCurrentTab] = useState<DashboardTab>(() => getDashboardTab(window.location.pathname) ?? 'planner');

  useEffect(() => {
    if (dashboardTab) {
      setCurrentTab(dashboardTab);
      return;
    }

    if (!FEATURE_FLAGS.leaderboard && /^\/dashboard\/leaderboard\/?$/.test(pathname)) {
      window.history.replaceState(window.history.state, '', DASHBOARD_PATHS.planner);
      setPathname(DASHBOARD_PATHS.planner);
      setCurrentTab('planner');
    }
  }, [dashboardTab, pathname]);

  // Every tab change (nav click or back/forward) starts at the top of the new view.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

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
  const [seedRecipes, setSeedRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const allRecipes = useMemo(() => {
    return [...customRecipes, ...seedRecipes];
  }, [customRecipes, seedRecipes]);
  const publicRecipeRoute = useMemo(() => getPublicRecipeRoute(allRecipes, pathname), [allRecipes, pathname]);

  useEffect(() => {
    updateSeo(publicRecipeRoute.recipe, publicRecipeRoute.isRecipePath && !publicRecipeRoute.recipe, isDashboardRoute, isSeasonsRoute);
  }, [isDashboardRoute, isSeasonsRoute, publicRecipeRoute]);

  const [favorites, setFavorites] = useState<string[]>(loadFavorites());
  const [userVotes, setUserVotes] = useState<{ [recipeId: string]: 'like' | 'dislike' }>(loadVotes());
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(loadWeeklyPlan);
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlan>(() => loadMonthlyPlan());
  // One-shot: the In Season view opens recipes with the seasonal filter on.
  const [openRecipesSeasonal, setOpenRecipesSeasonal] = useState(false);
  const [plannerMode, setPlannerMode] = useState<'weekly' | 'monthly'>('weekly');
  // Recipes opened by back/forward or any non-seasonal route must not keep the one-shot filter.
  useEffect(() => {
    if (currentTab !== 'recipes') setOpenRecipesSeasonal(false);
  }, [currentTab]);

  const [groceryCheckedIds, setGroceryCheckedIds] = useState<string[]>(loadGroceryCheckedIds());
  const [groceryExtras, setGroceryExtras] = useState<GroceryItem[]>(loadGroceryExtras());
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(loadPantryItems());
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>(loadActiveTimers());

  // Modals
  const [selectedDetailRecipe, setSelectedDetailRecipe] = useState<Recipe | null>(null);
  const [createRecipeModalOpen, setCreateRecipeModalOpen] = useState(false);
  const [familySyncModalOpen, setFamilySyncModalOpen] = useState(() => Boolean(readInvite()));
  useEffect(() => {
    const openInvite = () => { if (readInvite()) setFamilySyncModalOpen(true); };
    window.addEventListener('hashchange', openInvite);
    return () => window.removeEventListener('hashchange', openInvite);
  }, []);
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

    setSeedRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              votesCount: {
                likes: recipe.votesCount.likes + (type === 'like' ? 1 : 0),
                dislikes: recipe.votesCount.dislikes + (type === 'dislike' ? 1 : 0),
              },
            }
          : recipe,
      ),
    );
  };

  const handleUpdateWeeklyPlan = (newPlan: WeeklyPlan) => {
    saveWeeklyPlan(newPlan);
    setWeeklyPlan(newPlan);
  };

  const handleUpdateMonthlyPlan = (newPlan: MonthlyPlan) => {
    setMonthlyPlan(newPlan);
    saveMonthlyPlan(newPlan);
  };

  const handleChangeMonth = (year: number, month: number) => {
    const loaded = loadMonthlyPlan(year, month);
    setMonthlyPlan(loaded);
  };

  const handleClearWeek = () => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من مسح هذا الأسبوع؟ سيتم حذف الأسبوع الحالي من الجدول الأسبوعي والشهري.' : 'Clear this week? The current week will be removed from both weekly and monthly schedules.')) {
      return;
    }

    const weekDateKeys = getCurrentWeekDateKeys();
    const nextWeeklyPlan = clearWeeklyPlanAssignments(weeklyPlan);
    const nextMonthlyPlan = clearMonthlyAssignmentsForDates(monthlyPlan, weekDateKeys);
    clearPersistedMonthlyAssignmentsForDates(weekDateKeys);
    saveWeeklyPlan(nextWeeklyPlan);
    saveMonthlyPlan(nextMonthlyPlan);
    setWeeklyPlan(nextWeeklyPlan);
    setMonthlyPlan(nextMonthlyPlan);
  };

  const handleClearMonthAndWeek = () => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من مسح الشهر والأسبوع؟ سيتم حذف كل وجبات الشهر الظاهر والجدول الأسبوعي.' : 'Clear this month and the weekly schedule? All assignments in the displayed month and the weekly plan will be removed.')) {
      return;
    }

    const nextWeeklyPlan = clearWeeklyPlanAssignments(weeklyPlan);
    const nextMonthlyPlan = clearMonthlyPlanAssignments(monthlyPlan);
    saveWeeklyPlan(nextWeeklyPlan);
    saveMonthlyPlan(nextMonthlyPlan);
    setWeeklyPlan(nextWeeklyPlan);
    setMonthlyPlan(nextMonthlyPlan);
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
      <>
        <PwaStatusBar language={language} dark={theme === 'dark'} />
        <PublicRecipePage recipe={publicRecipeRoute.recipe} language={language} />
        <PwaInstallHelpDialog language={language} dark={theme === 'dark'} />
      </>
    ) : (
      <>
        <PwaStatusBar language={language} dark={theme === 'dark'} />
        <PublicRecipeNotFound language={language} />
        <PwaInstallHelpDialog language={language} dark={theme === 'dark'} />
      </>
    );
  }

  if (isSeasonsRoute) {
    return (
      <>
        <PwaStatusBar language={language} dark={theme === 'dark'} />
        <PublicSeasonsPage language={language} />
        <PwaInstallHelpDialog language={language} dark={theme === 'dark'} />
      </>
    );
  }

  if (pathname === '/') {
    return (
      <>
        <PwaStatusBar language={language} dark={theme === 'dark'} />
        <LandingPage
          language={language}
          onLanguageChange={setLanguage}
          theme={theme}
          onThemeToggle={toggleTheme}
          onEnterDashboard={() => navigateToTab('planner')}
        />
        <PwaInstallHelpDialog language={language} dark={theme === 'dark'} />
      </>
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
            setOpenRecipesSeasonal(false);
            navigateToTab(tab);
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        activeTimers={activeTimers}
        onOpenAccount={() => { setOpenRecipesSeasonal(false); navigateToTab('settings'); }}
      />
      <PwaStatusBar language={language} dark={theme === 'dark'} />
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'family') {
            setFamilySyncModalOpen(true);
          } else {
            setOpenRecipesSeasonal(false);
            navigateToTab(tab);
          }
        }}
        language={language}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {storageIssue && (
          <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100">
            <span>{language === 'ar' ? `تعذر قراءة بيانات محلية تالفة: ${storageIssue}. يمكنك تصدير ما يمكن قراءته أو مسح البيانات من الإعدادات.` : `A local data value could not be read: ${storageIssue}. Export readable data or clear local data in Settings.`}</span>
            <button type="button" onClick={() => { navigateToTab('settings'); setStorageIssue(null); }} className="rounded-lg border border-current px-3 py-1 text-xs font-bold">{language === 'ar' ? 'فتح الإعدادات' : 'Open Settings'}</button>
          </div>
        )}
        <ErrorBoundary key={currentTab} language={language}>
        <Suspense fallback={<div className="py-16 flex justify-center"><LoadingState language={language} /></div>}>
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
            initialSeasonalOnly={openRecipesSeasonal}
          />
        )}

        {currentTab === 'planner' && (
          <div className="space-y-6">
            {/* View Mode Toggle Switcher */}
            {FEATURE_FLAGS.monthlyPlanner && (
            <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-2.5 rounded-2xl border border-amber-200/80 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-1.5 bg-amber-100/70 dark:bg-stone-800 p-1.5 rounded-xl">
                <button
                  onClick={() => setPlannerMode('weekly')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    plannerMode === 'weekly'
                      ? 'bg-amber-700 text-white shadow-md shadow-amber-800/20'
                      : 'text-amber-950 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-700/60'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الجدول الأسبوعي' : 'Weekly Plan'}</span>
                </button>

                {FEATURE_FLAGS.monthlyPlanner && (
                <button
                  onClick={() => setPlannerMode('monthly')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    plannerMode === 'monthly'
                      ? 'bg-amber-700 text-white shadow-md shadow-amber-800/20'
                      : 'text-amber-950 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-700/60'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'ar' ? 'التقويم الشهري' : 'Monthly Calendar'}</span>
                </button>
                )}
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
            )}

            {/* Render Weekly or Monthly Planner View */}
            {plannerMode === 'monthly' && FEATURE_FLAGS.monthlyPlanner ? (
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
                onClearMonthAndWeek={handleClearMonthAndWeek}
              />
            ) : (
              <WeeklyPlannerView
                plan={weeklyPlan}
                onUpdatePlan={handleUpdateWeeklyPlan}
                recipes={allRecipes}
                language={language}
                onGoToGrocery={() => navigateToTab('grocery')}
                onOpenRecipeDetail={(recipe) => setSelectedDetailRecipe(recipe)}
                onOpenFamilySync={() => setFamilySyncModalOpen(true)}
                onOpenCreateRecipeModal={handleOpenCreateRecipeModal}
                onClearWeek={handleClearWeek}
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

        {currentTab === 'seasons' && (
          <SeasonalView
            recipes={allRecipes}
            language={language}
            groceryExtraIds={groceryExtras.map((item) => item.id)}
            onAddToGrocery={handleAddGroceryExtra}
            onSelectRecipe={(recipe) => setSelectedDetailRecipe(recipe)}
            onOpenSeasonalRecipes={() => {
              setOpenRecipesSeasonal(true);
              navigateToTab('recipes');
            }}
          />
        )}

        {currentTab === 'pantry' && (
          <PantryView
            items={pantryItems}
            language={language}
            onUpdateItems={handleUpdatePantry}
          />
        )}

        {currentTab === 'leaderboard' && FEATURE_FLAGS.leaderboard && (
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
        </Suspense>
        </ErrorBoundary>
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
        <LazyModal language={language}>
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
        </LazyModal>
      )}

      {/* Create Custom Recipe Modal */}
      {createRecipeModalOpen && (
        <LazyModal language={language}>
        <CreateRecipeModal
          onClose={() => {
            setCreateRecipeModalOpen(false);
            setRecipeBeingEdited(null);
          }}
          language={language}
          onSaveRecipe={handleSaveCustomRecipe}
          initialRecipe={recipeBeingEdited}
        />
        </LazyModal>
      )}

      {/* Family Sync Modal */}
      {familySyncModalOpen && (
        <LazyModal language={language}>
        <FamilySyncModal
          plan={weeklyPlan}
          groceryList={groceryList}
          onClose={() => setFamilySyncModalOpen(false)}
          language={language}
          onImportPlan={handleUpdateWeeklyPlan}
          customRecipes={customRecipes}
          onApplyFamilyPlan={shared => {
            const imported = prepareFamilyImport(shared, () => crypto.randomUUID());
            const recipes = [...imported.customRecipes, ...customRecipes];
            saveFamilyWeek(imported.weeklyPlan, recipes);
            setCustomRecipes(recipes);
            setWeeklyPlan(imported.weeklyPlan);
          }}
        />
        </LazyModal>
      )}
      <PwaInstallHelpDialog language={language} dark={theme === 'dark'} />
    </div>
  );
}
