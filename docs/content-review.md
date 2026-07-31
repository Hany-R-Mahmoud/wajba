# Recipe Content Review

## Catalog Snapshot

The reviewed catalog contains 49 stable recipe IDs:

| Region | Recipes |
|---|---:|
| Egypt | 21 |
| Levant | 13 |
| Gulf | 10 |
| Maghreb | 1 |
| General / shared | 4 |

Every recipe has Arabic and English titles, descriptions, ingredients, preparation steps, servings, timing, difficulty, tags, and a cultural story. Where a recipe includes timed work, timer indexes are checked against the instruction list.

## Source Review

The enrichment pass recorded these source references in `recipes_audit.json`:

- [Experience Egypt — gastronomy](https://www.experienceegypt.eg/en/Attraction-Details/315/gastronomy-)
- [Jordan Tourism Board — feasting in Jordan](https://international.visitjordan.com/page/13/FeastinginJordan.aspx)
- [Experience Abu Dhabi — Emirati food](https://visitabudhabi.ae/en/plan-your-trip/article-hub/emirati-food-to-try)
- [Visit Qatar — cuisine](https://visitqatar.com/intl-en/about-qatar/cuisine)
- [Visit Saudi — jareesh](https://www.visitsaudi.com/en/stories/aljareesh-dish)
- [UNESCO — al-mansaf](https://ich.unesco.org/en/RL/al-mansaf-in-jordan-a-festive-banquet-and-its-social-and-cultural-meanings-01849)

This is the handoff shape for the NotebookLM workflow: source notes are consolidated, recipe facts are normalized into the project schema, bilingual content is reconciled into the runtime catalog, and the generated audit is reviewed before release. `src/data/recipes.ts` is the runtime source of truth; the checked-in JSON files are generator/export artifacts and can intentionally differ in image URLs or runtime-derived dietary tags. The audit and source links above are the evidence used for the catalog claims here.

## Verification

- `recipes_enriched.json` reports no schema validation issues.
- `python3 wajba_recipe_generator.py --offline --output recipes_enriched.json --audit-output recipes_audit.json` is rerunnable; existing generated seed IDs are skipped and reported in the audit.
- Arabic and English instruction arrays have matching lengths.
- Ingredient IDs are unique within each recipe.
- Timer indexes point to existing instruction steps.
- Recipe IDs remain stable so saved plans are not orphaned.
- Dietary labels are informational and are not medical or allergy advice.

## Remaining Human Review

The audit identifies placeholder images and repeated stock imagery. These are intentionally retained as safe fallbacks and must be visually approved or replaced with dish-specific, licensed images before production publishing. Nutrition facts and allergen guarantees are not included because no verified source set for those fields is present.
