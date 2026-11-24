# Seasonal produce: English translation and dataset review

Status: **English wording approved by the owner on 2026-11-24.** Dataset source approval is still open (section 5). Source: `src/data/seasons.ts`, ported from Mawsimha dataset `mawsimha-v1-2026-11-02`.

Rule followed: Arabic names, categories, season months, peak months and Arabic hints are copied verbatim and were not changed. The two Arabic notes were reworded from Egyptian to standard Arabic (originals recorded in the table below) (checked by a one-off comparison against Mawsimha `src/data/produce.ts`). Every English string below was written by an AI assistant. Nothing here is approved wording. When the owner approves, set `ENGLISH_IS_DRAFT = false` in `src/data/seasons.ts` to show English names on the public Arabic /seasons page. The draft note is no longer shown in the app UI.

## 1. English names and cook hints (36 items)

| ID | Arabic name (verbatim) | English name (draft) | Arabic hint (verbatim) | English hint (draft) | Owner OK |
|---|---|---|---|---|---|
| 01 | طماطم | Tomato | صلصة، خضار مطبوخ، سلطة | Sauce, cooked vegetables, salad | ☐ |
| 02 | خيار | Cucumber | سلطة، مخلل سريع، سلطة زبادي | Salad, quick pickle, yogurt salad | ☐ |
| 03 | باذنجان | Eggplant | مسقعة، بابا غنوج، مقلي | Moussaka, baba ghanoush, fried | ☐ |
| 04 | كوسة | Zucchini | محشي، خضار سوتيه، شوربة | Stuffed, sautéed vegetables, soup | ☐ |
| 05 | فلفل رومي | Bell pepper | سلطة، محشي، شكشوكة | Salad, stuffed, shakshuka | ☐ |
| 06 | بامية | Okra | بامية بالصلصة، ويكة | Okra in tomato sauce, weika | ☐ |
| 07 | فاصوليا خضراء | Green beans | فاصوليا بالصلصة، سوتيه | Beans in tomato sauce, sautéed | ☐ |
| 08 | بسلة | Peas | بسلة بالجزر، شوربة، رز بالخضار | Peas with carrots, soup, vegetable rice | ☐ |
| 09 | سبانخ | Spinach | سبانخ بالصلصة، فطاير، شوربة | Spinach in tomato sauce, fatayer (savory pies), soup | ☐ |
| 10 | ملوخية | Molokhia | ملوخية بالفراخ أو اللحمة | Molokhia with chicken or meat | ☐ |
| 11 | كرنب | Cabbage | محشي كرنب، شوربة | Stuffed cabbage rolls, soup | ☐ |
| 12 | قرنبيط | Cauliflower | قرنبيط مقلي، بالصلصة | Fried cauliflower, in tomato sauce | ☐ |
| 13 | جزر | Carrot | شوربة، سلطة، مخلل | Soup, salad, pickles | ☐ |
| 14 | بطاطس | Potato | صينية، مقلية، شوربة | Tray bake, fries, soup | ☐ |
| 15 | بصل | Onion | أساس الطبخ، مخلل، صواني | The base of most cooking, pickles, trays | ☐ |
| 16 | ثوم | Garlic | تقلية، تتبيلة، مخلل | Taqliya (garlic fry), marinade, pickles | ☐ |
| 17 | خس | Lettuce | سلطة، ساندوتشات | Salad, sandwiches | ☐ |
| 18 | جرجير | Arugula | سلطة جرجير، مع الفول والجبنة | Arugula salad, with fava beans and cheese | ☐ |
| 19 | خضرة (بقدونس وشبت وكزبرة) | Fresh herbs (parsley, dill, coriander) | سلطة، محشي، تتبيلة | Salad, stuffing, marinade | ☐ |
| 20 | برتقال بلدي | Baladi orange | عصير، سلطة فواكه، كيك | Juice, fruit salad, cake | ☐ |
| 21 | يوسفي | Mandarin | أكل طازج، عصير، سلطة فواكه | Fresh, juice, fruit salad | ☐ |
| 22 | ليمون بلدي | Baladi lemon | عصير، تتبيلة، مخلل | Juice, marinade, pickles | ☐ |
| 23 | جوافة | Guava | عصير، أكل طازج، سلطة فواكه | Juice, fresh, fruit salad | ☐ |
| 24 | مانجو | Mango | عصير، أكل طازج، سلطة فواكه | Juice, fresh, fruit salad | ☐ |
| 25 | عنب | Grapes | أكل طازج، ورق عنب في موسمه | Fresh; grape leaves in season | ☐ |
| 26 | تين برشومي | Prickly pear (barshomi) | أكل طازج، مع الجبنة والعسل | Fresh, with cheese and honey | ☐ |
| 27 | رمان | Pomegranate | سلطة، عصير، فتة | Salad, juice, fatteh | ☐ |
| 28 | فراولة | Strawberry | عصير، مربى، سلطة فواكه | Juice, jam, fruit salad | ☐ |
| 29 | موز بلدي | Baladi banana | أكل طازج، عصير باللبن، كيك | Fresh, milk smoothie, cake | ☐ |
| 30 | بطيخ | Watermelon | أكل طازج مع الجبنة، عصير | Fresh with cheese, juice | ☐ |
| 31 | شمام (كنتالوب) | Melon (cantaloupe) | أكل طازج، عصير | Fresh, juice | ☐ |
| 32 | خوخ | Peach | أكل طازج، عصير، سلطة فواكه | Fresh, juice, fruit salad | ☐ |
| 33 | مشمش | Apricot | أكل طازج، قمر الدين، مربى | Fresh, qamar al-din, jam | ☐ |
| 34 | برقوق | Plum | أكل طازج، عصير | Fresh, juice | ☐ |
| 35 | بلح (زغلول وسيوي) | Fresh dates (zaghloul and siwi) | أكل طازج، مع اللبن، حلو | Fresh, with milk, desserts | ☐ |
| 36 | خرشوف | Artichoke | خرشوف باللحمة المفرومة، شوربة | Artichoke with minced meat, soup | ☐ |

| Item | Arabic (verbatim) | English (draft) | Owner OK |
|---|---|---|---|
| Guide note (now plain standard Arabic; original Mawsimha wording was Egyptian: دليل مواسم مش قايمة أسعار — التوفر بيختلف حسب السوق والمنطقة) | دليل مواسم وليس قائمة أسعار. التوفر يختلف حسب السوق والمنطقة | A seasonal guide, not a price list. Availability varies by market and region. | ☐ |
| Source note (reworded to standard Arabic; original: متجمع من تقاويم الزراعة والحصاد المصرية المتاحة للعامة، بتاريخ 2026-11-02; not shown in the UI until the owner confirms the claim) | مجمّع من تقاويم الزراعة والحصاد المصرية المتاحة للعموم، بتاريخ 2026-11-02 | Compiled from publicly available Egyptian planting and harvest calendars, dated 2026-11-02. | ☐ |
| Month names | يناير، فبراير، مارس، أبريل، مايو، يونيو، يوليو، أغسطس، سبتمبر، أكتوبر، نوفمبر، ديسمبر | January, February, March, April, May, June, July, August, September, October, November, December | ☐ |
| Category labels | خضار، فاكهة، خضرة | Vegetables, Fruit, Herbs | ☐ |

## 2. Other English strings (draft)

All other English text is in `src/components/SeasonalView.tsx`, the grocery hint in `src/components/GroceryListView.tsx` ("In season now", "Peak season now"), and the "Seasonal this month" filter in `src/components/RecipeExplorer.tsx`. Arabic UI strings in those files are new (not from Mawsimha) and also need an Arabic review; they use plain standard Arabic to match the rest of Wajba, not Mawsimha's Egyptian dialect.

Corrected English (this pass): row 26 was wrong (prickly pear, not a fig); rows 09, 14, 15, 16, 33, 35 reworded.

## 3. Dataset doubts (Arabic and months NOT changed)

1. **26 تين برشومي**: in Egyptian use "برشومي" usually means prickly pear, but the hint (with cheese and honey) fits true figs. English is now written "Prickly pear (barshomi)". The matcher also maps the plain word `تين` (fresh figs) to this item. Owner to confirm which fruit is meant.
2. **31 شمام (كنتالوب)**: شمام is often a honeydew-type melon, the author wrote cantaloupe in brackets. English: "Melon (cantaloupe)".
3. **Year-round items** (طماطم، بطاطس، بصل، ثوم، خضرة، موز بلدي): the dataset lists all 12 months with a peak window. The app shows them as in season every month and never counts them as "seasonal" in the recipe filter or grocery hint. Confirm this reading.
4. **22 ليمون بلدي** is in season 8 months (Nov to Jun). It counts as a limited-season item, so many recipes that only use lemon juice show up under "Seasonal this month" in winter and spring. The owner may prefer to treat items with 8 or more months as near year-round.
5. **13 جزر** (Nov to Apr): carrots are on sale in more months than this window. Not verified either way.
6. **36 خرشوف** (Dec to Apr): Mawsimha `DATASET-NOTE.md` records one processor source listing January to June. No Wajba recipe uses artichoke yet.
7. **Verification depth**: per `DATASET-NOTE.md` section 3, only a sample (mostly fruit) was checked against public sources. Most vegetables rest on the dataset's own source note only.
8. **06 بامية، ويكة**: "weika" is kept as a transliteration (a dried-okra stew); no English dish name exists.
9. **35 بلح (زغلول وسيوي)**: zaghloul and siwi are date varieties. English: "Fresh dates (zaghloul and siwi)". Dried dates (`تمر`, `عجوة`) are deliberately not matched.

## 4. Matching limits (not translation, but the owner should know)

- Matching reads the Arabic ingredient name only, on produce-aisle lines only. Pantry-aisle lines such as "ثوم وكمون وليمون وكزبرة" are ignored.
- Compound lines ("بصل وثوم") count every item they name; a line is "in season" only if all of its named items are.
- Excluded on purpose: spring onion (بصل أخضر), tomato paste or sauce, preserved or dried lemon, dried figs and apricots, pomegranate molasses, dried or ground coriander, banana leaf. Ambiguous words (bare فلفل, فاصوليا, تمر) match nothing.
- Custom recipes are matched by their Arabic ingredient names; a custom recipe with English-only names is not scored.

## 5. Owner gates

- [x] Approve or edit the English wording above (approved 2026-11-24; `ENGLISH_IS_DRAFT` set to `false`).
- [ ] Approve the dataset source (compiled from public Egyptian planting and harvest calendars, dated 2026-11-02) before the feature is advertised. Mawsimha's own prompt required an owner re-check before ship.
- [ ] Answer doubts 1 to 5.
