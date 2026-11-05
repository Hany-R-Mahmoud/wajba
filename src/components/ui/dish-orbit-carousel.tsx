import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, SyntheticEvent } from 'react';
import { ArrowDown, ArrowRight, Clock, Users } from 'lucide-react';
import type { Language, Recipe } from '../../types';
import { LandingActions } from '../LandingActions';
import './dish-orbit-carousel.css';

interface DishOrbitCarouselProps {
  recipes: Recipe[];
  language: Language;
  onEnterDashboard: () => void;
}

const ACCENTS = ['#e9ba97', '#c4cfaa', '#edc689', '#d9b8a6', '#bdd0c3'];
const PINNED_QUERY = '(min-width: 1101px) and (min-height: 700px), (min-width: 360px) and (max-width: 767px) and (min-height: 780px)';

function useOrbitScroll(count: number, paused: boolean) {
  const trackRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => {
      const stage = trackRef.current?.firstElementChild;
      if (!stage || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const bounds = stage.getBoundingClientRect();
      const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 64);
      if (visibleHeight < Math.min(bounds.height, window.innerHeight - 64) / 2) return;
      // Automatic cycling never moves the page or strands visitors in the pinned sequence.
      setIndex(current => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [count, paused]);
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;
    const pinned = window.matchMedia(PINNED_QUERY);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateFromScroll = () => {
      if (!pinned.matches || reduced.matches) return;
      const travel = track.offsetHeight - (window.innerHeight - 64);
      // Before/after the finite track clamp to the endpoints; one recipe never divides by zero.
      const progress = Math.max(0, Math.min(1, (64 - track.getBoundingClientRect().top) / travel));
      setIndex(Math.round(progress * (count - 1)));
    };
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    updateFromScroll();
    return () => {
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
    };
  }, [count]);
  const selectRecipe = (next: number) => {
    const selected = Math.max(0, Math.min(count - 1, next));
    setIndex(selected);
    const track = trackRef.current;
    if (!track || count < 2 || !window.matchMedia(PINNED_QUERY).matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = window.scrollY + track.getBoundingClientRect().top - 64;
    window.scrollTo({ top: start + (track.offsetHeight - window.innerHeight + 64) * selected / (count - 1), behavior: 'instant' });
  };
  return { trackRef, index, selectRecipe };
}

function RecipeDetails({ recipe, language }: { recipe: Recipe; language: Language }) {
  const ar = language === 'ar';
  return <div className="dish-orbit__details" key={recipe.id}>
    <h2>{ar ? recipe.titleAr : recipe.titleEn}</h2>
    <div className="dish-orbit__metadata">
      <span><Clock size={16} aria-hidden="true" />{recipe.prepTimeMinutes + recipe.cookTimeMinutes} {ar ? 'دقيقة' : 'min'}</span>
      <span><Users size={16} aria-hidden="true" />{recipe.servings} {ar ? 'أفراد' : 'servings'}</span>
    </div>
    <p>{ar ? recipe.descriptionAr : recipe.descriptionEn}</p>
    <a href={`/recipes/${encodeURIComponent(recipe.id)}`}>{ar ? 'شوف الوصفة والمقادير' : 'View recipe & ingredients'}<ArrowRight size={18} className="dish-orbit__link-arrow" aria-hidden="true" /></a>
  </div>;
}

function RecipeThumbnails({ recipes, language, index, selectRecipe }: {
  recipes: Recipe[]; language: Language; index: number; selectRecipe: (next: number) => void;
}) {
  const ar = language === 'ar';
  return <div className="dish-orbit__thumbnails" aria-label={ar ? 'اختيار وصفة' : 'Choose a recipe'}>
    {recipes.map((recipe, recipeIndex) => <button key={recipe.id} type="button" onClick={() => selectRecipe(recipeIndex)}
      aria-label={ar ? recipe.titleAr : recipe.titleEn} aria-pressed={recipeIndex === index}>
      <img src={recipe.image} alt="" width="56" height="56" onError={recipeImageFallback} />
      <span>{ar ? recipe.titleAr : recipe.titleEn}</span>
    </button>)}
  </div>;
}

function recipeImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  if (event.currentTarget.getAttribute('src') !== '/recipe-placeholder.svg') {
    event.currentTarget.src = '/recipe-placeholder.svg';
  }
}

export function DishOrbitCarousel({ recipes, language, onEnterDashboard }: DishOrbitCarouselProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const { trackRef, index, selectRecipe } = useOrbitScroll(recipes.length, hovered || focused || touching);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const ar = language === 'ar';
  const recipe = recipes[index];
  if (!recipe) return <LandingActions language={language} onEnterDashboard={onEnterDashboard} />;
  const keyboardRecipe = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    const direction = ar ? -1 : 1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      selectRecipe(index + (event.key === 'ArrowRight' ? direction : -direction));
    }
  };
  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const distance = event.clientX - start.x;
    if (Math.abs(distance) > 45 && Math.abs(distance) > Math.abs(event.clientY - start.y)) {
      selectRecipe(index + (distance < 0 ? 1 : -1) * (ar ? -1 : 1));
    }
  };
  const orbitStyle = { '--dish-accent': ACCENTS[index % ACCENTS.length], '--orbit-angle': `${index * 14}deg` } as CSSProperties;

  return <section ref={trackRef} className="dish-orbit" dir={ar ? 'rtl' : 'ltr'} aria-label={ar ? 'وصفات مصرية من وجبة' : 'Egyptian recipes from Wajba'}
    aria-roledescription={ar ? 'عرض وصفات متحرك' : 'carousel'} style={orbitStyle}>
    <div className="dish-orbit__stage" tabIndex={0} onKeyDown={keyboardRecipe} role="group" aria-label={ar ? 'تصفح الوصفات بمفاتيح الأسهم' : 'Browse recipes with arrow keys'}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false); }}
      onPointerDown={() => setTouching(true)} onPointerUp={() => setTouching(false)} onPointerCancel={() => setTouching(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}>
      <div className="dish-orbit__backdrop" aria-hidden="true" />
      <svg className="dish-orbit__arc" viewBox="0 0 1200 700" fill="none" aria-hidden="true"><path d="M-100 530C80-160 850-150 1300 150" stroke="currentColor" strokeWidth="170" /></svg>
      <div className="dish-orbit__intro">
        <h1>{ar ? <>كل يوم أكلة من بيتنا.<br /><strong>وأسبوعك على ذوقك.</strong></> : <>A taste of home, every day.<br /><strong>A week planned your way.</strong></>}</h1>
        <p>{ar ? 'وصفات مصرية، جدول لعيلتك، وقائمة تسوق تجمع كل اللي ناقصك.' : 'Egyptian recipes, a family meal plan, and one list for everything you need.'}</p>
      </div>
      <div className="dish-orbit__menu">
        <div className="dish-orbit__photos" onPointerDown={event => {
          swipeStart.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }} onPointerUp={finishSwipe} onPointerCancel={() => { swipeStart.current = null; }}>
          {recipes.map((dish, dishIndex) => <div key={dish.id} className="dish-orbit__photo" aria-hidden={dishIndex !== index}
            data-position={dishIndex === index ? 'active' : dishIndex < index ? 'before' : 'after'}>
            <img src={dish.image} alt={ar ? dish.titleAr : dish.titleEn} draggable={false} width="480" height="480"
              fetchPriority={dishIndex === 0 ? 'high' : 'auto'} onError={recipeImageFallback} />
          </div>)}
        </div>
        <RecipeDetails recipe={recipe} language={language} />
        <aside className="dish-orbit__ingredients" key={recipe.id}>
          <h3>{ar ? 'من مطبخك تبدأ الحكاية' : 'It starts in your kitchen'}</h3>
          <ul>{recipe.ingredients.slice(0, 4).map(ingredient => <li key={ingredient.id}>{ar ? ingredient.nameAr : ingredient.nameEn}</li>)}</ul>
          <p>{ar ? 'اختار أكلك. وجبة تجمع لك المقادير في قائمة واحدة.' : 'Choose your meals. Wajba brings the ingredients into one shopping list.'}</p>
        </aside>
      </div>
      <div className="dish-orbit__bottom">
        <div className="dish-orbit__browse">
          <span className="sr-only" aria-live={hovered || focused || touching ? 'polite' : 'off'} aria-atomic="true">{ar ? recipe.titleAr : recipe.titleEn}</span>
          <RecipeThumbnails recipes={recipes} language={language} index={index} selectRecipe={selectRecipe} />
        </div>
        <LandingActions language={language} onEnterDashboard={onEnterDashboard} />
      </div>
      <a className="dish-orbit__continue" href="#wajba-features">{ar ? 'اكتشف باقي وجبة' : 'Discover more of Wajba'}<ArrowDown size={16} aria-hidden="true" /></a>
    </div>
  </section>;
}
