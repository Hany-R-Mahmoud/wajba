import { memo, useEffect, useLayoutEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { X, Sparkles, Clock, Flame, CalendarPlus } from "lucide-react";

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
  url: string;
  titleAr: string;
  titleEn: string;
  regionAr: string;
  regionEn: string;
  prepTime: number;
  cookTime: number;
}

export const DEFAULT_DISHES: DishCardData[] = [
  {
    id: "koshary",
    url: "https://images.unsplash.com/photo-1541518763669-27fef04b14e8?auto=format&fit=crop&q=80&w=800",
    titleAr: "الكشري المصري الأصيل",
    titleEn: "Authentic Egyptian Koshary",
    regionAr: "مصر 🇪🇬",
    regionEn: "Egypt 🇪🇬",
    prepTime: 20,
    cookTime: 40,
  },
  {
    id: "mansaf",
    url: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=800",
    titleAr: "المنسف الشامي بالجميد",
    titleEn: "Levantine Lamb Mansaf",
    regionAr: "بلاد الشام 🇵🇸 🇯🇴",
    regionEn: "Levant 🇵🇸 🇯🇴",
    prepTime: 30,
    cookTime: 90,
  },
  {
    id: "kabsa",
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800",
    titleAr: "الكبسة السعودية باللحم",
    titleEn: "Saudi Royal Lamb Kabsa",
    regionAr: "الخليج العربي 🇸🇦 🇦🇪",
    regionEn: "Arabian Gulf 🇸🇦 🇦🇪",
    prepTime: 25,
    cookTime: 60,
  },
  {
    id: "fatteh",
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    titleAr: "فتة الباذنجان والرُّمان",
    titleEn: "Eggplant & Pomegranate Fatteh",
    regionAr: "لبنان وسوريا 🇱🇧 🇸🇾",
    regionEn: "Lebanon & Syria 🇱🇧 🇸🇾",
    prepTime: 15,
    cookTime: 25,
  },
  {
    id: "tajine",
    url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=800",
    titleAr: "الطاجين المغربي بالبرقوق",
    titleEn: "Moroccan Lamb & Prune Tagine",
    regionAr: "المغرب العربي 🇲🇦",
    regionEn: "North Africa 🇲🇦",
    prepTime: 30,
    cookTime: 75,
  },
  {
    id: "atayef",
    url: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=800",
    titleAr: "القطايف الرمضانية بالقشطة",
    titleEn: "Ramadan Atayef with Cream",
    regionAr: "طبق رمضاني 🌙",
    regionEn: "Ramadan Special 🌙",
    prepTime: 20,
    cookTime: 15,
  },
  {
    id: "falafel",
    url: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&q=80&w=800",
    titleAr: "الفلافل والعمبة العراقية",
    titleEn: "Crispy Arab Falafel Platter",
    regionAr: "العراق ومصر 🇮🇶 🇪🇬",
    regionEn: "Middle East 🇮🇶 🇪🇬",
    prepTime: 20,
    cookTime: 15,
  },
  {
    id: "kunafa",
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    titleAr: "الكنافة النابلسية الجبنة",
    titleEn: "Golden Nabulsi Kunafa",
    regionAr: "فلسطين 🇵🇸",
    regionEn: "Palestine 🇵🇸",
    prepTime: 20,
    cookTime: 30,
  },
];

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

    // Balanced 3D forward tilt (-10deg) with -16px translateY so front card bottom is clearly visible above bottom pill
    const transform = useTransform(
      rotation,
      (value) => `translateY(-16px) rotateX(-10deg) rotateY(${value}deg)`
    );

    const fallbackImage = "https://images.unsplash.com/photo-1541518763669-27fef04b14e8?auto=format&fit=crop&q=80&w=800";

    return (
      <div
        className="flex h-full w-full items-center justify-center overflow-hidden pt-4 pb-12"
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
          }}
        >
          {cards.map((dish, i) => {
            const angle = i * (360 / faceCount);
            return (
              <motion.div
                key={`key-${dish.id}-${i}`}
                className="absolute flex flex-col rounded-2xl bg-white dark:bg-[#212e47] text-stone-900 dark:text-white p-2.5 border border-stone-300 dark:border-[#384966] shadow-2xl group cursor-pointer hover:border-[#ff7759] hover:shadow-orange-500/30 transition-all duration-300"
                style={{
                  width: `${cardWidth}px`,
                  height: `${isScreenSizeSm ? 250 : 285}px`,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "visible",
                }}
                onClick={() => handleClick(dish, i)}
              >
                {/* Fixed Aspect Image with Error Fallback */}
                <div className="relative w-full h-[150px] sm:h-[180px] rounded-xl overflow-hidden bg-stone-900 border border-black/10 dark:border-white/10">
                  <img
                    src={dish.url}
                    alt={isArabic ? dish.titleAr : dish.titleEn}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  />
                  <div className="absolute top-2 right-2 bg-[#121216]/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono text-[#ff7759] border border-white/15 font-bold shadow-md">
                    {isArabic ? dish.regionAr : dish.regionEn}
                  </div>
                </div>

                {/* Typography & Dish Meta */}
                <div className="p-2 space-y-1 font-mono text-center flex-1 flex flex-col justify-center">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white truncate group-hover:text-[#ff7759] transition-colors">
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-10"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
          >
            <div
              className="relative bg-[#162032] text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#2b3a54] shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-stone-900">
                <img
                  src={activeDish.url}
                  alt={isArabic ? activeDish.titleAr : activeDish.titleEn}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541518763669-27fef04b14e8?auto=format&fit=crop&q=80&w=800";
                  }}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="space-y-2 font-mono">
                <span className="px-3 py-1 rounded-full bg-stone-800 text-[#ff7759] text-xs font-bold inline-block border border-white/10">
                  {isArabic ? activeDish.regionAr : activeDish.regionEn}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {isArabic ? activeDish.titleAr : activeDish.titleEn}
                </h3>
                <div className="flex items-center gap-4 text-xs text-stone-300 pt-2 border-t border-stone-800">
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

      <div className="relative h-[440px] sm:h-[500px] lg:h-[540px] w-full overflow-hidden rounded-3xl bg-[#f0eee8] dark:bg-[#162032] border border-[#e2e0d8] dark:border-[#2b3a54] shadow-sm flex items-center justify-center">
        <Carousel
          handleClick={handleClick}
          cards={dishes}
          isCarouselActive={isCarouselActive}
          isArabic={isArabic}
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#17171c]/90 backdrop-blur-md text-white text-[11px] font-mono border border-white/20 pointer-events-none flex items-center gap-2 shadow-lg z-20">
          <Sparkles className="w-3.5 h-3.5 text-[#ff7759]" />
          <span>
            {isArabic
              ? "اسحب العجلة لاستعراض الأطباق التراثية ثلاثية الأبعاد ↺"
              : "Drag or swipe 3D carousel to spin dishes ↺"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ThreeDPhotoCarousel;

