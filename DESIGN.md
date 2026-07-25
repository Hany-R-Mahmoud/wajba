# Wajba UI Design Contract

## Visual language

- Warm stone canvas (`#f8f7f4` / `#eeece7`), white surfaces, near-black ink (`#17171c`), dark navy surfaces (`#162032`), and coral action accent (`#ff7759` / `#D86540`).
- Arabic uses Almarai/Cairo/Tajawal; English uses Plus Jakarta Sans. Monospace is reserved for compact metadata and controls.
- Cards use generous rounded corners (`rounded-2xl` to `rounded-3xl`), thin stone borders, restrained shadows, and coral hover/focus accents.

## Existing primitives

- `WajbaLogo` is the shared brand primitive.
- `Navbar` owns dashboard navigation and responsive tab access.
- `RecipeCard` is the canonical meal-card presentation: image, region badge, bilingual title, description, time, difficulty, votes, and planner action.
- `ThreeDPhotoCarousel` is the landing-page meal-card projection and opens a focused recipe action modal.

## Layout and behavior

- Dashboard recipe grids use one, two, and three columns as space allows; cards must remain readable in RTL and LTR.
- Landing and dashboard headers must not create horizontal page overflow. Desktop navigation collapses to the existing horizontally scrollable mobile tab row below the large breakpoint.
- Image crops use `object-cover`; image failures use `/recipe-placeholder.svg`, never another recipe image.
- Landing meal cards are projections of stable IDs from `src/data/recipes.ts`; titles, region labels, images, and timings must stay aligned with the runtime catalog.

## Accessibility and motion

- Meal images use the localized recipe title as alternative text. Interactive cards keep semantic buttons for actions and visible keyboard focus.
- Carousel motion is limited to transform/opacity and remains actionable with click/tap; no content depends on animation alone.
