# NotebookLM Recipe Expansion Prompt

This prompt is the source-review brief for the next Wajba catalog batch. Attach the current `recipes_data.json`, `recipes_audit.json`, `src/types.ts`, and `wajba_recipe_generator.py` to the NotebookLM notebook before running it.

## Research and generation prompt

```text
Act as a bilingual MENA culinary research editor for Wajba, a browser-only Arabic/English meal-planning app.

Produce exactly 16 new recipe seed records. The regional allocation is intentional:
- 8 Maghreb recipes, prioritizing Morocco and shared Amazigh/Maghreb food traditions.
- 4 Gulf recipes, including Saudi, Omani, Bahraini, and Qatari dishes.
- 2 Levant recipes, including Palestinian and Lebanese dishes.
- 1 Egyptian breakfast recipe.
- 1 shared regional soup.

Use the attached current catalog to exclude duplicate dishes and IDs. IDs must be lowercase kebab-case and stable. Prefer a specific dish and regional name over a generic "Arabic" label. Use the attached official tourism and UNESCO sources for cultural claims. Do not infer a specific origin when the sources only support a shared regional tradition.

For every record, return:
- id, titleAr, titleEn
- descriptionAr, descriptionEn (one concise sentence each)
- region: egypt | levant | gulf | maghreb | general
- mealType using only breakfast, lunch, dinner, snack, suhoor, iftar, dessert
- prep, cook, servings, difficulty, ramadan
- tags, imageQuery
- storyAr, storyEn (two sentences maximum, source-grounded)
- 5–7 practical ingredients with Arabic and English names, positive amounts, Arabic/English units, and one aisle from produce, meat, dairy, pantry, bakery, frozen, other
- exactly 4 paired Arabic/English preparation steps, written as real cooking actions
- timers as [stepIndex, titleAr, titleEn, durationMinutes], with indexes inside the four-step list

Content rules:
- Preserve cultural specificity without inventing dates, communities, religious requirements, or health benefits.
- Keep ingredient quantities usable for the stated servings and make every cooking instruction operational.
- Include safe food handling for poultry, meat, and seafood. Never provide home-curing instructions for unsafe fermented fish.
- Do not add nutrition, allergy, medical, licensing, or halal-certification claims unless the source explicitly supports them.
- Do not fabricate image URLs, licenses, ratings, votes, or user engagement.

Return only a JSON array of seed records. After the array, return a compact source map with one or more source URLs per regional group and a short note explaining which claims each source supports.
```

## Normalization and review prompt

```text
Review the generated recipe seed array against the attached Wajba catalog and schema.

Reject any duplicate ID or dish, missing Arabic/English pair, unequal step arrays, invalid enum, non-positive amount, unsupported aisle, unsafe instruction, unsupported cultural claim, or timer index outside the four-step instruction list. Check that every recipe has a useful meal slot, a realistic serving count, and an explicit Ramadan flag. Flag imageQuery values that are too generic for dish-specific Wikimedia lookup.

Return a correction table first, then the corrected JSON array only. Keep source-backed story wording conservative. Do not rewrite correct recipes merely for style.
```

The checked-in handoff result is [`recipe_expansion_seeds.json`](../recipe_expansion_seeds.json). It is intentionally a seed artifact: `wajba_recipe_generator.py` expands it into the full runtime schema, assigns neutral image placeholders in offline mode, and validates the generated catalog before it is copied into the app data.
