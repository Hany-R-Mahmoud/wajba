import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { X, Sparkles, Clock, Flame, CalendarPlus } from "lucide-react";
import { INITIAL_RECIPES } from "../../data/recipes";
import { Recipe } from "../../types";

const RECIPE_PLACEHOLDER = "/recipe-placeholder.svg";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  const handleChange = () => {
    setMatches(getMatches(query));
  };

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();

    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

export interface DishCardData {
  id: string;
  recipeId: string;
  url: string;
  titleAr: string;
  titleEn: string;
  regionAr: string;
  regionEn: string;
  prepTime: number;
  cookTime: number;
}

const REGION_LABELS: Record<Recipe["region"], { ar: string; en: string }> = {
  egypt: { ar: "مصر 🇪🇬", en: "Egypt 🇪🇬" },
  levant: { ar: "بلاد الشام 🇱🇧", en: "Levant 🇱🇧" },
  gulf: { ar: "الخليج العربي 🇸🇦", en: "Arabian Gulf 🇸🇦" },
  maghreb: { ar: "المغرب العربي 🇲🇦", en: "Maghreb 🇲🇦" },
  general: { ar: "عربي عام 🌍", en: "Arab World 🌍" },
};

const getRecipe = (recipeId: string): Recipe => {
  const recipe = INITIAL_RECIPES.find((candidate) => candidate.id === recipeId);
  if (!recipe) throw new Error(`Landing recipe ID is missing from the catalog: ${recipeId}`);
  return recipe;
};

const toDishCard = (recipeId: string): DishCardData => {
  const recipe = getRecipe(recipeId);
  const region = REGION_LABELS[recipe.region];
  return {
    id: recipe.id,
    recipeId: recipe.id,
    url: recipe.image,
    titleAr: recipe.titleAr,
    titleEn: recipe.titleEn,
    regionAr: region.ar,
    regionEn: region.en,
    prepTime: recipe.prepTimeMinutes,
    cookTime: recipe.cookTimeMinutes,
  };
};

export const DEFAULT_DISHES: DishCardData[] = [
  "egypt-macarona-beamel",
  "levant-mansaf",
  "gulf-kabsa",
  "egypt-fatteh",
  "maghreb-couscous-lamb",
  "ramadan-qatayef",
  "egypt-taameya-ful",
  "ramadan-kunafa-ashta",
].map(toDishCard);

const transitionOverlay = { duration: 0.4, ease: [0.32, 0.72, 0, 1] };

const Carousel = memo(
  ({
    handleClick,
    cards,
    isCarouselActive,
    isArabic,
  }: {
    handleClick: (dish: DishCardData, index: number) => void;
    cards: DishCardData[];
    isCarouselActive: boolean;
    isArabic: boolean;
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)");
    const faceCount = cards.length;
    // Radius and card width configured for clear depth without clipping
    const radius = isScreenSizeSm ? 220 : 340;
    const cardWidth = isScreenSizeSm ? 175 : 215;
    const rotation = useMotionValue(0);
    const isDraggingRef = useRef(false);

    // Balanced 3D forward tilt (-10deg) with -28px translateY so carousel is shifted up and fits compactly
    const transform = useTransform(
      rotation,
      (value) => `translateY(-28px) rotateX(-10deg) rotateY(${value}deg)`
    );

    return (
      <div
        className="flex h-full w-full items-center justify-center overflow-hidden pt-0 pb-6"
        style={{
          perspective: isScreenSizeSm ? "1000px" : "1400px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab items-center justify-center active:cursor-grabbing"
          style={{
            transform,
            width: radius * 2,
            transformStyle: "preserve-3d",
          }}
          onDragStart={() => {
            isDraggingRef.current = true;
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.1)
          }
          onDragEnd={(_, info) => {
            if (!isCarouselActive) return;
            const targetRotation = rotation.get() + info.velocity.x * 0.12;
            animate(rotation, targetRotation, {
              type: "spring",
              stiffness: 70,
              damping: 20,
              mass: 0.15,
            });
            setTimeout(() => {
              isDraggingRef.current = false;
            }, 120);
          }}
        >
          {cards.map((dish, i) => {
            const angle = i * (360 / faceCount);
            return (
              <motion.div
                key={`key-${dish.id}-${i}`}
                className="absolute flex flex-col rounded-2xl bg-white dark:bg-[#212e47] text-stone-900 dark:text-white p-2.5 border border-stone-300 dark:border-[#384966] shadow-2xl group transition-all duration-300"
                style={{
                  width: `${cardWidth}px`,
                  height: `${isScreenSizeSm ? 250 : 285}px`,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "visible",
                }}
              >
                {/* Fixed Aspect Image - Clicking image opens recipe overlay */}
                <div
                  className="relative w-full h-[150px] sm:h-[180px] rounded-xl overflow-hidden bg-stone-900 border border-black/10 dark:border-white/10 cursor-pointer group/img transition-all duration-300 hover:ring-2 hover:ring-[#ff7759]/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDraggingRef.current) return;
                    handleClick(dish, i);
                  }}
                >
                  <img
                    src={dish.url}
                    alt={isArabic ? dish.titleAr : dish.titleEn}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = RECIPE_PLACEHOLDER;
                    }}
                    className="w-full h-full object-cover rounded-xl group-hover/img:scale-105 transition-transform duration-500 pointer-events-none"
                  />
                  <div className="absolute top-2 right-2 bg-[#121216]/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono text-[#ff7759] border border-white/15 font-bold shadow-md">
                    {isArabic ? dish.regionAr : dish.regionEn}
                  </div>

                  {/* Tap/Click image badge */}
                  <div className="absolute bottom-2 left-2 bg-stone-900/85 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-mono text-white/90 border border-white/15 flex items-center gap-1 opacity-80 group-hover/img:opacity-100 group-hover/img:border-[#ff7759] transition-all shadow-sm">
                    <Sparkles className="w-2.5 h-2.5 text-[#ff7759]" />
                    <span>{isArabic ? "اضغط الصورة" : "Tap image"}</span>
                  </div>
                </div>

                {/* Typography & Dish Meta */}
                <div className="p-2 space-y-1 font-mono text-center flex-1 flex flex-col justify-center">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white truncate">
                    {isArabic ? dish.titleAr : dish.titleEn}
                  </h4>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#ff7759]" />
                      {dish.prepTime + dish.cookTime} {isArabic ? "د" : "m"}
                    </span>
                    <span>•</span>
                    <span className="text-[#ff7759] font-bold">
                      {isArabic ? "وصفة موثوقة" : "Heritage"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }
);

export interface ThreeDPhotoCarouselProps {
  language?: "ar" | "en";
  dishes?: DishCardData[];
  onSelectDish?: (dish: DishCardData) => void;
}

export function ThreeDPhotoCarousel({
  language = "ar",
  dishes = DEFAULT_DISHES,
  onSelectDish,
}: ThreeDPhotoCarouselProps) {
  const isArabic = language === "ar";
  const [activeDish, setActiveDish] = useState<DishCardData | null>(null);
  const [isCarouselActive, setIsCarouselActive] = useState(true);

  const handleClick = (dish: DishCardData) => {
    setActiveDish(dish);
    setIsCarouselActive(false);
  };

  const handleClose = () => {
    setActiveDish(null);
    setIsCarouselActive(true);
  };

  return (
    <motion.div layout className="relative w-full max-w-6xl mx-auto">
      <AnimatePresence mode="sync">
        {activeDish && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            layoutId={`img-container-${activeDish.id}`}
            layout="position"
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-10 cursor-pointer"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
          >
            <div
              className="relative bg-[#f0eee8] dark:bg-[#162032] text-stone-900 dark:text-white rounded-3xl p-6 pt-12 sm:p-8 sm:pt-14 max-w-lg w-full border border-[#e2e0d8] dark:border-[#2b3a54] shadow-2xl space-y-4 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2.5 rounded-full bg-stone-200/90 hover:bg-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-700 text-stone-800 dark:text-white border border-stone-300 dark:border-white/10 transition-colors cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-stone-900">
                <img
                  src={activeDish.url}
                  alt={isArabic ? activeDish.titleAr : activeDish.titleEn}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = RECIPE_PLACEHOLDER;
                  }}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="space-y-2 font-mono">
                <span className="px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 text-[#ff7759] text-xs font-bold inline-block border border-stone-300 dark:border-white/10">
                  {isArabic ? activeDish.regionAr : activeDish.regionEn}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                  {isArabic ? activeDish.titleAr : activeDish.titleEn}
                </h3>
                <div className="flex items-center gap-4 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-300/80 dark:border-stone-800">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[#ff7759]" />
                    {activeDish.prepTime + activeDish.cookTime}{" "}
                    {isArabic ? "دقيقة" : "mins"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-[#ff7759]" />
                    {isArabic ? "وصفة موثوقة" : "Verified Recipe"}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleClose();
                    if (onSelectDish) onSelectDish(activeDish);
                  }}
                  className="flex-1 py-3 px-5 rounded-full bg-[#ff7759] hover:bg-[#ff552e] text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>
                    {isArabic
                      ? "إضافة للجدول الأسبوعي"
                      : "Add to Meal Planner"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-[390px] sm:h-[440px] lg:h-[470px] w-full overflow-hidden rounded-3xl bg-[#f0eee8] dark:bg-[#162032] border border-[#e2e0d8] dark:border-[#2b3a54] shadow-sm flex items-center justify-center">
        <Carousel
          handleClick={handleClick}
          cards={dishes}
          isCarouselActive={isCarouselActive}
          isArabic={isArabic}
        />
      </div>
    </motion.div>
  );
}

export default ThreeDPhotoCarousel;
