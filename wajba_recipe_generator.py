#!/usr/bin/env python3
"""
Generate an enriched Wajba recipe database.

The script is deliberately self-contained:
  * no third-party Python packages;
  * no required input file (it can generate the 24 new recipes by itself);
  * automatic discovery of an existing recipes_data.json when present;
  * strict schema validation and a separate audit report;
  * optional, API-key-free Wikimedia Commons image lookup.

Examples:
  python wajba_recipe_generator.py
  python wajba_recipe_generator.py --input path/to/recipes_data.json
  python wajba_recipe_generator.py --offline --output recipes_enriched.json
  python wajba_recipe_generator.py --new-only --offline

Research references (accessed 2026-07-25):
  Egyptian Tourism Authority:
    https://www.experienceegypt.eg/en/Attraction-Details/315/gastronomy-
  Jordan Tourism Board:
    https://international.visitjordan.com/page/13/FeastinginJordan.aspx
  Experience Abu Dhabi:
    https://visitabudhabi.ae/en/plan-your-trip/article-hub/emirati-food-to-try
  Visit Qatar:
    https://visitqatar.com/intl-en/about-qatar/cuisine
  Visit Saudi, Jareesh:
    https://www.visitsaudi.com/en/stories/aljareesh-dish
  UNESCO, Al-Mansaf:
    https://ich.unesco.org/en/RL/al-mansaf-in-jordan-a-festive-banquet-and-its-social-and-cultural-meanings-01849
"""

from __future__ import annotations

import argparse
import copy
import datetime as dt
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any


REGIONS = ["egypt", "levant", "gulf", "maghreb", "general"]
MEAL_SLOTS = ["breakfast", "lunch", "dinner", "snack", "suhoor", "iftar", "dessert"]
AISLES = ["produce", "meat", "dairy", "pantry", "bakery", "frozen", "other"]
DIFFICULTIES = ["easy", "medium", "hard"]

SCHEMA = {
    "types": {
        "Region": REGIONS,
        "MealSlot": MEAL_SLOTS,
        "IngredientAisle": AISLES,
        "Difficulty": DIFFICULTIES,
    },
    "newMealTemplate": {
        "id": "unique-slug-id (e.g. jordan-mansaf)",
        "titleAr": "عنوان الوجبة بالعربية",
        "titleEn": "Meal Title in English",
        "descriptionAr": "وصف قصير للوجبة بالعربية",
        "descriptionEn": "Short description in English",
        "region": "egypt | levant | gulf | maghreb | general",
        "mealType": ["lunch", "dinner", "iftar"],
        "prepTimeMinutes": 30,
        "cookTimeMinutes": 90,
        "servings": 6,
        "difficulty": "easy | medium | hard",
        "isRamadanSpecial": True,
        "tags": ["أردني", "منسف", "عزائم"],
        "image": "https://example.org/image.jpg",
        "galleryImages": ["https://example.org/image-1.jpg"],
        "storyAr": "قصة الطبق والتاريخ التراثي بالعربية",
        "storyEn": "Cultural history and story in English",
        "ingredients": [
            {
                "id": "ing-1",
                "nameAr": "لحم ضأن",
                "nameEn": "Lamb Meat",
                "amount": 1.5,
                "unitAr": "كجم",
                "unitEn": "kg",
                "aisle": "meat",
            }
        ],
        "instructionsAr": ["خطوة التحضير بالعربية"],
        "instructionsEn": ["Preparation step in English"],
        "timerSteps": [
            {
                "stepIndex": 0,
                "titleAr": "عنوان المؤقت",
                "titleEn": "Timer title",
                "durationMinutes": 30,
            }
        ],
        "votesCount": {"likes": 0, "dislikes": 0},
        "rating": 0.0,
    },
}

# A transparent fallback is preferable to an unrelated stock photograph.
PLACEHOLDER = (
    "https://placehold.co/1000x700/f3ead8/6b4226"
    "?text={text}"
)

SOURCE_URLS = [
    "https://www.experienceegypt.eg/en/Attraction-Details/315/gastronomy-",
    "https://international.visitjordan.com/page/13/FeastinginJordan.aspx",
    "https://visitabudhabi.ae/en/plan-your-trip/article-hub/emirati-food-to-try",
    "https://visitqatar.com/intl-en/about-qatar/cuisine",
    "https://www.visitsaudi.com/en/stories/aljareesh-dish",
    "https://ich.unesco.org/en/RL/al-mansaf-in-jordan-a-festive-banquet-and-its-social-and-cultural-meanings-01849",
]


def ing(ar: str, en: str, amount: float, unit_ar: str, unit_en: str, aisle: str):
    return (ar, en, amount, unit_ar, unit_en, aisle)


# Compact authored source data. build_recipe() expands every item to the exact
# project schema. Image queries are intentionally precise; the resolver rejects
# weak filename matches and leaves a clearly labelled placeholder.
RECIPE_SEEDS: list[dict[str, Any]] = [
    {
        "id": "egypt-kofta-haty",
        "titleAr": "كفتة الحاتي المصرية",
        "titleEn": "Egyptian Kofta Haty",
        "descriptionAr": "أصابع لحم متبلة بالبصل والبقدونس ومشوية على الفحم على طريقة محلات الكباب المصرية.",
        "descriptionEn": "Charcoal-grilled minced beef and lamb skewers seasoned with onion, parsley, and warm spices.",
        "region": "egypt", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 30, "cook": 18, "servings": 5, "difficulty": "medium", "ramadan": True,
        "tags": ["مصري", "مشويات", "كفتة", "عزائم"], "imageQuery": "Egyptian kofta grilled",
        "storyAr": "ترتبط كفتة الحاتي بمحلات الكباب الشعبية في القاهرة والإسكندرية، حيث تمنحها نار الفحم رائحتها المميزة.",
        "storyEn": "Kofta Haty is associated with Egypt's neighborhood kebab shops, where charcoal gives the skewers their characteristic smoky aroma.",
        "ingredients": [
            ing("لحم بقري مفروم", "Minced beef", 700, "جرام", "g", "meat"),
            ing("لحم ضأن مفروم", "Minced lamb", 200, "جرام", "g", "meat"),
            ing("بصل مبشور ومصفى", "Grated, drained onion", 2, "حبة", "pcs", "produce"),
            ing("بقدونس مفروم", "Chopped parsley", 0.5, "كوب", "cup", "produce"),
            ing("بهارات لحم وفلفل أسود", "Meat spice and black pepper", 2, "ملعقة صغيرة", "tsp", "pantry"),
            ing("ملح", "Salt", 1.5, "ملعقة صغيرة", "tsp", "pantry"),
        ],
        "stepsAr": [
            "اخلط اللحم مع البصل المصفى والبقدونس والبهارات والملح حتى يتماسك الخليط.",
            "غط الخليط وبرّده 20 دقيقة، ثم شكله أصابع حول أسياخ معدنية.",
            "اشوِ الكفتة على فحم متوسط الحرارة مع تدويرها حتى تتحمر وتنضج.",
            "اتركها دقيقتين ثم قدمها مع الطحينة والخبز البلدي والسلطة.",
        ],
        "stepsEn": [
            "Mix both meats with drained onion, parsley, spices, and salt until cohesive.",
            "Cover and chill for 20 minutes, then shape firmly around metal skewers.",
            "Grill over medium charcoal, turning until browned and safely cooked through.",
            "Rest for two minutes and serve with tahini, baladi bread, and salad.",
        ], "timers": [(1, "تبريد الخليط", "Chill mixture", 20), (2, "شوي الكفتة", "Grill kofta", 12)],
    },
    {
        "id": "egypt-hamam-mahshi",
        "titleAr": "حمام محشي بالفريك",
        "titleEn": "Egyptian Pigeon Stuffed with Freekeh",
        "descriptionAr": "حمام كامل محشو بالفريك المتبل ومسلوق ثم محمر بالسمن.",
        "descriptionEn": "Whole pigeon filled with spiced freekeh, gently simmered, then browned in ghee.",
        "region": "egypt", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 35, "cook": 60, "servings": 4, "difficulty": "hard", "ramadan": True,
        "tags": ["مصري", "حمام", "فريك", "عزائم"], "imageQuery": "Egyptian stuffed pigeon freekeh",
        "storyAr": "الحمام المحشي طبق احتفالي قديم في الريف والمدن المصرية ويقدم عادة في الولائم والمناسبات.",
        "storyEn": "Stuffed pigeon is a long-standing Egyptian celebration dish served at family feasts in both rural and urban communities.",
        "ingredients": [
            ing("حمام منظف", "Cleaned pigeons", 4, "حبة", "pcs", "meat"),
            ing("فريك مغسول", "Rinsed freekeh", 1.5, "كوب", "cups", "pantry"),
            ing("بصل مفروم", "Chopped onion", 1, "حبة", "pc", "produce"),
            ing("كبد وقوانص الحمام", "Pigeon liver and giblets", 150, "جرام", "g", "meat"),
            ing("سمن بلدي", "Ghee", 3, "ملعقة كبيرة", "tbsp", "dairy"),
            ing("هيل وورق غار وفلفل", "Cardamom, bay, and pepper", 1, "ملعقة كبيرة", "tbsp", "pantry"),
        ],
        "stepsAr": [
            "شوح البصل والكبد والقوانص في السمن ثم أضف الفريك والبهارات وقليلاً من الماء حتى نصف النضج.",
            "احش الحمام دون ضغط زائد وأغلق الفتحة بخيط مطبخ.",
            "اسلق الحمام برفق في ماء متبل بالهيل وورق الغار حتى ينضج.",
            "جففه وادهنه بالسمن ثم حمّره في الفرن قبل التقديم.",
        ],
        "stepsEn": [
            "Sauté onion, liver, and giblets in ghee; add freekeh, spices, and a little water and cook halfway.",
            "Loosely stuff each pigeon and secure the opening with kitchen twine.",
            "Gently simmer in water seasoned with cardamom and bay until cooked through.",
            "Dry, brush with ghee, and roast briefly until deeply browned.",
        ], "timers": [(2, "سلق الحمام", "Simmer pigeons", 40), (3, "التحمير", "Brown in oven", 12)],
    },
    {
        "id": "egypt-roz-meammar",
        "titleAr": "أرز معمر مصري",
        "titleEn": "Egyptian Roz Meammar",
        "descriptionAr": "أرز قصير الحبة مخبوز بالحليب والقشطة والسمن حتى تتكون قشرة ذهبية.",
        "descriptionEn": "Short-grain rice baked with milk, cream, and ghee beneath a golden crust.",
        "region": "egypt", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 10, "cook": 55, "servings": 6, "difficulty": "easy", "ramadan": True,
        "tags": ["مصري", "أرز", "طاجن", "ريفي"], "imageQuery": "Egyptian roz meammar rice",
        "storyAr": "يشتهر الأرز المعمر في قرى دلتا النيل ويخبز تقليدياً في طواجن فخار تحتفظ بالحرارة.",
        "storyEn": "Roz meammar is strongly associated with Nile Delta villages and is traditionally baked in heat-retaining clay casseroles.",
        "ingredients": [
            ing("أرز مصري قصير الحبة", "Egyptian short-grain rice", 2, "كوب", "cups", "pantry"),
            ing("حليب كامل الدسم", "Whole milk", 4, "كوب", "cups", "dairy"),
            ing("قشطة", "Cream", 0.75, "كوب", "cup", "dairy"),
            ing("سمن بلدي", "Ghee", 2, "ملعقة كبيرة", "tbsp", "dairy"),
            ing("ملح", "Salt", 1, "ملعقة صغيرة", "tsp", "pantry"),
            ing("فلفل أسود", "Black pepper", 0.5, "ملعقة صغيرة", "tsp", "pantry"),
        ],
        "stepsAr": [
            "اغسل الأرز وانقعه 15 دقيقة ثم صفه وضعه في طاجن مدهون بالسمن.",
            "سخن الحليب مع الملح والفلفل دون غليان واسكبه فوق الأرز.",
            "وزع القشطة والسمن على الوجه واخبز في فرن ساخن حتى يمتص الأرز السائل.",
            "ارفع الحرارة في الدقائق الأخيرة حتى يصبح الوجه ذهبياً ثم أرحه قبل التقديم.",
        ],
        "stepsEn": [
            "Rinse rice, soak for 15 minutes, drain, and place in a ghee-coated casserole.",
            "Warm milk with salt and pepper without boiling, then pour it over the rice.",
            "Dot the top with cream and ghee and bake until the rice absorbs the liquid.",
            "Increase heat briefly to brown the top, then rest before serving.",
        ], "timers": [(0, "نقع الأرز", "Soak rice", 15), (2, "خبز الأرز", "Bake rice", 45)],
    },
    {
        "id": "egypt-bessara",
        "titleAr": "البصارة المصرية",
        "titleEn": "Egyptian Bessara",
        "descriptionAr": "مهروس فول مدشوش أخضر بالأعشاب والثوم يزين بالبصل المقرمش.",
        "descriptionEn": "A green split-fava purée with herbs and garlic, topped with crisp onions.",
        "region": "egypt", "mealType": ["breakfast", "lunch", "dinner"],
        "prep": 15, "cook": 45, "servings": 6, "difficulty": "easy", "ramadan": False,
        "tags": ["مصري", "نباتي", "فول", "اقتصادي"], "imageQuery": "Egyptian bessara fava bean dip",
        "storyAr": "البصارة من أطباق البيوت المصرية الاقتصادية القديمة وتعتمد على الفول المدشوش والأعشاب المتاحة.",
        "storyEn": "Bessara is an old, economical Egyptian home dish built from split fava beans and abundant fresh herbs.",
        "ingredients": [
            ing("فول مدشوش", "Split fava beans", 2, "كوب", "cups", "pantry"),
            ing("بقدونس وشبت وكزبرة", "Parsley, dill, and cilantro", 2, "كوب", "cups", "produce"),
            ing("بصل", "Onions", 3, "حبة", "pcs", "produce"),
            ing("ثوم", "Garlic", 6, "فصوص", "cloves", "produce"),
            ing("كمون وكزبرة جافة", "Cumin and ground coriander", 2, "ملعقة صغيرة", "tsp", "pantry"),
            ing("زيت نباتي", "Vegetable oil", 4, "ملعقة كبيرة", "tbsp", "pantry"),
        ],
        "stepsAr": [
            "اغسل الفول المدشوش واسلقه مع بصلة والثوم والأعشاب حتى يطرى تماماً.",
            "اخلط المزيج حتى يصبح مهروساً ناعماً ثم أعده إلى نار هادئة وتبله.",
            "حمّر شرائح البصل في الزيت حتى تصبح مقرمشة واحتفظ بقليل من الزيت.",
            "قدم البصارة دافئة أو باردة وزينها بالبصل المقرمش.",
        ],
        "stepsEn": [
            "Rinse split favas and simmer with one onion, garlic, and herbs until completely tender.",
            "Blend smooth, return to low heat, and season with cumin, coriander, and salt.",
            "Fry sliced remaining onions in oil until crisp and reserve a little flavored oil.",
            "Serve warm or cool, topped with the crisp onions.",
        ], "timers": [(0, "سلق الفول", "Simmer fava beans", 35), (2, "تحمير البصل", "Crisp onions", 10)],
    },
    {
        "id": "egypt-feteer-meshaltet",
        "titleAr": "الفطير المشلتت",
        "titleEn": "Egyptian Feteer Meshaltet",
        "descriptionAr": "فطير ريفي متعدد الطبقات مورق بالسمن ويقدم مع العسل والجبن.",
        "descriptionEn": "A flaky, many-layered country pastry enriched with ghee and served with honey or cheese.",
        "region": "egypt", "mealType": ["breakfast", "snack"],
        "prep": 45, "cook": 25, "servings": 8, "difficulty": "hard", "ramadan": False,
        "tags": ["مصري", "فطير", "ريفي", "مخبوزات"], "imageQuery": "Egyptian feteer meshaltet",
        "storyAr": "الفطير المشلتت رمز للضيافة الريفية المصرية، وتبنى طبقاته بفرد العجين وطيه مراراً بالسمن.",
        "storyEn": "Feteer meshaltet is a symbol of rural Egyptian hospitality, with layers built by repeatedly stretching and folding ghee-brushed dough.",
        "ingredients": [
            ing("دقيق خبز", "Bread flour", 750, "جرام", "g", "pantry"),
            ing("ماء فاتر", "Lukewarm water", 400, "مل", "ml", "other"),
            ing("ملح", "Salt", 1.5, "ملعقة صغيرة", "tsp", "pantry"),
            ing("سمن بلدي مذاب", "Melted ghee", 250, "جرام", "g", "dairy"),
            ing("زيت", "Oil", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("عسل للتقديم", "Honey, to serve", 0.5, "كوب", "cup", "pantry"),
        ],
        "stepsAr": [
            "اعجن الدقيق والماء والملح حتى تصبح العجينة ناعمة ثم أرحها 30 دقيقة.",
            "قسم العجين كرات وادهنها بالزيت، ثم افرد كل كرة رقيقة جداً على سطح مدهون.",
            "ادهن بالسمن واطوِ العجين على نفسه، وضع الطبقات داخل بعضها لتكوين قرص.",
            "أرح القرص 15 دقيقة ثم اخبزه في فرن شديد الحرارة حتى ينتفخ ويحمر.",
        ],
        "stepsEn": [
            "Knead flour, water, and salt until smooth, then rest for 30 minutes.",
            "Divide into oiled balls and stretch each paper-thin on a greased surface.",
            "Brush with ghee, fold, and nest the folded layers together into one round.",
            "Rest for 15 minutes, then bake in a very hot oven until puffed and golden.",
        ], "timers": [(0, "راحة العجين", "Rest dough", 30), (3, "خبز الفطير", "Bake feteer", 20)],
    },
    {
        "id": "egypt-roz-bel-laban",
        "titleAr": "أرز باللبن المصري",
        "titleEn": "Egyptian Rice Pudding",
        "descriptionAr": "حلوى كريمية من الأرز والحليب والفانيليا تزين بالمكسرات أو القرفة.",
        "descriptionEn": "Creamy rice pudding scented with vanilla and finished with nuts or cinnamon.",
        "region": "egypt", "mealType": ["dessert", "snack", "suhoor"],
        "prep": 5, "cook": 40, "servings": 6, "difficulty": "easy", "ramadan": True,
        "tags": ["مصري", "حلويات", "أرز باللبن", "بارد"], "imageQuery": "Egyptian rice pudding roz bel laban",
        "storyAr": "الأرز باللبن حلوى منزلية ومحلّية واسعة الانتشار في مصر وتقدم ساخنة أو مبردة.",
        "storyEn": "Rice pudding is a widely loved Egyptian home and dairy-shop dessert, served either warm or thoroughly chilled.",
        "ingredients": [
            ing("أرز مصري", "Egyptian short-grain rice", 0.75, "كوب", "cup", "pantry"),
            ing("حليب كامل الدسم", "Whole milk", 1.5, "لتر", "L", "dairy"),
            ing("سكر", "Sugar", 0.75, "كوب", "cup", "pantry"),
            ing("نشا ذرة", "Cornstarch", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("فانيليا", "Vanilla", 1, "ملعقة صغيرة", "tsp", "pantry"),
            ing("فستق أو قرفة", "Pistachios or cinnamon", 3, "ملعقة كبيرة", "tbsp", "pantry"),
        ],
        "stepsAr": [
            "اسلق الأرز في ماء قليل حتى يطرى ويمتص الماء.",
            "أضف معظم الحليب الساخن والسكر واطهه على نار هادئة مع التقليب.",
            "ذب النشا في الحليب المتبقي وأضفه مع الفانيليا حتى يثخن القوام.",
            "وزع في أطباق وزين بالفستق أو القرفة وقدمه دافئاً أو مبرداً.",
        ],
        "stepsEn": [
            "Simmer rice in a small amount of water until tender and the water is absorbed.",
            "Add most of the warm milk and sugar; cook gently while stirring.",
            "Dissolve cornstarch in remaining milk and add with vanilla, stirring until thick.",
            "Portion, garnish with pistachios or cinnamon, and serve warm or chilled.",
        ], "timers": [(0, "سلق الأرز", "Cook rice", 15), (2, "تكثيف المهلبية", "Thicken pudding", 6)],
    },
    {
        "id": "egypt-basbousa",
        "titleAr": "البسبوسة المصرية",
        "titleEn": "Egyptian Basbousa",
        "descriptionAr": "كيكة سميد طرية بالسمن والزبادي تسقى بشربات الليمون.",
        "descriptionEn": "Tender semolina cake enriched with ghee and yogurt and soaked in lemon syrup.",
        "region": "egypt", "mealType": ["dessert", "snack", "iftar"],
        "prep": 15, "cook": 35, "servings": 12, "difficulty": "easy", "ramadan": True,
        "tags": ["مصري", "حلويات", "سميد", "رمضان"], "imageQuery": "Egyptian basbousa semolina cake",
        "storyAr": "البسبوسة من أشهر حلويات الصواني في مصر وتظهر بقوة في رمضان والمناسبات العائلية.",
        "storyEn": "Basbousa is among Egypt's best-known tray bakes and is especially prominent during Ramadan and family gatherings.",
        "ingredients": [
            ing("سميد خشن", "Coarse semolina", 2, "كوب", "cups", "pantry"),
            ing("سكر", "Sugar", 1.5, "كوب", "cups", "pantry"),
            ing("زبادي", "Yogurt", 1, "كوب", "cup", "dairy"),
            ing("سمن مذاب", "Melted ghee", 0.75, "كوب", "cup", "dairy"),
            ing("جوز هند", "Desiccated coconut", 0.25, "كوب", "cup", "pantry"),
            ing("عصير ليمون", "Lemon juice", 1, "ملعقة كبيرة", "tbsp", "produce"),
        ],
        "stepsAr": [
            "اغل كوب سكر مع كوب ماء وعصير الليمون عشر دقائق ثم برد الشربات.",
            "اخلط السميد مع السكر المتبقي وجوز الهند ثم أضف السمن والزبادي دون إفراط في الخلط.",
            "افرد الخليط في صينية مدهونة وقطعه معينات ثم اخبزه حتى يصبح ذهبياً.",
            "اسق البسبوسة الساخنة بالشربات البارد واتركها تتشرب قبل التقديم.",
        ],
        "stepsEn": [
            "Boil one cup sugar with one cup water and lemon for ten minutes; cool the syrup.",
            "Combine semolina, remaining sugar, and coconut, then fold in ghee and yogurt without overmixing.",
            "Spread in a greased pan, score into diamonds, and bake until golden.",
            "Pour cool syrup over the hot cake and let it absorb before serving.",
        ], "timers": [(0, "غلي الشربات", "Boil syrup", 10), (2, "خبز البسبوسة", "Bake basbousa", 30)],
    },
    {
        "id": "egypt-feseekh",
        "titleAr": "الفسيخ المصري مع البصل والليمون",
        "titleEn": "Egyptian Feseekh with Onion and Lemon",
        "descriptionAr": "سمك بوري مملح تقليدي يقدم منظفاً مع الليمون والبصل والطحينة.",
        "descriptionEn": "Traditional salt-cured grey mullet, carefully cleaned and served with lemon, onion, and tahini.",
        "region": "egypt", "mealType": ["lunch"],
        "prep": 25, "cook": 0, "servings": 4, "difficulty": "medium", "ramadan": False,
        "tags": ["مصري", "شم النسيم", "سمك مملح", "تراثي"], "imageQuery": "Egyptian feseekh salted mullet",
        "storyAr": "يرتبط الفسيخ ارتباطاً وثيقاً باحتفال شم النسيم المصري. يجب شراؤه جاهزاً من مصدر مرخص وحفظه مبرداً لتقليل مخاطر التسمم.",
        "storyEn": "Feseekh is closely tied to Egypt's Sham El-Nessim celebration. Buy professionally cured fish from a licensed source and keep it refrigerated because unsafe curing can cause severe food poisoning.",
        "ingredients": [
            ing("فسيخ بوري جاهز من مصدر مرخص", "Licensed, ready-cured feseekh mullet", 800, "جرام", "g", "meat"),
            ing("ليمون", "Lemons", 4, "حبة", "pcs", "produce"),
            ing("بصل أخضر", "Spring onions", 2, "حزمة", "bunches", "produce"),
            ing("طحينة", "Tahini", 0.5, "كوب", "cup", "pantry"),
            ing("خل", "Vinegar", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("خبز بلدي", "Baladi bread", 4, "رغيف", "loaves", "bakery"),
        ],
        "stepsAr": [
            "استخدم فقط فسيخاً جاهزاً من منشأة مرخصة ولا تحاول تمليح السمك منزلياً بهذه الوصفة.",
            "احتفظ بالسمك مبرداً، ثم انزع الجلد والرأس والأحشاء والعظام بسكين نظيف.",
            "قطع اللحم وضع عليه عصير الليمون والخل مباشرة قبل التقديم.",
            "قدمه فوراً مع البصل الأخضر والطحينة والخبز، وتخلص من البقايا التي بقيت خارج التبريد.",
        ],
        "stepsEn": [
            "Use only ready-cured feseekh from a licensed producer; this recipe does not teach home curing.",
            "Keep chilled, then remove skin, head, viscera, and bones using clean utensils.",
            "Cut the flesh and dress with lemon juice and vinegar immediately before serving.",
            "Serve promptly with spring onion, tahini, and bread; discard leftovers left unrefrigerated.",
        ], "timers": [],
    },
    {
        "id": "lebanon-manakish-zaatar",
        "titleAr": "مناقيش الزعتر اللبنانية",
        "titleEn": "Lebanese Za'atar Manakish",
        "descriptionAr": "أقراص عجين طرية مخبوزة بخليط الزعتر والسماق والسمسم وزيت الزيتون.",
        "descriptionEn": "Soft flatbreads baked with za'atar, sumac, sesame, and olive oil.",
        "region": "levant", "mealType": ["breakfast", "snack"],
        "prep": 25, "cook": 10, "servings": 6, "difficulty": "medium", "ramadan": False,
        "tags": ["لبناني", "مناقيش", "زعتر", "فطور"], "imageQuery": "Lebanese zaatar manakish",
        "storyAr": "المناقيش من أساسيات أفران الأحياء في لبنان وتؤكل ساخنة في الصباح مطوية مع الخضار.",
        "storyEn": "Manakish are a staple of Lebanese neighborhood bakeries, commonly eaten hot in the morning and folded around fresh vegetables.",
        "ingredients": [
            ing("دقيق", "Flour", 500, "جرام", "g", "pantry"),
            ing("خميرة فورية", "Instant yeast", 2, "ملعقة صغيرة", "tsp", "pantry"),
            ing("ماء فاتر", "Lukewarm water", 300, "مل", "ml", "other"),
            ing("زعتر لبناني", "Lebanese za'atar", 0.75, "كوب", "cup", "pantry"),
            ing("زيت زيتون", "Olive oil", 0.5, "كوب", "cup", "pantry"),
            ing("ملح وسكر", "Salt and sugar", 2, "ملعقة صغيرة", "tsp", "pantry"),
        ],
        "stepsAr": [
            "اخلط الدقيق والخميرة والسكر والملح ثم اعجن بالماء حتى تصبح العجينة ناعمة.",
            "غط العجين واتركه يختمر حتى يتضاعف، ثم قسمه ست كرات.",
            "اخلط الزعتر بزيت الزيتون وافرد كل كرة وضع الخليط فوقها مع ترك حافة.",
            "اخبز على صاج شديد السخونة حتى تنتفخ الحواف وينضج القاع.",
        ],
        "stepsEn": [
            "Mix flour, yeast, sugar, and salt; knead with water until smooth.",
            "Cover and proof until doubled, then divide into six balls.",
            "Mix za'atar with olive oil, flatten each ball, and spread topping short of the edge.",
            "Bake on a very hot tray or stone until edges puff and the base is cooked.",
        ], "timers": [(1, "تخمير العجين", "Proof dough", 60), (3, "خبز المناقيش", "Bake manakish", 8)],
    },
    {
        "id": "lebanon-mujadara",
        "titleAr": "المجدرة اللبنانية",
        "titleEn": "Lebanese Mujadara",
        "descriptionAr": "عدس وأرز متبلان بالكمون ومغطّيان بالبصل المكرمل.",
        "descriptionEn": "Lentils and rice seasoned with cumin and crowned with deeply caramelized onions.",
        "region": "levant", "mealType": ["lunch", "dinner"],
        "prep": 15, "cook": 45, "servings": 6, "difficulty": "easy", "ramadan": False,
        "tags": ["لبناني", "نباتي", "عدس", "اقتصادي"], "imageQuery": "Lebanese mujadara lentils rice",
        "storyAr": "المجدرة طبق منزلي نباتي متجذر في بلاد الشام ويعتمد على مكونات المؤونة البسيطة.",
        "storyEn": "Mujadara is a deeply rooted Levantine meatless home dish based on simple pantry staples.",
        "ingredients": [
            ing("عدس بني", "Brown lentils", 1.5, "كوب", "cups", "pantry"),
            ing("أرز طويل الحبة", "Long-grain rice", 1, "كوب", "cup", "pantry"),
            ing("بصل", "Onions", 4, "حبة كبيرة", "large pcs", "produce"),
            ing("زيت زيتون", "Olive oil", 0.5, "كوب", "cup", "pantry"),
            ing("كمون", "Cumin", 1.5, "ملعقة صغيرة", "tsp", "pantry"),
            ing("ملح وفلفل", "Salt and pepper", 2, "ملعقة صغيرة", "tsp", "pantry"),
        ],
        "stepsAr": [
            "اسلق العدس حتى يقترب من النضج مع الاحتفاظ بماء السلق.",
            "حمّر شرائح البصل ببطء في زيت الزيتون حتى تصبح داكنة ومكرملة.",
            "أضف الأرز والعدس والكمون وماء السلق الكافي واطه على نار هادئة.",
            "اترك المجدرة ترتاح ثم قدمها مع البصل المكرمل واللبن أو السلطة.",
        ],
        "stepsEn": [
            "Simmer lentils until nearly tender, reserving their cooking liquid.",
            "Slowly fry sliced onions in olive oil until deep brown and caramelized.",
            "Add rice, lentils, cumin, and enough reserved liquid; cover and cook gently.",
            "Rest, then serve topped with onions and accompanied by yogurt or salad.",
        ], "timers": [(1, "كرملة البصل", "Caramelize onions", 25), (2, "طهي الأرز والعدس", "Cook rice and lentils", 20)],
    },
    {
        "id": "lebanon-shish-tawook",
        "titleAr": "شيش طاووق لبناني",
        "titleEn": "Lebanese Shish Tawook",
        "descriptionAr": "مكعبات دجاج منقوعة باللبن والثوم والليمون ومشوية على أسياخ.",
        "descriptionEn": "Chicken cubes marinated in yogurt, garlic, and lemon, then grilled on skewers.",
        "region": "levant", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 20, "cook": 15, "servings": 5, "difficulty": "easy", "ramadan": True,
        "tags": ["لبناني", "دجاج", "مشويات", "ثوم"], "imageQuery": "Lebanese shish tawook",
        "storyAr": "الشيش طاووق من أشهر المشويات اللبنانية ويقدم غالباً مع الثومية والمخلل والخبز.",
        "storyEn": "Shish tawook is a mainstay of Lebanese grills, commonly paired with garlic sauce, pickles, and flatbread.",
        "ingredients": [
            ing("صدور دجاج", "Chicken breast", 900, "جرام", "g", "meat"),
            ing("لبن زبادي", "Yogurt", 0.75, "كوب", "cup", "dairy"),
            ing("ثوم مهروس", "Crushed garlic", 6, "فصوص", "cloves", "produce"),
            ing("عصير ليمون", "Lemon juice", 0.25, "كوب", "cup", "produce"),
            ing("معجون طماطم", "Tomato paste", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("بابريكا وزعتر", "Paprika and oregano", 2, "ملعقة صغيرة", "tsp", "pantry"),
        ],
        "stepsAr": [
            "اخلط اللبن والثوم والليمون ومعجون الطماطم والبهارات.",
            "أضف مكعبات الدجاج وانقعها في الثلاجة ساعتين على الأقل.",
            "شك الدجاج في أسياخ واشوه على حرارة متوسطة مع التقليب.",
            "تأكد من نضج الدجاج تماماً ثم أرحه وقدمه مع الثومية.",
        ],
        "stepsEn": [
            "Combine yogurt, garlic, lemon, tomato paste, and spices.",
            "Coat chicken cubes and marinate under refrigeration for at least two hours.",
            "Thread onto skewers and grill over medium heat, turning evenly.",
            "Verify the chicken is safely cooked through, rest briefly, and serve with toum.",
        ], "timers": [(1, "نقع الدجاج", "Marinate chicken", 120), (2, "شوي الدجاج", "Grill chicken", 12)],
    },
    {
        "id": "lebanon-batata-harra",
        "titleAr": "بطاطا حرة لبنانية",
        "titleEn": "Lebanese Batata Harra",
        "descriptionAr": "مكعبات بطاطا مقرمشة بالثوم والكزبرة والفلفل الحار والليمون.",
        "descriptionEn": "Crisp potato cubes tossed with garlic, cilantro, chili, and lemon.",
        "region": "levant", "mealType": ["snack", "lunch", "dinner"],
        "prep": 15, "cook": 30, "servings": 4, "difficulty": "easy", "ramadan": False,
        "tags": ["لبناني", "مقبلات", "بطاطا", "نباتي"], "imageQuery": "Lebanese batata harra potatoes",
        "storyAr": "البطاطا الحرة طبق مزّة لبناني يجمع القرمشة مع نكهة الثوم والكزبرة والليمون.",
        "storyEn": "Batata harra is a Lebanese mezze favorite balancing crisp potatoes with garlic, cilantro, chili, and lemon.",
        "ingredients": [
            ing("بطاطا", "Potatoes", 900, "جرام", "g", "produce"),
            ing("ثوم", "Garlic", 5, "فصوص", "cloves", "produce"),
            ing("كزبرة خضراء", "Fresh cilantro", 1, "كوب", "cup", "produce"),
            ing("فلفل أحمر حار", "Red chili", 1, "حبة", "pc", "produce"),
            ing("عصير ليمون", "Lemon juice", 3, "ملعقة كبيرة", "tbsp", "produce"),
            ing("زيت زيتون", "Olive oil", 4, "ملعقة كبيرة", "tbsp", "pantry"),
        ],
        "stepsAr": [
            "قطع البطاطا مكعبات متساوية وجففها جيداً.",
            "حمصها في الفرن مع الزيت والملح حتى تصبح ذهبية ومقرمشة.",
            "شوح الثوم والفلفل والكزبرة سريعاً في مقلاة واسعة.",
            "أضف البطاطا وعصير الليمون وقلبها ثم قدمها فوراً.",
        ],
        "stepsEn": [
            "Cut potatoes into even cubes and dry thoroughly.",
            "Roast with oil and salt until golden and crisp.",
            "Briefly sauté garlic, chili, and cilantro in a wide pan.",
            "Toss in potatoes and lemon juice, then serve immediately.",
        ], "timers": [(1, "تحمير البطاطا", "Roast potatoes", 25)],
    },
    {
        "id": "palestine-maqluba",
        "titleAr": "المقلوبة الفلسطينية",
        "titleEn": "Palestinian Maqluba",
        "descriptionAr": "قدر أرز ودجاج وباذنجان يقلب كاملاً عند التقديم ليظهر كقالب احتفالي.",
        "descriptionEn": "A layered pot of rice, chicken, and eggplant inverted into a celebratory centerpiece.",
        "region": "levant", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 35, "cook": 60, "servings": 7, "difficulty": "hard", "ramadan": True,
        "tags": ["فلسطيني", "مقلوبة", "أرز", "عزائم"], "imageQuery": "Palestinian maqluba",
        "storyAr": "تنتشر المقلوبة في فلسطين وبلاد الشام، ويشكل قلب القدر لحظة جماعية مميزة على المائدة.",
        "storyEn": "Maqluba is widespread in Palestine and the Levant, with the dramatic inversion of the pot forming a shared table ritual.",
        "ingredients": [
            ing("دجاج مقطع", "Chicken pieces", 1.2, "كجم", "kg", "meat"),
            ing("أرز بسمتي", "Basmati rice", 3, "كوب", "cups", "pantry"),
            ing("باذنجان", "Eggplants", 2, "حبة", "pcs", "produce"),
            ing("قرنبيط", "Cauliflower", 1, "حبة صغيرة", "small head", "produce"),
            ing("مرق دجاج", "Chicken stock", 5, "كوب", "cups", "pantry"),
            ing("بهار مشكل وقرفة", "Seven spice and cinnamon", 2, "ملعقة كبيرة", "tbsp", "pantry"),
        ],
        "stepsAr": [
            "اسلق الدجاج نصف سلق في ماء متبل واحتفظ بالمرق.",
            "حمّر شرائح الباذنجان وزهرات القرنبيط في الفرن أو بقليل من الزيت.",
            "رتب الدجاج والخضار ثم الأرز المنقوع في قدر عميق واسكب المرق بحذر.",
            "اطه حتى ينضج الأرز، أرح القدر 15 دقيقة ثم اقلبه على طبق واسع.",
        ],
        "stepsEn": [
            "Partially simmer chicken in seasoned water and reserve the stock.",
            "Brown eggplant slices and cauliflower florets in the oven or a little oil.",
            "Layer chicken, vegetables, then soaked rice in a deep pot; carefully add stock.",
            "Cook until rice is tender, rest 15 minutes, then invert onto a wide platter.",
        ], "timers": [(3, "طهي المقلوبة", "Cook maqluba", 35), (3, "راحة قبل القلب", "Rest before inverting", 15)],
    },
    {
        "id": "jordan-zarb",
        "titleAr": "الزرب الأردني",
        "titleEn": "Jordanian Bedouin Zarb",
        "descriptionAr": "لحم وخضار مطهوة ببطء بنكهة مدخنة؛ هذه النسخة المنزلية تحاكي فرن الحفرة التقليدي.",
        "descriptionEn": "Slow-cooked smoky meat and vegetables; this home version safely approximates the traditional underground oven.",
        "region": "levant", "mealType": ["lunch", "dinner"],
        "prep": 30, "cook": 150, "servings": 8, "difficulty": "hard", "ramadan": False,
        "tags": ["أردني", "بدوي", "لحم", "مدخن"], "imageQuery": "Jordanian Bedouin zarb food",
        "storyAr": "يصف مجلس السياحة الأردني الزرب كطبق بدوي من اللحم أو الدجاج يطهى في حفرة مبطنة بالطوب لاكتساب النكهة المدخنة.",
        "storyEn": "The Jordan Tourism Board describes zarb as a Bedouin meat or chicken dish cooked in a brick-lined underground pit for its smoky character.",
        "ingredients": [
            ing("كتف ضأن", "Lamb shoulder", 2, "كجم", "kg", "meat"),
            ing("بطاطا", "Potatoes", 700, "جرام", "g", "produce"),
            ing("جزر", "Carrots", 400, "جرام", "g", "produce"),
            ing("بصل", "Onions", 3, "حبة", "pcs", "produce"),
            ing("بهار عربي وهيل", "Arabic spice and cardamom", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("رقائق خشب تدخين غذائية", "Food-safe smoking wood chips", 1, "كوب", "cup", "other"),
        ],
        "stepsAr": [
            "تبّل كتف الضأن بالملح والبهارات واتركه مبرداً ساعة.",
            "ضع اللحم فوق شبكة داخل قدر شواء أو فرن تدخين منزلي وضع الخضار أسفله.",
            "اطهه مغطى على حرارة منخفضة حتى يطرى اللحم وتصل حرارته الداخلية إلى درجة آمنة.",
            "أضف تدخيناً خفيفاً برقائق مخصصة للطعام وفق تعليمات جهازك ثم أرح اللحم وقطعه.",
        ],
        "stepsEn": [
            "Season lamb with salt and spices and refrigerate for one hour.",
            "Place it on a rack in a covered roaster or home smoker with vegetables below.",
            "Cook low and slow until tender and a safe internal temperature is reached.",
            "Apply light smoke using food-safe chips according to your equipment, then rest and carve.",
        ], "timers": [(2, "الطهي البطيء", "Slow cook", 135), (3, "راحة اللحم", "Rest lamb", 15)],
    },
    {
        "id": "syria-shishbarak",
        "titleAr": "شيش برك شامي",
        "titleEn": "Levantine Shish Barak",
        "descriptionAr": "عجائن صغيرة محشوة باللحم مطهوة في صلصة اللبن بالثوم والكزبرة.",
        "descriptionEn": "Tiny meat-filled dumplings cooked in a garlicky cilantro yogurt sauce.",
        "region": "levant", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 60, "cook": 35, "servings": 6, "difficulty": "hard", "ramadan": True,
        "tags": ["شامي", "لبن", "عجين", "لحم"], "imageQuery": "shish barak yogurt dumplings",
        "storyAr": "الشيش برك من أطباق اللبن المطبوخ المعروفة في سوريا ولبنان، ويحتاج تشكيل حباته الصغيرة إلى عمل جماعي وصبر.",
        "storyEn": "Shish barak is a cooked-yogurt dish known in Syria and Lebanon; shaping its tiny dumplings is traditionally patient, communal work.",
        "ingredients": [
            ing("دقيق", "Flour", 3, "كوب", "cups", "pantry"),
            ing("لحم مفروم", "Minced meat", 400, "جرام", "g", "meat"),
            ing("بصل مفروم", "Chopped onion", 1, "حبة", "pc", "produce"),
            ing("لبن زبادي كامل الدسم", "Full-fat yogurt", 1.5, "كجم", "kg", "dairy"),
            ing("نشا", "Cornstarch", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("ثوم وكزبرة", "Garlic and cilantro", 0.5, "كوب", "cup", "produce"),
        ],
        "stepsAr": [
            "اعجن الدقيق بالماء والملح واترك العجين يرتاح.",
            "حمّر اللحم مع البصل، ثم افرد العجين واحشه واطوه على شكل قبعات صغيرة.",
            "اخبز الحبات عشر دقائق لتتماسك، واخفق اللبن مع النشا على نار هادئة حتى يغلي.",
            "أضف الحبات إلى اللبن ثم طشة الثوم والكزبرة واتركها تنضج برفق.",
        ],
        "stepsEn": [
            "Knead flour with water and salt, then rest the dough.",
            "Brown meat with onion; roll dough, fill, and fold into tiny hat shapes.",
            "Bake dumplings briefly to set; whisk yogurt with cornstarch over low heat to a simmer.",
            "Add dumplings, then sautéed garlic and cilantro, and cook gently.",
        ], "timers": [(2, "خبز الحبات", "Set dumplings", 10), (3, "الطهي في اللبن", "Cook in yogurt", 15)],
    },
    {
        "id": "lebanon-warak-enab",
        "titleAr": "ورق عنب لبناني بالزيت",
        "titleEn": "Lebanese Olive-Oil Stuffed Grape Leaves",
        "descriptionAr": "ورق عنب محشو بالأرز والطماطم والأعشاب ومطهو بزيت الزيتون والليمون.",
        "descriptionEn": "Grape leaves filled with rice, tomato, and herbs and braised with olive oil and lemon.",
        "region": "levant", "mealType": ["lunch", "dinner", "snack"],
        "prep": 50, "cook": 55, "servings": 8, "difficulty": "hard", "ramadan": False,
        "tags": ["لبناني", "ورق عنب", "نباتي", "مزة"], "imageQuery": "Lebanese stuffed grape leaves warak enab",
        "storyAr": "نسخة الزيت من ورق العنب جزء أساسي من المزة اللبنانية وتقدم غالباً باردة أو بدرجة حرارة الغرفة.",
        "storyEn": "The olive-oil version of stuffed grape leaves is a core Lebanese mezze item, often served cool or at room temperature.",
        "ingredients": [
            ing("ورق عنب", "Grape leaves", 500, "جرام", "g", "produce"),
            ing("أرز قصير الحبة", "Short-grain rice", 1.5, "كوب", "cups", "pantry"),
            ing("طماطم مفرومة", "Chopped tomatoes", 3, "حبة", "pcs", "produce"),
            ing("بقدونس ونعناع", "Parsley and mint", 2, "كوب", "cups", "produce"),
            ing("زيت زيتون", "Olive oil", 0.75, "كوب", "cup", "pantry"),
            ing("عصير ليمون", "Lemon juice", 0.5, "كوب", "cup", "produce"),
        ],
        "stepsAr": [
            "اسلق ورق العنب سريعاً إن كان طازجاً واشطف المحفوظ جيداً.",
            "اخلط الأرز المنقوع بالطماطم والأعشاب ونصف الزيت والليمون.",
            "ضع مقداراً صغيراً من الحشوة في كل ورقة ولفها دون شد زائد.",
            "رص اللفائف بإحكام واسكب الماء وبقية الزيت والليمون ثم اطهها ببطء.",
        ],
        "stepsEn": [
            "Briefly blanch fresh leaves, or thoroughly rinse preserved leaves.",
            "Mix soaked rice with tomato, herbs, half the oil, and lemon.",
            "Place a small amount on each leaf and roll without packing too tightly.",
            "Arrange snugly, add water and remaining oil and lemon, then braise gently.",
        ], "timers": [(3, "طهي ورق العنب", "Braise grape leaves", 50)],
    },
    {
        "id": "saudi-jareesh",
        "titleAr": "الجريش السعودي",
        "titleEn": "Saudi Jareesh",
        "descriptionAr": "قمح مجروش مطهو ببطء مع اللبن والبصل حتى يصبح طبقاً كريمي القوام.",
        "descriptionEn": "Cracked wheat slowly cooked with cultured dairy and onion to a creamy consistency.",
        "region": "gulf", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 15, "cook": 100, "servings": 7, "difficulty": "medium", "ramadan": True,
        "tags": ["سعودي", "نجدي", "قمح", "تراثي"], "imageQuery": "Saudi jareesh dish",
        "storyAr": "الجريش طبق سعودي تراثي يعتمد على القمح المجروش والطهي الهادئ، ويرتبط بموائد نجد والمناسبات.",
        "storyEn": "Jareesh is a Saudi heritage dish of cracked wheat and slow cooking, closely associated with Najdi tables and gatherings.",
        "ingredients": [
            ing("جريش قمح", "Cracked wheat jareesh", 3, "كوب", "cups", "pantry"),
            ing("مرق دجاج", "Chicken stock", 6, "كوب", "cups", "pantry"),
            ing("لبن زبادي", "Yogurt", 2, "كوب", "cups", "dairy"),
            ing("بصل", "Onions", 3, "حبة", "pcs", "produce"),
            ing("سمن", "Ghee", 4, "ملعقة كبيرة", "tbsp", "dairy"),
            ing("كمون وفلفل أسود", "Cumin and black pepper", 2, "ملعقة صغيرة", "tsp", "pantry"),
        ],
        "stepsAr": [
            "اغسل الجريش وانقعه 30 دقيقة ثم صفه.",
            "شوح بصلة في السمن وأضف الجريش والمرق واتركه يطهى مغطى على نار هادئة.",
            "حركه دورياً حتى يتفكك القمح، ثم أضف اللبن تدريجياً واستمر في الطهي.",
            "كرمل بقية البصل بالسمن والكمون وضعه فوق الجريش عند التقديم.",
        ],
        "stepsEn": [
            "Rinse jareesh, soak for 30 minutes, and drain.",
            "Sauté one onion in ghee; add wheat and stock and cook covered over low heat.",
            "Stir periodically until grains break down, then gradually add yogurt and continue cooking.",
            "Caramelize remaining onions with ghee and cumin and spoon over the jareesh.",
        ], "timers": [(1, "طهي الجريش", "Slow-cook jareesh", 70), (2, "الطهي مع اللبن", "Cook with yogurt", 20)],
    },
    {
        "id": "saudi-saleeg",
        "titleAr": "السليق الطائفي",
        "titleEn": "Taif-Style Saudi Saleeg",
        "descriptionAr": "أرز أبيض كريمي بالحليب والمرق يقدم مع دجاج محمر وصلصة دقوس.",
        "descriptionEn": "Creamy white rice cooked with stock and milk, served with browned chicken and daqqous.",
        "region": "gulf", "mealType": ["lunch", "dinner"],
        "prep": 20, "cook": 70, "servings": 6, "difficulty": "medium", "ramadan": False,
        "tags": ["سعودي", "طائفي", "أرز", "دجاج"], "imageQuery": "Saudi saleeg rice chicken",
        "storyAr": "ينسب السليق خصوصاً إلى الطائف والحجاز، ويتميز بقوام أرز أبيض ناعم يوازن الدجاج المتبل.",
        "storyEn": "Saleeg is especially associated with Taif and the Hejaz, recognized by its soft white rice contrasting with seasoned chicken.",
        "ingredients": [
            ing("دجاجة كاملة", "Whole chicken", 1.4, "كجم", "kg", "meat"),
            ing("أرز قصير الحبة", "Short-grain rice", 2.5, "كوب", "cups", "pantry"),
            ing("حليب", "Milk", 3, "كوب", "cups", "dairy"),
            ing("مرق دجاج", "Chicken stock", 5, "كوب", "cups", "pantry"),
            ing("سمن", "Ghee", 3, "ملعقة كبيرة", "tbsp", "dairy"),
            ing("هيل ومستكة", "Cardamom and mastic", 1, "ملعقة صغيرة", "tsp", "pantry"),
        ],
        "stepsAr": [
            "اسلق الدجاج مع الهيل والمستكة والبصل حتى ينضج واحتفظ بالمرق.",
            "حمّر الدجاج في الفرن بعد دهنه بالسمن.",
            "اطه الأرز في المرق حتى يلين جداً، ثم أضف الحليب الساخن تدريجياً.",
            "حرك حتى يصبح القوام كريمياً وقدمه فوراً مع الدجاج والدقوس.",
        ],
        "stepsEn": [
            "Simmer chicken with cardamom, mastic, and onion until cooked; reserve stock.",
            "Brush the chicken with ghee and brown it in the oven.",
            "Cook rice in stock until very soft, then gradually add hot milk.",
            "Stir to a creamy texture and serve immediately with chicken and daqqous.",
        ], "timers": [(0, "سلق الدجاج", "Simmer chicken", 40), (2, "طهي الأرز", "Cook saleeg rice", 30)],
    },
    {
        "id": "uae-thareed",
        "titleAr": "الثريد الإماراتي باللحم",
        "titleEn": "Emirati Lamb Thareed",
        "descriptionAr": "مرق لحم وخضار غني يصب فوق خبز الرقاق ليتشرب النكهات.",
        "descriptionEn": "A rich lamb-and-vegetable stew ladled over thin regag bread to absorb the broth.",
        "region": "gulf", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 25, "cook": 85, "servings": 7, "difficulty": "medium", "ramadan": True,
        "tags": ["إماراتي", "ثريد", "رقاق", "رمضان"], "imageQuery": "Emirati thareed stew bread",
        "storyAr": "تصفه هيئة أبوظبي للسياحة كطبق إماراتي مريح بارز في رمضان، ويجمع المرق بالخضار وخبز الرقاق.",
        "storyEn": "Abu Dhabi's tourism authority highlights thareed as an Emirati comfort dish prominent in Ramadan, combining stew, vegetables, and regag bread.",
        "ingredients": [
            ing("لحم ضأن بالعظم", "Bone-in lamb", 1.2, "كجم", "kg", "meat"),
            ing("خبز رقاق", "Regag bread", 6, "رقائق", "sheets", "bakery"),
            ing("بطاطا وجزر وكوسا", "Potato, carrot, and zucchini", 1.2, "كجم", "kg", "produce"),
            ing("طماطم", "Tomatoes", 4, "حبة", "pcs", "produce"),
            ing("بصل وثوم", "Onion and garlic", 3, "حبة", "pcs", "produce"),
            ing("لومي وبهارات خليجية", "Dried lime and Gulf spices", 2, "ملعقة كبيرة", "tbsp", "pantry"),
        ],
        "stepsAr": [
            "حمّر اللحم مع البصل ثم أضف الثوم والطماطم والبهارات واللومي.",
            "غط بالماء واترك اللحم ينضج ببطء حتى يقارب الطراوة.",
            "أضف الخضار بالترتيب حسب وقت نضجها واتركها طرية دون أن تتفتت.",
            "قطع خبز الرقاق في طبق عميق واسكب فوقه المرق والخضار ثم ضع اللحم.",
        ],
        "stepsEn": [
            "Brown lamb with onion, then add garlic, tomatoes, spices, and dried lime.",
            "Cover with water and simmer slowly until the lamb is almost tender.",
            "Add vegetables according to cooking time and cook until tender but intact.",
            "Tear regag into a deep platter, ladle over broth and vegetables, and top with lamb.",
        ], "timers": [(1, "طهي اللحم", "Simmer lamb", 55), (2, "طهي الخضار", "Cook vegetables", 20)],
    },
    {
        "id": "uae-luqaimat",
        "titleAr": "اللقيمات الإماراتية",
        "titleEn": "Emirati Luqaimat",
        "descriptionAr": "كرات عجين مقلية مقرمشة من الخارج وهشة من الداخل مع دبس التمر.",
        "descriptionEn": "Crisp, airy fried dough balls drizzled with date syrup.",
        "region": "gulf", "mealType": ["dessert", "snack", "iftar"],
        "prep": 15, "cook": 20, "servings": 8, "difficulty": "medium", "ramadan": True,
        "tags": ["إماراتي", "لقيمات", "حلويات", "رمضان"], "imageQuery": "Emirati luqaimat date syrup",
        "storyAr": "اللقيمات حلوى إماراتية محبوبة تقدم في رمضان والمناسبات وتعبر عن المشاركة والكرم.",
        "storyEn": "Luqaimat are a beloved Emirati sweet served during Ramadan and celebrations, associated with sharing and generosity.",
        "ingredients": [
            ing("دقيق", "Flour", 2, "كوب", "cups", "pantry"),
            ing("خميرة فورية", "Instant yeast", 1.5, "ملعقة صغيرة", "tsp", "pantry"),
            ing("نشا", "Cornstarch", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("هيل وزعفران", "Cardamom and saffron", 1, "ملعقة صغيرة", "tsp", "pantry"),
            ing("زيت للقلي", "Oil for frying", 750, "مل", "ml", "pantry"),
            ing("دبس تمر", "Date syrup", 0.5, "كوب", "cup", "pantry"),
        ],
        "stepsAr": [
            "اخلط الدقيق والنشا والخميرة والهيل والزعفران ثم أضف ماء دافئاً لتكوين عجين لزج.",
            "غط العجين واتركه يختمر حتى يتضاعف.",
            "أسقط كرات صغيرة في زيت متوسط السخونة واقلها مع التحريك حتى تتحمر بالتساوي.",
            "صف اللقيمات واسكب عليها دبس التمر وقدمها فوراً.",
        ],
        "stepsEn": [
            "Mix flour, cornstarch, yeast, cardamom, and saffron; add warm water for a sticky batter.",
            "Cover and proof until doubled.",
            "Drop small balls into moderately hot oil and turn until evenly golden.",
            "Drain, drizzle with date syrup, and serve immediately.",
        ], "timers": [(1, "تخمير العجين", "Proof batter", 60), (2, "قلي اللقيمات", "Fry luqaimat", 15)],
    },
    {
        "id": "qatar-saloona",
        "titleAr": "الصالونة القطرية",
        "titleEn": "Qatari Saloona",
        "descriptionAr": "يخنة طماطم كثيفة باللحم والخضار والهيل والقرنفل واللومي.",
        "descriptionEn": "A thick tomato-based meat and vegetable stew scented with cardamom, clove, and black lime.",
        "region": "gulf", "mealType": ["lunch", "dinner", "iftar"],
        "prep": 25, "cook": 75, "servings": 6, "difficulty": "medium", "ramadan": True,
        "tags": ["قطري", "صالونة", "يخنة", "لومي"], "imageQuery": "Qatari saloona stew",
        "storyAr": "تدرج هيئة قطر للسياحة الصالونة بين الأطباق التقليدية المحبوبة وتصفها كيخنة طماطم غنية بالتوابل واللومي.",
        "storyEn": "Qatar Tourism lists saloona among beloved traditional dishes and describes it as a thick tomato stew rich in spice and black lime.",
        "ingredients": [
            ing("لحم ضأن مكعبات", "Cubed lamb", 900, "جرام", "g", "meat"),
            ing("طماطم مهروسة", "Crushed tomatoes", 500, "جرام", "g", "produce"),
            ing("بطاطا وجزر وكوسا", "Potato, carrot, and zucchini", 900, "جرام", "g", "produce"),
            ing("بصل وثوم", "Onion and garlic", 3, "حبة", "pcs", "produce"),
            ing("لومي أسود", "Black dried lime", 2, "حبة", "pcs", "pantry"),
            ing("هيل وقرنفل وزنجبيل", "Cardamom, clove, and ginger", 2, "ملعقة صغيرة", "tsp", "pantry"),
        ],
        "stepsAr": [
            "حمّر اللحم مع البصل في قليل من الزيت ثم أضف الثوم والتوابل.",
            "أضف الطماطم واللومي المثقوب والماء واترك اللحم يطهى ببطء.",
            "أضف البطاطا والجزر ثم الكوسا قرب النهاية.",
            "اضبط الملح واترك الصالونة تتكاثف وقدمها مع الأرز أو الخبز.",
        ],
        "stepsEn": [
            "Brown lamb with onion in a little oil, then add garlic and spices.",
            "Add tomatoes, pierced black limes, and water; simmer the meat gently.",
            "Add potato and carrot, followed by zucchini near the end.",
            "Adjust seasoning, reduce to a thick stew, and serve with rice or bread.",
        ], "timers": [(1, "طهي اللحم", "Simmer lamb", 45), (2, "طهي الخضار", "Cook vegetables", 20)],
    },
    {
        "id": "qatar-balaleet",
        "titleAr": "البلاليط القطرية",
        "titleEn": "Qatari Balaleet",
        "descriptionAr": "شعيرية حلوة بالهيل والزعفران وماء الورد تعلوها عجة بيض مالحة.",
        "descriptionEn": "Sweet cardamom-saffron vermicelli topped with a savory egg omelet.",
        "region": "gulf", "mealType": ["breakfast", "dessert"],
        "prep": 10, "cook": 25, "servings": 5, "difficulty": "easy", "ramadan": False,
        "tags": ["قطري", "بلاليط", "فطور", "زعفران"], "imageQuery": "Qatari balaleet vermicelli egg",
        "storyAr": "تجمع البلاليط الخليجية بين الحلو والمالح؛ وتصفها هيئة قطر للسياحة كشعيرية مع ماء الورد والهيل والزعفران والبيض.",
        "storyEn": "Balaleet combines sweet and savory; Qatar Tourism describes vermicelli flavored with rosewater, cardamom, saffron, and turmeric and topped with egg.",
        "ingredients": [
            ing("شعيرية", "Vermicelli", 400, "جرام", "g", "pantry"),
            ing("سكر", "Sugar", 0.5, "كوب", "cup", "pantry"),
            ing("بيض", "Eggs", 5, "حبة", "pcs", "dairy"),
            ing("ماء ورد", "Rosewater", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("هيل وزعفران وكركم", "Cardamom, saffron, and turmeric", 1.5, "ملعقة صغيرة", "tsp", "pantry"),
            ing("سمن", "Ghee", 3, "ملعقة كبيرة", "tbsp", "dairy"),
        ],
        "stepsAr": [
            "اسلق الشعيرية حتى تلين جزئياً ثم صفها.",
            "قلبها بالسمن والسكر والهيل والزعفران وماء الورد حتى تتشرب النكهات.",
            "اخفق البيض مع الملح واطهه كعجة رقيقة.",
            "ضع الشعيرية في طبق التقديم وغطها بالعجة.",
        ],
        "stepsEn": [
            "Boil vermicelli until partly tender, then drain.",
            "Toss with ghee, sugar, cardamom, saffron, and rosewater until fragrant.",
            "Beat eggs with salt and cook as a thin omelet.",
            "Pile vermicelli onto a platter and top with the omelet.",
        ], "timers": [(0, "سلق الشعيرية", "Boil vermicelli", 6), (1, "تشريب النكهات", "Flavor vermicelli", 8)],
    },
    {
        "id": "oman-shuwa",
        "titleAr": "الشواء العُماني",
        "titleEn": "Omani Shuwa",
        "descriptionAr": "لحم متبل بالبهارات العمانية ومطهو ببطء حتى يذوب؛ نسخة فرن منزلية من الطبق الاحتفالي.",
        "descriptionEn": "Spice-marinated meat cooked until meltingly tender; a home-oven version of the festive dish.",
        "region": "gulf", "mealType": ["lunch", "dinner"],
        "prep": 30, "cook": 300, "servings": 10, "difficulty": "hard", "ramadan": False,
        "tags": ["عُماني", "شواء", "لحم", "أعياد"], "imageQuery": "Omani shuwa meat",
        "storyAr": "الشواء العماني طبق مناسبات يطهى تقليدياً لساعات طويلة في تنور أرضي جماعي؛ تستخدم هذه الوصفة فرناً منزلياً آمناً.",
        "storyEn": "Omani shuwa is a celebration dish traditionally cooked for many hours in a communal underground oven; this recipe uses a safe home oven.",
        "ingredients": [
            ing("كتف ضأن", "Lamb shoulder", 3, "كجم", "kg", "meat"),
            ing("خل", "Vinegar", 0.5, "كوب", "cup", "pantry"),
            ing("ثوم", "Garlic", 12, "فص", "cloves", "produce"),
            ing("كزبرة وكمون وهيل", "Coriander, cumin, and cardamom", 3, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("فلفل أحمر وكركم", "Chili and turmeric", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("أوراق موز أو ورق خبز وقصدير", "Banana leaf or parchment and foil", 1, "عبوة", "pack", "other"),
        ],
        "stepsAr": [
            "اخلط الخل والثوم والبهارات وادعك بها اللحم ثم انقعه مبرداً طوال الليل.",
            "لف اللحم بورق موز أو ورق خبز ثم بطبقتين من القصدير وضعه في صينية.",
            "اخبزه على حرارة منخفضة ساعات عدة حتى يصبح شديد الطراوة ويصل لحرارة آمنة.",
            "افتح اللفافة بحذر وحمّر السطح سريعاً ثم أرح اللحم قبل التقطيع.",
        ],
        "stepsEn": [
            "Blend vinegar, garlic, and spices; rub over lamb and marinate refrigerated overnight.",
            "Wrap in banana leaf or parchment, then two foil layers, and place in a roasting pan.",
            "Bake at low heat for several hours until very tender and safely cooked.",
            "Open carefully, brown the surface briefly, then rest before carving.",
        ], "timers": [(2, "الطهي البطيء", "Slow roast", 270), (3, "راحة اللحم", "Rest meat", 20)],
    },
    {
        "id": "kuwait-mutabbaq-samak",
        "titleAr": "مطبق سمك كويتي",
        "titleEn": "Kuwaiti Mutabbaq Samak",
        "descriptionAr": "سمك متبل يقدم فوق أرز بسمتي مع بصل محمر ولومي وبهارات خليجية.",
        "descriptionEn": "Seasoned fish served over basmati rice with browned onions, dried lime, and Gulf spices.",
        "region": "gulf", "mealType": ["lunch", "dinner"],
        "prep": 25, "cook": 45, "servings": 6, "difficulty": "medium", "ramadan": False,
        "tags": ["كويتي", "سمك", "أرز", "لومي"], "imageQuery": "Kuwaiti mutabbaq samak fish rice",
        "storyAr": "مطبق السمك من أطباق الساحل الكويتي التي تجمع صيد الخليج بالأرز والبصل واللومي.",
        "storyEn": "Mutabbaq samak reflects Kuwait's Gulf coast, bringing local fish together with rice, onions, and dried lime.",
        "ingredients": [
            ing("سمك زبيدي أو سمك أبيض", "Pomfret or firm white fish", 1.5, "كجم", "kg", "meat"),
            ing("أرز بسمتي", "Basmati rice", 3, "كوب", "cups", "pantry"),
            ing("بصل", "Onions", 4, "حبة", "pcs", "produce"),
            ing("لومي", "Dried limes", 2, "حبة", "pcs", "pantry"),
            ing("كركم وكزبرة وكمون", "Turmeric, coriander, and cumin", 2, "ملعقة كبيرة", "tbsp", "pantry"),
            ing("دقيق", "Flour", 0.5, "كوب", "cup", "pantry"),
        ],
        "stepsAr": [
            "تبّل السمك بالملح والبهارات واتركه 20 دقيقة ثم غلفه بطبقة خفيفة من الدقيق.",
            "اقله أو اخبزه حتى ينضج ويتحمر ثم احتفظ به دافئاً.",
            "حمّر البصل وأضف الأرز واللومي والبهارات وماءً مناسباً واطهه مغطى.",
            "قدم الأرز في طبق واسع وضع السمك فوقه وزينه بالبصل المحمر.",
        ],
        "stepsEn": [
            "Season fish with salt and spices for 20 minutes, then dust lightly with flour.",
            "Pan-fry or bake until browned and safely cooked; keep warm.",
            "Brown onions, add rice, dried lime, spices, and measured water, and cook covered.",
            "Spread rice on a platter, place fish on top, and garnish with browned onion.",
        ], "timers": [(0, "تتبيل السمك", "Season fish", 20), (2, "طهي الأرز", "Cook rice", 22)],
    },
]


def build_recipe(seed: dict[str, Any]) -> dict[str, Any]:
    slug = seed["id"]
    prefix = "".join(part[0] for part in slug.split("-"))[:4]
    ingredients = []
    for index, item in enumerate(seed["ingredients"], 1):
        ar, en, amount, unit_ar, unit_en, aisle = item
        ingredients.append({
            "id": f"{prefix}{index}",
            "nameAr": ar,
            "nameEn": en,
            "amount": amount,
            "unitAr": unit_ar,
            "unitEn": unit_en,
            "aisle": aisle,
        })
    placeholder = PLACEHOLDER.format(text=urllib.parse.quote(seed["titleEn"]))
    return {
        "id": slug,
        "titleAr": seed["titleAr"],
        "titleEn": seed["titleEn"],
        "descriptionAr": seed["descriptionAr"],
        "descriptionEn": seed["descriptionEn"],
        "region": seed["region"],
        "mealType": seed["mealType"],
        "prepTimeMinutes": seed["prep"],
        "cookTimeMinutes": seed["cook"],
        "servings": seed["servings"],
        "difficulty": seed["difficulty"],
        "isRamadanSpecial": seed["ramadan"],
        "tags": seed["tags"],
        "image": placeholder,
        "galleryImages": [placeholder],
        "storyAr": seed["storyAr"],
        "storyEn": seed["storyEn"],
        "ingredients": ingredients,
        "instructionsAr": seed["stepsAr"],
        "instructionsEn": seed["stepsEn"],
        "timerSteps": [
            {
                "stepIndex": step_index,
                "titleAr": title_ar,
                "titleEn": title_en,
                "durationMinutes": duration,
            }
            for step_index, title_ar, title_en, duration in seed["timers"]
        ],
        # Do not fabricate user engagement for newly generated records.
        "votesCount": {"likes": 0, "dislikes": 0},
        "rating": 0.0,
    }


def discover_input(explicit: str | None, output: Path) -> Path | None:
    if explicit:
        candidate = Path(explicit).expanduser().resolve()
        if not candidate.is_file():
            raise FileNotFoundError(f"Input file does not exist: {candidate}")
        return candidate
    candidates = [
        Path.cwd() / "recipes_data.json",
        Path.cwd() / "data" / "recipes_data.json",
        Path.cwd() / "src" / "data" / "recipes_data.json",
        Path.cwd() / "public" / "data" / "recipes_data.json",
    ]
    for candidate in candidates:
        if candidate.is_file() and candidate.resolve() != output.resolve():
            return candidate.resolve()
    return None


def load_database(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc
    if not isinstance(data, dict) or not isinstance(data.get("recipes"), list):
        raise ValueError(f"{path} must be an object containing a recipes array")
    return data


def repair_existing(recipe: dict[str, Any], changes: list[dict[str, str]]) -> dict[str, Any]:
    item = copy.deepcopy(recipe)
    if "isRamadanSpecial" not in item:
        item["isRamadanSpecial"] = False
        changes.append({
            "recipeId": str(item.get("id", "unknown")),
            "field": "isRamadanSpecial",
            "change": "Added missing field with conservative default false",
        })
    return item


def normalize_words(value: str) -> set[str]:
    stop = {
        "the", "with", "and", "style", "egyptian", "lebanese", "saudi",
        "emirati", "qatari", "omani", "kuwaiti", "jordanian", "palestinian",
        "dish", "food", "rice",
    }
    return {
        word for word in re.findall(r"[a-z0-9]+", value.lower())
        if len(word) >= 4 and word not in stop
    }


def commons_images(query: str, limit: int = 4, timeout: int = 12) -> list[dict[str, str]]:
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": f"{query} filetype:bitmap",
        "gsrnamespace": "6",
        "gsrlimit": str(limit * 3),
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
        "iiurlwidth": "1400",
        "format": "json",
        "formatversion": "2",
        "origin": "*",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "WajbaRecipeGenerator/1.0 (educational dataset builder)"},
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        payload = json.load(response)

    wanted = normalize_words(query)
    results: list[dict[str, str]] = []
    for page in payload.get("query", {}).get("pages", []):
        infos = page.get("imageinfo") or []
        if not infos:
            continue
        info = infos[0]
        title = page.get("title", "")
        haystack = normalize_words(title)
        overlap = wanted & haystack
        # Require a dish-specific token in the filename; generic "food" is not enough.
        if not overlap:
            continue
        meta = info.get("extmetadata", {})
        license_name = meta.get("LicenseShortName", {}).get("value", "")
        results.append({
            "url": info.get("thumburl") or info.get("url", ""),
            "descriptionUrl": info.get("descriptionurl", ""),
            "title": title,
            "license": re.sub(r"<[^>]+>", "", license_name),
            "artist": re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "")),
            "matchedTokens": ", ".join(sorted(overlap)),
        })
        if len(results) >= limit:
            break
    return [item for item in results if item["url"]]


def resolve_new_images(
    recipes: list[dict[str, Any]],
    offline: bool,
    audit_images: list[dict[str, Any]],
) -> None:
    seeds_by_id = {seed["id"]: seed for seed in RECIPE_SEEDS}
    for recipe in recipes:
        query = seeds_by_id[recipe["id"]]["imageQuery"]
        if offline:
            audit_images.append({
                "recipeId": recipe["id"],
                "status": "placeholder",
                "reason": "Offline mode: image lookup was not attempted",
                "query": query,
            })
            continue
        try:
            candidates = commons_images(query)
        except (urllib.error.URLError, TimeoutError, OSError, ValueError) as exc:
            audit_images.append({
                "recipeId": recipe["id"],
                "status": "placeholder",
                "reason": f"Wikimedia lookup failed: {type(exc).__name__}",
                "query": query,
            })
            continue
        if not candidates:
            audit_images.append({
                "recipeId": recipe["id"],
                "status": "placeholder",
                "reason": "No filename with a dish-specific token was found",
                "query": query,
            })
            continue
        recipe["image"] = candidates[0]["url"]
        recipe["galleryImages"] = [item["url"] for item in candidates]
        audit_images.append({
            "recipeId": recipe["id"],
            "status": "candidate-needs-human-review",
            "query": query,
            "selected": candidates[0],
            "candidates": candidates,
            "reason": "Keyword match and license metadata recorded; visual approval is still required",
        })


def validate_database(database: dict[str, Any]) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    recipes = database.get("recipes")
    if not isinstance(recipes, list):
        return [{"severity": "error", "path": "recipes", "message": "Must be an array"}]

    required = list(SCHEMA["newMealTemplate"])
    ids: list[str] = []
    for index, recipe in enumerate(recipes):
        base = f"recipes[{index}]"
        if not isinstance(recipe, dict):
            issues.append({"severity": "error", "path": base, "message": "Must be an object"})
            continue
        recipe_id = recipe.get("id", f"index-{index}")
        ids.append(str(recipe_id))
        for key in required:
            if key not in recipe:
                issues.append({
                    "severity": "error", "recipeId": recipe_id,
                    "path": f"{base}.{key}", "message": "Required field is missing",
                })
        if recipe.get("region") not in REGIONS:
            issues.append({"severity": "error", "recipeId": recipe_id, "path": f"{base}.region", "message": "Invalid Region enum"})
        if recipe.get("difficulty") not in DIFFICULTIES:
            issues.append({"severity": "error", "recipeId": recipe_id, "path": f"{base}.difficulty", "message": "Invalid Difficulty enum"})
        slots = recipe.get("mealType", [])
        if not isinstance(slots, list) or any(slot not in MEAL_SLOTS for slot in slots):
            issues.append({"severity": "error", "recipeId": recipe_id, "path": f"{base}.mealType", "message": "Invalid MealSlot enum"})
        ingredients = recipe.get("ingredients", [])
        if not isinstance(ingredients, list) or not ingredients:
            issues.append({"severity": "error", "recipeId": recipe_id, "path": f"{base}.ingredients", "message": "Must be a non-empty array"})
        else:
            ingredient_ids = []
            for j, ingredient in enumerate(ingredients):
                ingredient_ids.append(ingredient.get("id"))
                if ingredient.get("aisle") not in AISLES:
                    issues.append({"severity": "error", "recipeId": recipe_id, "path": f"{base}.ingredients[{j}].aisle", "message": "Invalid aisle enum"})
            if len(ingredient_ids) != len(set(ingredient_ids)):
                issues.append({"severity": "error", "recipeId": recipe_id, "path": f"{base}.ingredients", "message": "Duplicate ingredient IDs"})
        ar_steps = recipe.get("instructionsAr", [])
        en_steps = recipe.get("instructionsEn", [])
        if not isinstance(ar_steps, list) or not isinstance(en_steps, list) or len(ar_steps) != len(en_steps):
            issues.append({"severity": "error", "recipeId": recipe_id, "path": base, "message": "Arabic and English instruction counts differ"})
        for j, timer in enumerate(recipe.get("timerSteps", [])):
            step_index = timer.get("stepIndex")
            if not isinstance(step_index, int) or not 0 <= step_index < len(ar_steps):
                issues.append({"severity": "error", "recipeId": recipe_id, "path": f"{base}.timerSteps[{j}].stepIndex", "message": "Timer references a missing instruction"})
        rating = recipe.get("rating")
        if not isinstance(rating, (int, float)) or not 0 <= rating <= 5:
            issues.append({"severity": "error", "recipeId": recipe_id, "path": f"{base}.rating", "message": "Rating must be between 0 and 5"})

    for duplicate, count in Counter(ids).items():
        if count > 1:
            issues.append({"severity": "error", "recipeId": duplicate, "path": "recipes", "message": f"Duplicate recipe ID appears {count} times"})
    return issues


def audit_existing_images(recipes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    primary = [str(recipe.get("image", "")).split("?")[0] for recipe in recipes]
    counts = Counter(primary)
    for recipe, normalized in zip(recipes, primary):
        if normalized and counts[normalized] > 1:
            entries.append({
                "recipeId": recipe.get("id"),
                "status": "needs-human-review",
                "reason": f"Primary image is reused by {counts[normalized]} different recipes and cannot be assumed to depict this dish",
                "image": recipe.get("image"),
            })
    all_images = [
        str(url).split("?")[0]
        for recipe in recipes
        for url in [recipe.get("image", ""), *recipe.get("galleryImages", [])]
        if url
    ]
    reused = {url: count for url, count in Counter(all_images).items() if count > 1}
    if reused:
        entries.append({
            "scope": "database",
            "status": "needs-cleanup",
            "reason": "Gallery contains heavily reused stock images; semantic fit requires visual review",
            "duplicateImageUrls": reused,
        })
    return entries


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate and validate an enriched Wajba recipes JSON database."
    )
    parser.add_argument("--input", help="Existing recipes JSON; otherwise common project paths are searched")
    parser.add_argument("--output", default="recipes_enriched.json", help="Output JSON path")
    parser.add_argument("--audit-output", default="recipes_audit.json", help="Audit report path")
    parser.add_argument("--new-only", action="store_true", help="Ignore existing data and output only the 24 new recipes")
    parser.add_argument("--offline", action="store_true", help="Skip Wikimedia image lookup and use labelled placeholders")
    parser.add_argument("--fail-on-warning", action="store_true", help="Return a non-zero exit status if placeholders or image-review items remain")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output = Path(args.output).expanduser().resolve()
    audit_output = Path(args.audit_output).expanduser().resolve()
    changes: list[dict[str, str]] = []
    image_audit: list[dict[str, Any]] = []

    input_path = None if args.new_only else discover_input(args.input, output)
    if input_path:
        original = load_database(input_path)
        existing = [repair_existing(recipe, changes) for recipe in original["recipes"]]
        schema = original.get("schema") if isinstance(original.get("schema"), dict) else copy.deepcopy(SCHEMA)
        meta_title = original.get("_meta", {}).get("title", "Wajba Culinary Architecture - Meals & Recipes Database")
        image_audit.extend(audit_existing_images(existing))
    else:
        existing = []
        schema = copy.deepcopy(SCHEMA)
        meta_title = "Wajba Culinary Architecture - Meals & Recipes Database"

    new_recipes = [build_recipe(seed) for seed in RECIPE_SEEDS]
    resolve_new_images(new_recipes, args.offline, image_audit)

    existing_ids = {recipe.get("id") for recipe in existing}
    collisions = [recipe["id"] for recipe in new_recipes if recipe["id"] in existing_ids]
    if collisions:
        raise ValueError("New recipe IDs already exist in input: " + ", ".join(collisions))

    recipes = existing + new_recipes
    now = dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")
    database = {
        "_meta": {
            "title": meta_title,
            "exportedAt": now,
            "totalMeals": len(recipes),
        },
        "schema": schema,
        "recipes": recipes,
    }
    issues = validate_database(database)
    errors = [issue for issue in issues if issue["severity"] == "error"]
    audit = {
        "_meta": {
            "generatedAt": now,
            "input": str(input_path) if input_path else None,
            "output": str(output),
            "existingMeals": len(existing),
            "newMeals": len(new_recipes),
            "totalMeals": len(recipes),
        },
        "researchSources": SOURCE_URLS,
        "automaticRepairs": changes,
        "validationIssues": issues,
        "imageReview": image_audit,
        "notes": [
            "Automated URL and keyword checks cannot prove that a photograph accurately depicts a dish.",
            "Approve each candidate visually before production use.",
            "Wikimedia creator and license details are recorded beside every candidate when available.",
            "New engagement fields intentionally start at zero.",
            "Feseekh must be professionally cured and purchased from a licensed source; unsafe curing can cause botulism.",
        ],
    }

    output.parent.mkdir(parents=True, exist_ok=True)
    audit_output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(database, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    audit_output.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    placeholders = sum(item.get("status") == "placeholder" for item in image_audit)
    review_items = sum(item.get("status") in {"candidate-needs-human-review", "needs-human-review", "needs-cleanup"} for item in image_audit)
    print(f"Input: {input_path or 'none (self-contained new-only generation)'}")
    print(f"Wrote {len(recipes)} recipes ({len(new_recipes)} new) to {output}")
    print(f"Wrote audit report to {audit_output}")
    print(f"Validation errors: {len(errors)}; image placeholders: {placeholders}; review items: {review_items}")
    if errors:
        return 2
    if args.fail_on_warning and (placeholders or review_items):
        return 3
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(2)
