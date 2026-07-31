import { DietaryTag, Recipe } from '../types';

export const INITIAL_RECIPES: Recipe[] = [
  {
    "id": "egypt-koshary",
    "titleAr": "الكشري المصري الأصيل",
    "titleEn": "Authentic Egyptian Koshary",
    "descriptionAr": "طبق مصر الشعبي الأول! مزيج متناغم من الأرز، العدس الأسود، المكرونة، الحمص، الصلصة الحارة والدقة، مع البصل المقرمش.",
    "descriptionEn": "Egypt's ultimate national comfort food! A harmonious mix of rice, brown lentils, pasta, chickpeas, garlic vinegar sauce, spicy tomato sauce, and crispy fried onions.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 40,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "شعبي",
      "نباتي",
      "وجبة مشبعة",
      "Ramadan Favorite"
    ],
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian%20food%20Koshary.jpg?width=1000",
    "galleryImages": [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "يعود تاريخ الكشري المصري إلى أواخر القرن التاسع عشر، وحظي بشعبية عارمة في أحياء القاهرة التاريخية كأكبر طبق مشبع ولذيذ يجمع مكونات بسيطة غنية بالبروتين النباتي.",
    "storyEn": "Originating in late 19th-century Cairo, Koshary became Egypt's iconic street dish combining budget-friendly staples into a deeply satisfying, protein-rich feast.",
    "ingredients": [
      {
        "id": "k1",
        "nameAr": "عدس بجبة (عدس بني)",
        "nameEn": "Brown Lentils",
        "amount": 300,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "k2",
        "nameAr": "أرز مصري مغسول",
        "nameEn": "Egyptian Short Grain Rice",
        "amount": 300,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "k3",
        "nameAr": "مكرونة صغيرة وشعرية",
        "nameEn": "Mixed Small Pasta & Vermicelli",
        "amount": 350,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "k4",
        "nameAr": "حمص شام مسلوق",
        "nameEn": "Boiled Chickpeas",
        "amount": 200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "k5",
        "nameAr": "بصل مفروم شرايح مقرمشة",
        "nameEn": "Sliced Onions (for crispy topping)",
        "amount": 4,
        "unitAr": "حبة كبيرة",
        "unitEn": "large pcs",
        "aisle": "produce"
      },
      {
        "id": "k6",
        "nameAr": "عصير طماطم طازج",
        "nameEn": "Fresh Tomato Puree",
        "amount": 600,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "produce"
      },
      {
        "id": "k7",
        "nameAr": "ثوم مفروم للدقة والصلصة",
        "nameEn": "Minced Garlic",
        "amount": 8,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "k8",
        "nameAr": "خل أبيض وليمون",
        "nameEn": "White Vinegar & Lemon Juice",
        "amount": 100,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      },
      {
        "id": "k9",
        "nameAr": "كمون وكزبرة جافة وشطة",
        "nameEn": "Cumin, Coriander & Chili Flakes",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "k10",
        "nameAr": "زيت قلي طعام",
        "nameEn": "Vegetable Oil",
        "amount": 150,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "حمر شرائح البصل في زيت غزير حتى تكتسب لوناً ذهبياً مقرمشاً، ثم صفها واحتفظ بالزيت لاستخدامه في باقي المكونات.",
      "اسلق العدس البني في ماء مع كمون لمدة 15 دقيقة حتى يكتمل نصف نضجه.",
      "حمر الشعرية في جزء من زيت البصل، ثم أضف الأرز المغسول والعدس المسلوق والماء والملح والكمون واتركه ينضج.",
      "اسلق المكرونة الصغيرة في ماء مغلي وملح ثم صفها واخلطها بقليل من زيت البصل.",
      "لصلصة الطماطم: شوح الثوم المفروم في زيت البصل ثم أضف الخل وعصير الطماطم والكمون واتركها تتسبك على نار هادئة.",
      "لعمل الدقة المصرية: اخلط الثوم المفروم مع الكمون والكزبرة والخل وعصير الليمون والماء الدافئ.",
      "ضع طبقة أرز وعدس في أطباق التقديم، يليه المكرونة، ثم صلصة الطماطم والحمص والبصل المقرمش، والدقة حسب الرغبة."
    ],
    "instructionsEn": [
      "Fry thinly sliced onions in vegetable oil until golden and crispy. Drain on paper towels and keep the flavorful oil.",
      "Boil brown lentils in seasoned cumin water for 15 minutes until partially tender.",
      "Sauté vermicelli in onion oil until golden, add washed rice, half-cooked lentils, water, salt, and cumin. Simmer on low heat until cooked.",
      "Boil small pasta in salted water until al dente, drain and toss with a drizzle of onion oil.",
      "For tomato sauce: Sauté minced garlic in onion oil, add a splash of vinegar, tomato puree, cumin, and simmer for 15 minutes.",
      "For Garlic Vinegar Da'ah: Whisk minced garlic, ground cumin, coriander, white vinegar, lemon juice, and warm water.",
      "Assemble in bowls: Layer lentil rice first, followed by pasta, warm tomato sauce, chickpeas, crispy onions, and garlic Da'ah."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "سلق العدس البني",
        "titleEn": "Boil Brown Lentils",
        "durationMinutes": 15
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الأرز بالعدس والشعرية",
        "titleEn": "Simmer Lentil Rice",
        "durationMinutes": 20
      },
      {
        "stepIndex": 4,
        "titleAr": "تسبيك صلصة الطماطم",
        "titleEn": "Simmer Tomato Sauce",
        "durationMinutes": 15
      }
    ],
    "votesCount": {
      "likes": 342,
      "dislikes": 12
    },
    "rating": 4.9
  },
  {
    "id": "egypt-fatteh",
    "titleAr": "الفتة المصرية بالخل والثوم واللحم",
    "titleEn": "Egyptian Fatteh with Garlic Vinegar & Beef",
    "descriptionAr": "سيدة الموائد المصرية في الأعياد والمناسبات! طبقات من الخبز البلدي المحمص، الأرز الأبيض المعطر، شوربة اللحم المكثفة، وصلصة الخل والثوم الرائعة مع قطع اللحم المحمر.",
    "descriptionEn": "The centerpiece of Egyptian festive dining! Layers of toasted crispy baladi bread, fragrant white rice, rich beef broth, and a tangy garlic-vinegar sauce topped with browned beef.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 60,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "عزومات",
      "أعياد",
      "لحوم",
      "Ramadan Classic"
    ],
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian%20Fattah.jpg?width=1000",
    "galleryImages": [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تعتبر الفتة المصرية من أقدم الأطباق التراثية التي ارتبطت بالبهجة، حيث تقدم دائماً في أول أيام عيد الأضحى والعزائم الرمضانية الفاخرة.",
    "storyEn": "Egyptian Fatteh is an ancient celebratory tradition served during Eid, Ramadan Iftars, and special family gatherings across Egypt.",
    "ingredients": [
      {
        "id": "f1",
        "nameAr": "لحم بقري أو موزة",
        "nameEn": "Beef Shank or Stew Meat",
        "amount": 1000,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "f2",
        "nameAr": "أرز مصري أبيض",
        "nameEn": "Egyptian White Rice",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "f3",
        "nameAr": "خبز بلدي مصري مقطع ومحمص",
        "nameEn": "Egyptian Baladi Bread (diced & toasted)",
        "amount": 4,
        "unitAr": "أرغفة",
        "unitEn": "loaves",
        "aisle": "bakery"
      },
      {
        "id": "f4",
        "nameAr": "سمن بلدي مصري",
        "nameEn": "Egyptian Ghee (Samen)",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "f5",
        "nameAr": "ثوم مفروم طازج",
        "nameEn": "Fresh Minced Garlic",
        "amount": 10,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "f6",
        "nameAr": "خل أبيض نقي",
        "nameEn": "Pure White Vinegar",
        "amount": 100,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      },
      {
        "id": "f7",
        "nameAr": "عصير طماطم وطماطم بوريه",
        "nameEn": "Tomato Juice & Paste",
        "amount": 400,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "produce"
      },
      {
        "id": "f8",
        "nameAr": "هيل (حبهان) ومستكة وورق لورا",
        "nameEn": "Cardamom, Mastic & Bay Leaves",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اسلق اللحم في ماء مغلي مع المستكة والهيل وورق اللورا والبصل والفل الأسود حتى ينضج تماماً ويتكون مرق غني.",
      "اقطع الخبز وحمصه في الفرن مع ملعقة سمن ورشة ثوم وقليل من الملح.",
      "اطبخ الأرز الأبيض بالسمن البلدي ومرق اللحم حتى يصبح ناصعاً ومفلفلاً.",
      "لصلصة الفتة: احمر الثوم المفروم بالسمن حتى يصبح ذهبياً، ثم أضف الخل وعصير الطماطم والملح والفلفل واتركها تتسبك.",
      "في صينية التقديم: ضع الخبز المحمص، واسقه بقليل من مرق اللحم الساخن وصلصة الخل والثوم.",
      "أضف الأرز الأبيض الساخن كطبقة ثانية ووزعه بانتظام.",
      "وزع صلصة الخل والثوم فوق الأرز ورص قطع اللحم المحمرة بالسمن البلدي على الوجه."
    ],
    "instructionsEn": [
      "Boil beef in water with mastic, cardamom, bay leaves, and onions until tender to create a rich stock.",
      "Dice baladi bread and roast in the oven with a spoonful of ghee, garlic, and sea salt until crispy.",
      "Cook white rice in ghee and beef broth until fluffy.",
      "For garlic vinegar sauce: Sauté minced garlic in ghee until fragrant, deglaze with vinegar, add tomato juice, and simmer.",
      "In a serving platter: Place toasted bread, moisten with hot beef broth and a few spoonfuls of garlic vinegar sauce.",
      "Cover with a thick layer of cooked white rice.",
      "Ladle garlic vinegar tomato sauce over the rice and top with golden ghee-browned beef chunks."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "سلق اللحم",
        "titleEn": "Simmer Beef Stew",
        "durationMinutes": 50
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الأرز الأبيض",
        "titleEn": "Cook White Rice",
        "durationMinutes": 20
      },
      {
        "stepIndex": 3,
        "titleAr": "تسبيك طشة الخل والثوم",
        "titleEn": "Simmer Garlic Sauce",
        "durationMinutes": 12
      }
    ],
    "votesCount": {
      "likes": 289,
      "dislikes": 8
    },
    "rating": 4.8
  },
  {
    "id": "egypt-molokhia",
    "titleAr": "الملوخية المصرية بالدجاج وطشة الثوم",
    "titleEn": "Egyptian Molokhia with Chicken & Garlic Ta'shah",
    "descriptionAr": "أم الأطباق المصرية! ملوخية خضراء طازجة مخروطة مطبوخة بمرق الدجاج الغني، وتعلوها الطشة الخضراء الشهيرة بالثوم والكزبرة الجافة الساخنة بالسمن البلدي.",
    "descriptionEn": "The queen of Egyptian home cooking! Finely minced fresh jute mallow leaves cooked in savory chicken stock, finished with a sizzling garlic coriander Ghee Ta'shah.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 30,
    "servings": 4,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "خضروات",
      "شغف مصري",
      "أرز",
      "Comfort Food"
    ],
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Molokheya%20and%20rice%20with%20chiken%2C%20Egypt%202012.JPG?width=1000",
    "galleryImages": [
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تعد الملوخية طعام الفراعنة والملوك القدماء في مصر، وتشتهر في البيوت المصرية بـ \"شهقة الملوخية\" عند سكب طشة الثوم والكزبرة الساخنة.",
    "storyEn": "Dating back to ancient Pharaohs, Molokhia is synonymous with Egyptian family meals, famous for the traditional gasp (\"Shah'a\") made when pouring the hot garlic ta'shah.",
    "ingredients": [
      {
        "id": "m1",
        "nameAr": "ملوخية خضراء طازجة مخروطة",
        "nameEn": "Fresh Minced Molokhia Leaves",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "m2",
        "nameAr": "دجاجة كاملة مقطعة",
        "nameEn": "Whole Chicken (cut into pieces)",
        "amount": 1200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "m3",
        "nameAr": "مرق دجاج مصفى غني",
        "nameEn": "Rich Chicken Broth",
        "amount": 800,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      },
      {
        "id": "m4",
        "nameAr": "ثوم مفروم ناعم جداً",
        "nameEn": "Finely Minced Garlic",
        "amount": 10,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "m5",
        "nameAr": "كزبرة جافة مطحونة",
        "nameEn": "Ground Dry Coriander",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "m6",
        "nameAr": "سمن بلدي مصري",
        "nameEn": "Egyptian Samen (Ghee)",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "m7",
        "nameAr": "رشة سكر ورشة كربوناتو",
        "nameEn": "Pinch of Sugar & Baking Soda",
        "amount": 1,
        "unitAr": "رشة",
        "unitEn": "pinch",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اسلق الدجاج مع البصل والهيل والفلفل الأسود حتى يكتمل نضجه وحمّره بالسمن البلدي.",
      "في قدر، سخن مرق الدجاج المصفى، وأضف رشة سكر ورشة كربوناتو صغيرة جداً للحفاظ على اللون الأخضر الناصع.",
      "أضف الملوخية المخروطة للشوربة الساخنة واخفقها بسرعة باستخدام المضرب اليدوي حتى تتجانس بدون غليان شديد.",
      "في مقلاة صغيرة، ذوب السمن البلدي وأضف الثوم المفروم والكزبرة الجافة وقلب حتى يكتسب لوناً ذهبياً وفوّاحاً.",
      "اسكب الطشة الساخنة فوراً فوق الملوخية مع الشهقة الشهيرة، واطفئ النار ولا تغطِ القدر إطلاقاً.",
      "تقدم مع الأرز بالشعرية والخبز البلدي والدجاج المحمر والأشار المخلل."
    ],
    "instructionsEn": [
      "Boil the chicken with onion, cardamom, and black pepper until cooked. Brown the chicken pieces in ghee.",
      "Heat clarified chicken broth in a pot, add a pinch of sugar and a micro pinch of baking soda for a vibrant green color.",
      "Whisk minced Molokhia into the simmering broth until smoothly dissolved. Do not let it boil vigorously.",
      "In a small skillet, melt ghee, sauté minced garlic and ground coriander until fragrant and golden brown.",
      "Pour the sizzling garlic coriander Ta'shah directly into the Molokhia and turn off the heat. Keep uncovered.",
      "Serve hot alongside vermicelli rice, Egyptian baladi bread, and roasted chicken."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "سلق الدجاج وقلي المرق",
        "titleEn": "Boil Chicken Stock",
        "durationMinutes": 35
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الملوخية الهادئ",
        "titleEn": "Gently Whisk Molokhia",
        "durationMinutes": 5
      }
    ],
    "votesCount": {
      "likes": 412,
      "dislikes": 10
    },
    "rating": 4.95
  },
  {
    "id": "egypt-hawawshi",
    "titleAr": "الحواوشي المصري المقرمش",
    "titleEn": "Crispy Egyptian Baladi Hawawshi",
    "descriptionAr": "رغيف الخبز البلدي المحشو باللحم المفروم المتبل بالبصل والفلفل الأخضر الحار والبهارات المصرية السحرية والمشوي في الفرن حتي يصبح مقرمشاً ومجوفاً.",
    "descriptionEn": "Crispy Egyptian pita stuffed with minced beef seasoned with grated onions, spicy green peppers, and aromatic Egyptian spices baked until sizzling crispy.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "snack"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 25,
    "servings": 4,
    "difficulty": "easy",
    "tags": [
      "مصري",
      "سريع",
      "لحوم",
      "وجبات شارع",
      "Street Food"
    ],
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian%20meatloaf.jpg?width=1000",
    "galleryImages": [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "ابتكر الأسطى \"حواوشي\" الجزار بالقاهرة في فترة السبعينات هذا الرغيف الشهير الذي غزا شوارع مصر بفضل طعمه المقرمش المتبل الرائع.",
    "storyEn": "Invented by a Cairene butcher named Hawawshi in the 1970s, this seasoned meat-stuffed crispy pita became Egypt's most popular street snack.",
    "ingredients": [
      {
        "id": "h1",
        "nameAr": "لحم مفروم بنسبة دسم 20%",
        "nameEn": "Minced Beef (20% fat content)",
        "amount": 600,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "h2",
        "nameAr": "بصل مفروم معصور المصفى",
        "nameEn": "Grated Onions",
        "amount": 3,
        "unitAr": "حبة كبيرة",
        "unitEn": "large pcs",
        "aisle": "produce"
      },
      {
        "id": "h3",
        "nameAr": "فلفل أخضر وفلفل حار مفروم",
        "nameEn": "Minced Green & Chili Peppers",
        "amount": 3,
        "unitAr": "حبات",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "h4",
        "nameAr": "خبز بلدي مصري طازج",
        "nameEn": "Fresh Egyptian Baladi Pita",
        "amount": 6,
        "unitAr": "أرغفة",
        "unitEn": "loaves",
        "aisle": "bakery"
      },
      {
        "id": "h5",
        "nameAr": "بهارات حواوشي وثوم وبودرة بصل",
        "nameEn": "Hawawshi Spice Mix & Paprika",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "h6",
        "nameAr": "سمن أو زيت لدهن الخبز",
        "nameEn": "Melted Ghee or Oil",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اخلط اللحم المفروم مع البصل المفروم والفلفل الأخضر والحار والبهارات والملح والفلفل الأسود وجوزة الطيب جيدا.",
      "افتح أرغفة الخبز البلدي فتحة صغيرة جانبية وافرد حشوة اللحم داخل الخبز بسمك متناسق.",
      "ادهن الخبز البلدي من الخارج والداخل بقليل من السمن البلدي أو الزيت.",
      "غلف الأرغفة بورق زبدة أو رصها مباشرة على صينية فرن ساخنة جداً عند 200 درجة مئوية.",
      "اقلب الأرغفة منتصف وقت الخبيز حتى تصبح مقرمشة من الجانبين واللحم ناضجاً تماماً.",
      "يقدم ساخناً جداً مع المخلل المشكل والطرشي وسلطة الطحينة."
    ],
    "instructionsEn": [
      "Mix minced beef with grated onions, finely chopped peppers, Hawawshi spice blend, salt, and black pepper.",
      "Slit one side of each pita bread and stuff evenly with the seasoned raw meat mixture.",
      "Brush both sides of the stuffed bread with melted ghee or vegetable oil.",
      "Bake in a preheated hot oven at 200°C (400°F) directly on a tray or wrapped in baking paper.",
      "Flip halfway through baking until the bread is crisp golden and meat is thoroughly cooked.",
      "Serve sizzling hot with tahini dip, spicy pickles, and fresh fries."
    ],
    "timerSteps": [
      {
        "stepIndex": 3,
        "titleAr": "خبز الحواوشي في الفرن",
        "titleEn": "Bake Hawawshi Pita",
        "durationMinutes": 22
      }
    ],
    "votesCount": {
      "likes": 378,
      "dislikes": 5
    },
    "rating": 4.92
  },
  {
    "id": "egypt-taameya-ful",
    "titleAr": "الفول المدمس والطعمية المصرية (الفلافل)",
    "titleEn": "Egyptian Ful Medames & Ta'ameya (Fava Falafel)",
    "descriptionAr": "إفطار الجمعة واليوم الرمضاني الأصيل! طعمية مصرية هشة مصنوعة من الفول المدشوش والخضرة الطازجة مع الفول المدمس بالسمن البلدي والليمون والزيت الحار.",
    "descriptionEn": "The traditional Friday & Suhoor breakfast spread! Ultra-crispy Egyptian fava bean falafel (Ta'ameya) paired with slow-cooked fava beans with olive oil, cumin, and lemon.",
    "region": "egypt",
    "mealType": [
      "breakfast",
      "suhoor",
      "snack"
    ],
    "prepTimeMinutes": 30,
    "cookTimeMinutes": 20,
    "servings": 4,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "إفطار",
      "سحور",
      "نباتي",
      "Suhoor Essential"
    ],
    "image": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تتميز الطعمية المصرية عن الفلافل الشامية باعتمدها الحصري على الفول المدشوش بدلاً من الحمص، مما يعطيها قواماً أفرغ وأكثر هشاشة ونكهة مصرية خالصة.",
    "storyEn": "Unlike Levantine chickpea falafel, Egyptian Ta'ameya uses split fava beans mixed with fresh herbs, yielding an extraordinarily light, airy green interior.",
    "ingredients": [
      {
        "id": "t1",
        "nameAr": "فول مدشوش منقوع للطعمية",
        "nameEn": "Soaked Split Fava Beans",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "t2",
        "nameAr": "فول مدمس مسلوق طازج",
        "nameEn": "Cooked Fava Beans (Ful)",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "t3",
        "nameAr": "كرات وثوم وكزبرة خضراء",
        "nameEn": "Egyptian Leek, Garlic & Fresh Coriander",
        "amount": 150,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "t4",
        "nameAr": "سمسم وكسبرة جافة للتغطية",
        "nameEn": "Sesame Seeds & Coriander Seeds",
        "amount": 50,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "t5",
        "nameAr": "طحينة وزيت زيتون أو زيت حار",
        "nameEn": "Tahini & Olive or Flaxseed Oil",
        "amount": 6,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "t6",
        "nameAr": "ليمون وكمون وملح",
        "nameEn": "Lemons, Cumin & Salt",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اطحن الفول المدشوش المنقوع في المفرمة مع الكرات والثوم والكزبرة الخضراء حتى تتكون عجينة هشة.",
      "أضف الملح والكمون ورشة صودا الخبز واضرب العجينة بالمضرب لادخال الهواء.",
      "شكل العجينة قرصاً وغطها بالسمسم والكزبرة الجافة واقلها في زيت غزير ساخن حتى تصبح مقرمشة.",
      "لسحن الفول: سخن الفول المدمس وأضف الكمون والملح وعصير الليمون وزيت الزيتون والطحينة وهرسه جيدا.",
      "يقدم مع الخبز البلدي الدافئ وسلاطة الطماطم بالبصل والباذنجان المخلل."
    ],
    "instructionsEn": [
      "Grind soaked split fava beans with leeks, garlic, and cilantro in a food processor until light and green.",
      "Add salt, cumin, and a tiny pinch of baking soda, whisking thoroughly to aerate the batter.",
      "Shape into patties, coat generously with sesame seeds, and deep fry in hot oil until golden crisp.",
      "For Ful Medames: Warm cooked fava beans, mash lightly with cumin, salt, fresh lemon juice, tahini, and olive oil.",
      "Serve alongside hot pita bread, sliced tomatoes, cucumbers, and pickled eggplant."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "قلي قرص الطعمية الذهبي",
        "titleEn": "Fry Golden Ta'ameya",
        "durationMinutes": 6
      }
    ],
    "votesCount": {
      "likes": 310,
      "dislikes": 4
    },
    "rating": 4.88
  },
  {
    "id": "egypt-alex-liver",
    "titleAr": "الكبدة الإسكندراني الحارة",
    "titleEn": "Spicy Alexandrian Beef Liver",
    "descriptionAr": "شرائح الكبدة البقري المقطعة ناعماً والمشوحة على نار عالية جداً مع الثوم المفروم والفلفل الأخضر الحار والكمون والخل والليمون.",
    "descriptionEn": "Thinly sliced beef liver flash-fried over high heat with minced garlic, fiery green chilies, cumin, vinegar, and a squeeze of fresh lime.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "snack"
    ],
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 10,
    "servings": 4,
    "difficulty": "easy",
    "tags": [
      "مصري",
      "إسكندراني",
      "سريع جداً",
      "حار",
      "Street Favorite"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Kebda_Iskandarani(_Alexandria_Liver)_sandowichs.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Kebda_Iskandarani(_Alexandria_Liver)_sandowichs.jpg",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "سر الكبدة الإسكندراني الحقيقي هو عدم غسل الكبدة بالماء بل نقعها بالليمون والخل، والطهي السريع على نار شديدة جداً للاحتفاظ بالطراوة والنكهة.",
    "storyEn": "The real Alexandrian secret is flash-searing on roaring high heat for less than 7 minutes with abundant garlic and green chili peppers.",
    "ingredients": [
      {
        "id": "al1",
        "nameAr": "كبدة بقري مقطعة شرائح عصافيري",
        "nameEn": "Beef Liver (thinly ribbon-sliced)",
        "amount": 600,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "al2",
        "nameAr": "ثوم مفروم بكثرة",
        "nameEn": "Minced Garlic",
        "amount": 12,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "al3",
        "nameAr": "فلفل أخضر حار وفلفل رومي مقطع",
        "nameEn": "Sliced Hot Chilies & Bell Peppers",
        "amount": 4,
        "unitAr": "حبات",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "al4",
        "nameAr": "خل أبيض وعصير ليمون طازج",
        "nameEn": "White Vinegar & Fresh Lemon Juice",
        "amount": 80,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      },
      {
        "id": "al5",
        "nameAr": "كمون وكزبرة جافة وفلفل أسود",
        "nameEn": "Cumin, Dry Coriander & Black Pepper",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "al6",
        "nameAr": "زيت طعام للتشويح",
        "nameEn": "Vegetable Oil",
        "amount": 60,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "تبل شرائح الكبدة بالثوم المفروم والكمون والكزبرة والخل وعصير الليمون والملح دون غسلها بالماء.",
      "سخن مقلاة واسعة جداً مع الزيت حتى يدخن المقلاة.",
      "أنزل الكبدة المتبلة في الزيت الساخن جداً ووزعها دون تقليب كثر في الأول حتى تتشوح.",
      "أضف شرايح الفلفل الأخضر الحار وقلب لدقيقتين فقط حتى تنضج دون أن تجف.",
      "احشُ الكبدة فوراً في سندوتشات الخبز الفينو أو البلدي مع الطحينة والليمون."
    ],
    "instructionsEn": [
      "Marinate thinly sliced beef liver with minced garlic, cumin, coriander, vinegar, and lime juice.",
      "Heat oil in a wide heavy skillet until smoking hot.",
      "Add marinated liver, spreading across the hot surface to sear instantly.",
      "Toss in sliced green chilies and sauté vigorously for just 5-7 minutes.",
      "Stuff into Egyptian fino or baladi sandwich rolls with tahini sauce and extra lemon."
    ],
    "timerSteps": [
      {
        "stepIndex": 3,
        "titleAr": "تشويح الكبدة السريع",
        "titleEn": "Flash Sear Liver",
        "durationMinutes": 6
      }
    ],
    "votesCount": {
      "likes": 295,
      "dislikes": 9
    },
    "rating": 4.85
  },
  {
    "id": "egypt-macarona-beamel",
    "titleAr": "المكرونة البشاميل المصرية",
    "titleEn": "Egyptian Macarona Beamel (Baked Béchamel Pasta)",
    "descriptionAr": "الملكة غير المتوجة للعزائم! مكرونة بنة بصلصة البشاميل الذهبية الناعمة الغنية، وحشوة اللحم المفروم المعصج بالبصل والبهارات دافئة النكهة.",
    "descriptionEn": "The undisputed queen of Egyptian dinner parties! Penne pasta baked with a rich seasoned beef filling and topped with a golden, silky béchamel layer.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 45,
    "servings": 8,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "عزائم",
      "بشاميل",
      "فرن",
      "Comfort Legend"
    ],
    "image": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "انتقلت صلصة البشاميل من المطبخ الأوروبي لتستقر في قلوب المصريين، حيث أضافوا إليها طابعهم الخاص باللحم المعصج المتبل والوجه الذهبي المقرمش.",
    "storyEn": "An Egyptian adaptation of European béchamel, baked to savory perfection with aromatic spices, becoming a indispensable staple of every Egyptian feast.",
    "ingredients": [
      {
        "id": "b1",
        "nameAr": "مكرونة قلم (بنة)",
        "nameEn": "Penne Pasta",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "b2",
        "nameAr": "لحم مفروم معصج بالبصل",
        "nameEn": "Minced Beef (for meat sauce)",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "b3",
        "nameAr": "حليب دافئ للبشاميل",
        "nameEn": "Warm Milk",
        "amount": 1200,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "dairy"
      },
      {
        "id": "b4",
        "nameAr": "دقيق أبيض طعام",
        "nameEn": "All-Purpose Flour",
        "amount": 5,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "b5",
        "nameAr": "سمن بلدي وزبدة",
        "nameEn": "Egyptian Samen & Butter",
        "amount": 5,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "b6",
        "nameAr": "قشطة أو جُبن موزاريلا للوجه",
        "nameEn": "Heavy Cream or Mozzarella Cheese",
        "amount": 150,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "b7",
        "nameAr": "جوزة الطيب وفلفل أبيض وملح",
        "nameEn": "Nutmeg, White Pepper & Salt",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اسلق المكرونة القلم في ماء وملح حتى تنضج بنسبة 80% ثم صفها.",
      "عصّج اللحم المفروم مع البصل المفروم والبهارات وقليل من صلصة الطماطم.",
      "لعمل البشاميل: حمر الدقيق بالسمن البلدي والزبدة حتى تخرج ريحته، ثم أضف الحليب الدافئ بالتدريج مع الخفق المستمر لمنع التكتل حتى يثقل البشاميل ويصبح كريمياً.",
      "تبل البشاميل بالملح والفلفل الأبيض ورشة جوزة الطيب.",
      "اخلط نصف كمية البشاميل مع المكرونة المسلوقة.",
      "افرد نصف المكرونة في صينية فرن، ضع حشوة اللحم المعصج، ثم باقي المكرونة.",
      "اسكب باقي البشاميل على الوجه مع القشطة أو الجبن وادخلها فرناً ساخناً عند 200 مئوية حتى تحمر وتتسبك."
    ],
    "instructionsEn": [
      "Boil Penne pasta in salted water until al dente, drain and set aside.",
      "Sauté minced beef with diced onions, spices, and a spoonful of tomato paste until cooked.",
      "For Béchamel: Melt ghee and butter, whisk flour until fragrant, then gradually pour warm milk while whisking constantly until smooth and velvety.",
      "Season sauce with salt, white pepper, and freshly grated nutmeg.",
      "Mix half the béchamel sauce into the boiled penne.",
      "Layer half the pasta in a baking dish, spread meat filling, top with remaining pasta.",
      "Pour rest of béchamel over the top, finish with heavy cream or cheese, and bake at 200°C until golden bubbly."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "تحضير صلصة البشاميل",
        "titleEn": "Whisk Velvet Béchamel",
        "durationMinutes": 12
      },
      {
        "stepIndex": 6,
        "titleAr": "خبز صينية المكرونة بالفرن",
        "titleEn": "Bake Béchamel Casserole",
        "durationMinutes": 35
      }
    ],
    "votesCount": {
      "likes": 388,
      "dislikes": 6
    },
    "rating": 4.94
  },
  {
    "id": "egypt-sayadieh",
    "titleAr": "صيادية السمك والأرز الأحمَر الإسكندراني",
    "titleEn": "Alexandrian Fish Sayadieh with Amber Rice",
    "descriptionAr": "طبق مدن القناة والإسكندرية! سمك قاروص أو دنيس مقلي مطبوخ بمرق البصل المكرمل والبني الداكن مع أرز الصيادية العطري بالكمون والليمون.",
    "descriptionEn": "The Coastal Egyptian jewel! Pan-seared sea bass cooked in a deeply caramelized dark onion broth served over aromatic caramelized Sayadieh spice rice.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 35,
    "servings": 4,
    "difficulty": "medium",
    "tags": [
      "مصري",
      "إسكندراني",
      "أسماك",
      "أرز صيادية"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Sayadiyah_Fish.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Sayadiyah_Fish.jpg",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "ابتكر صيادو الإسكندرية والسويس هذا الطبق العريق للاستفادة من البصل المكرمل لإعطاء لون ونكهة عميقة للأرز والسمك الطازج من البحر المتوسط.",
    "storyEn": "Pioneered by Mediterranean fishermen in Alexandria, using deeply caramelized dark onions to create an intense savory broth for fresh catch.",
    "ingredients": [
      {
        "id": "s1",
        "nameAr": "سمك قاروص أو دنيس أو بلطي",
        "nameEn": "Fresh Sea Bass or Tilapia Fillets",
        "amount": 800,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "s2",
        "nameAr": "أرز مصري مغسول",
        "nameEn": "Egyptian Rice",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "s3",
        "nameAr": "بصل مفروم ناعم جداً",
        "nameEn": "Finely Chopped Onions",
        "amount": 4,
        "unitAr": "حبة كبيرة",
        "unitEn": "large pcs",
        "aisle": "produce"
      },
      {
        "id": "s4",
        "nameAr": "ثوم وكمون وليمون وكزبرة",
        "nameEn": "Garlic, Cumin, Lemon & Coriander",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "s5",
        "nameAr": "زيت لقلي السمك للبصل",
        "nameEn": "Cooking Oil",
        "amount": 150,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "تبل السمك بالثوم المفروم وعصير الليمون والكمون والملح والكزبرة واقله في زيت ساخن حتي يكتسب قواماً مقرمشاً.",
      "في قدر، حمر البصل المفروم في زيت السمك حتى يصبح لونه بنياً داكناً (دون أن يحترق).",
      "أضف ماء مغلي للبصل المحمر والكمون والملح واتركه يغلي 5 دقائق ليتكون مرق الصيادية البني الغني.",
      "أضف الأرز المغسول لمرق الصيادية البني واتركه يغلي، ثم هدئ النار تماماً حتى ينضج الأرز.",
      "قدم أرز الصيادية البني يعلوه السمك المقلي مع سلطة الطحينة وسلطة الخضار الإسكندراني."
    ],
    "instructionsEn": [
      "Marinate fish with garlic, lemon, cumin, and coriander, then shallow fry until golden crispy.",
      "Sauté chopped onions in the fish oil until deep amber brown.",
      "Pour boiling water into caramelized onions, boil for 5 mins to extract dark savory stock.",
      "Add rice to the onion stock, reduce heat, and cook until fluffy.",
      "Serve dark amber rice topped with crispy fish fillets alongside Alexandrian salad."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "غلي مرق الصيادية البني",
        "titleEn": "Simmer Onion Sayadieh Stock",
        "durationMinutes": 8
      },
      {
        "stepIndex": 3,
        "titleAr": "طهي أرز الصيادية",
        "titleEn": "Cook Amber Rice",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 215,
      "dislikes": 5
    },
    "rating": 4.82
  },
  {
    "id": "egypt-mahshi-meshkel",
    "titleAr": "المحشي المصري المشكل (كوسة وفلفل وبتنجان)",
    "titleEn": "Egyptian Stuffed Veggies (Mahshi Meshkel)",
    "descriptionAr": "سلطان السفرة الرمضانية! كوسة وباذنجان وفلفل رومي محشو بخلطة الأرز المعطرة بالأعشاب الطازجة والطماطم المسبكة والمطبوخة بمرق الدجاج البلدي.",
    "descriptionEn": "The absolute ruler of Arab feasts! Zucchini, eggplant, and bell peppers stuffed with herbaceous tomato-seasoned rice slow-simmered in savory broth.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 40,
    "cookTimeMinutes": 50,
    "servings": 6,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "رمضاني",
      "محشي",
      "خضروات",
      "Ramadan Feast"
    ],
    "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "يعد المحشي رمز الكرم واللمة العائلية في مصر، وتحتاج خلطة المحشي المصرية إلى ضبط توازان بين الشبت والبقدونس والكزبرة مع التسبيكة المميزة.",
    "storyEn": "Mahshi brings Egyptian families together around big steaming trays, defined by the rich combination of dill, parsley, cilantro, and tomato sauce.",
    "ingredients": [
      {
        "id": "mh1",
        "nameAr": "كوسة وباذنجان وفلفل مقور",
        "nameEn": "Cored Zucchini, Eggplant & Peppers",
        "amount": 1500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "mh2",
        "nameAr": "أرز مصري مغسول",
        "nameEn": "Egyptian Rice",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "mh3",
        "nameAr": "خضرة محشي (شبت وبقدونس وكزبرة)",
        "nameEn": "Fresh Dill, Parsley & Cilantro",
        "amount": 3,
        "unitAr": "حزم كبيرة",
        "unitEn": "bunches",
        "aisle": "produce"
      },
      {
        "id": "mh4",
        "nameAr": "صلصة طماطم مسبكة بالبصل",
        "nameEn": "Sautéed Tomato Puree with Onions",
        "amount": 600,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "produce"
      },
      {
        "id": "mh5",
        "nameAr": "سمن بلدي وزيت",
        "nameEn": "Ghee & Oil",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "mh6",
        "nameAr": "مرق غني مطعّم بالنناع الجاف",
        "nameEn": "Savory Broth with Dry Mint",
        "amount": 800,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "لعمل خلطة المحشي: سبك عصير الطماطم مع البصل المفروم والسمن، ثم أضف الأرز والأعشاب المفرومة (شبت، بقدونس، كزبرة) والنعناع والنعناع الجاف.",
      "احشُ الكوسة والباذنجان والفلفل بخلطة الأرز حتى ثلاثة أرباعها فقط للتمدد أثناء الطهي.",
      "رص الخضروات المحشوة عمودياً في القدر بشكل متناسق.",
      "اسكب المرق الساخن المتبل بالسمن والنعناع حتى يصل لمنتصف الخضروات.",
      "اترك المحشي يغلي على نار عالية، ثم هدئ النار تماماً وغطّ القدر لمدة 45 دقيقة حتي ينضج.",
      "اقلب قدر المحشي في صينية واسعة ويقدم دافئاً."
    ],
    "instructionsEn": [
      "Prepare filling: Sauté onions and tomato puree in ghee, combine washed rice with finely chopped dill, parsley, cilantro, dry mint, and spices.",
      "Stuff zucchini, eggplant, and peppers 3/4 full to allow rice expansion.",
      "Arrange stuffed vegetables snugly vertically in a cooking pot.",
      "Pour hot seasoned broth until it reaches halfway up the veggies.",
      "Bring to boil, cover tightly, and simmer on low heat for 45 minutes.",
      "Invert the pot onto a large serving platter and serve piping hot."
    ],
    "timerSteps": [
      {
        "stepIndex": 4,
        "titleAr": "طهي المحشي المشكل",
        "titleEn": "Simmer Stuffed Veggies",
        "durationMinutes": 45
      }
    ],
    "votesCount": {
      "likes": 360,
      "dislikes": 7
    },
    "rating": 4.91
  },
  {
    "id": "egypt-om-ali",
    "titleAr": "أم علي بالفطير بلدي والمكسرات والقشطة",
    "titleEn": "Classic Royal Egyptian Om Ali Dessert",
    "descriptionAr": "حلوى مصر الملكية! رقائق الفطير المشلتت أو الـ Puff Pastry المحمصة والغارقة في الحليب الساخن المعطر بالفانيليا والمكسرات المحمصة والقشطة البلدي.",
    "descriptionEn": "Egypt's royal dessert! Crispy puff pastry baked in sweetened warm vanilla milk, topped with toasted nuts, raisins, coconut, and rich Egyptian clotted cream.",
    "region": "egypt",
    "mealType": [
      "dessert"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 20,
    "servings": 6,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "حلويات",
      "رمضاني",
      "قشطة",
      "Royal Dessert"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Om_Ali_Dessert.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Om_Ali_Dessert.jpg",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "ترتبط أم علي بتاريخ مصر المملوكي العريق، وأصبحت الحلوى الرمضانية الأولى المفضلة لمذاقها الكريمي الغني الذي يذوب في الفم.",
    "storyEn": "Originating in Mamluk-era Cairo, Om Ali is the quintessential warm dessert for cold winter nights and Ramadan gatherings.",
    "ingredients": [
      {
        "id": "o1",
        "nameAr": "عجين فطير مشلتت أو بف باستري محمص",
        "nameEn": "Puff Pastry or Egyptian Feteer Sheets",
        "amount": 300,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "bakery"
      },
      {
        "id": "o2",
        "nameAr": "حليب كامل الدسم ساخن",
        "nameEn": "Whole Hot Milk",
        "amount": 1000,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "dairy"
      },
      {
        "id": "o3",
        "nameAr": "سكر أبيض ناعم",
        "nameEn": "Granulated Sugar",
        "amount": 150,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "o4",
        "nameAr": "قشطة بلدي طازجة للوجه",
        "nameEn": "Clotted Heavy Cream (Ashta)",
        "amount": 200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "o5",
        "nameAr": "مكسرات مشكلة (لوز، فستق، بندق، زبيب، جوز هند)",
        "nameEn": "Mixed Roasted Nuts & Raisins",
        "amount": 150,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "o6",
        "nameAr": "فانيليا وسمن بلدي",
        "nameEn": "Vanilla Extract & Ghee",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "حمّص رقائق العجين في الفرن حتى تكتسب لوناً ذهبياً ثم كسّرها في طاجن فخار.",
      "وزع المكسرات المحمصة والزبيب وجوز الهند بين رقائق العجين.",
      "اذب السكر والفانيليا والسمن البلدي في الحليب الساخن جداً.",
      "اسكب الحليب الساخن فوق رقائق العجين والمكسرات حتى يتشرب تماماً.",
      "وزع القشطة البلدي بوفيرة على سطح الطاجن.",
      "ادخل الطاجن تحت شواية الفرن حتى يكتسب الوجه لوناً ذهبياً محشوشاً ومحمصاً."
    ],
    "instructionsEn": [
      "Bake puff pastry sheets until golden brown, break into pieces into a clay baking vessel.",
      "Scatter toasted nuts, raisins, and coconut flakes among pastry pieces.",
      "Dissolve sugar, vanilla, and ghee in steaming whole milk.",
      "Pour hot milk mixture over pastry until completely submerged.",
      "Dollop clotted cream generously over the surface.",
      "Broil under oven broiler for 10-12 minutes until bubbling golden brown."
    ],
    "timerSteps": [
      {
        "stepIndex": 5,
        "titleAr": "تحمير وجه أم علي بالطاجن",
        "titleEn": "Broil Om Ali Casserole",
        "durationMinutes": 12
      }
    ],
    "votesCount": {
      "likes": 395,
      "dislikes": 3
    },
    "rating": 4.96
  },
  {
    "id": "levant-mansaf",
    "titleAr": "المنسف الأردني بالجميد واللحم",
    "titleEn": "Jordanian Mansaf with Jameed & Lamb",
    "descriptionAr": "درة المطبخ الشامي! لحم ضأن طري مطبوخ بصلصة الجميد الكركي الأصيلة والمقدم فوق خبز الشراك والأرز الأصفر المعطر والمكسرات المحمصة.",
    "descriptionEn": "The pride of Levantine hospitality! Tender lamb slow-cooked in rich Jameed yogurt sauce served over Shrak bread and saffron rice garnished with fried pine nuts.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 30,
    "cookTimeMinutes": 90,
    "servings": 6,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "أردني",
      "شامي",
      "جميد",
      "ضأن",
      "Feast Icon"
    ],
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "يعبر المنسف عن أسمى قيم الضيافة والكرم في الأردن والشام، ويطبخ بلبن الجميد الجاف المصنوع تقليدياً من حليب الغنم.",
    "storyEn": "Mansaf represents the peak of Jordanian honor and hospitality, uniquely defined by Jameed—sun-dried fermented sheep milk yogurt stone.",
    "ingredients": [
      {
        "id": "mn1",
        "nameAr": "لحم ضأن بالغنم بالعظم",
        "nameEn": "Bone-in Lamb Chunks",
        "amount": 1500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "mn2",
        "nameAr": "لبن جميد كركي أو بديل اللبن",
        "nameEn": "Jameed Yogurt Stone or Plain Yogurt Base",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "mn3",
        "nameAr": "أرز مصري معطر بالكركم",
        "nameEn": "Short Grain Rice with Turmeric",
        "amount": 600,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "mn4",
        "nameAr": "خبز شراك (مرقوق)",
        "nameEn": "Shrak Thin Flatbread",
        "amount": 4,
        "unitAr": "أرغفة",
        "unitEn": "loaves",
        "aisle": "bakery"
      },
      {
        "id": "mn5",
        "nameAr": "صنوبر ولوز محمر بالسمن",
        "nameEn": "Pine Nuts & Almonds (fried in ghee)",
        "amount": 100,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "mn6",
        "nameAr": "بهارات منسف وهيل ومستكة",
        "nameEn": "Mansaf Spices & Cardamom",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "انقع جميد اللبن وواخفقه بالخلاط حتى يصبح سائلاً كريمياً.",
      "اسلق قطع اللحم مع المطيبات (هيل، بصل، مستكة) حتى ينضج اللحم نصف نضج.",
      "أضف شراب الجميد لمرق اللحم واتركه يغلي مع التحريك المستمر حتى ينضج اللحم تماماً ويصبح اللبن متماسكاً.",
      "اطبخ الأرز بالكركم والسمن البلدي.",
      "افرد خبز الشراك في سدر واسع واسقه بشراب الجميد الساخن.",
      "وزع الأرز الأصفر فوق الخبز ورص قطع اللحم وشراب الجميد والمكسرات المحمرة."
    ],
    "instructionsEn": [
      "Soak Jameed and blend into a smooth creamy yogurt liquid.",
      "Simmer lamb pieces with spices until half tender.",
      "Add Jameed sauce to lamb broth, stirring continuously until meat turns melt-in-mouth tender.",
      "Cook rice with ghee and turmeric for vibrant yellow color.",
      "Lay Shrak bread on a large serving platter, moisten with hot Jameed sauce.",
      "Top with turmeric rice, tender lamb chunks, extra Jameed gravy, and fried nuts."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "طهي اللحم بشراب الجميد",
        "titleEn": "Simmer Lamb in Jameed",
        "durationMinutes": 65
      }
    ],
    "votesCount": {
      "likes": 320,
      "dislikes": 11
    },
    "rating": 4.89
  },
  {
    "id": "gulf-kabsa",
    "titleAr": "الكبسة السعودية باللحم والمكسرات",
    "titleEn": "Royal Saudi Beef & Rice Kabsa",
    "descriptionAr": "الأكلة الوطنية للمملكة! أرز بسمتي طويل الحبة مطبوخ ببهارات الكبسة العطرية وقطع اللحم الطري، والمزين بالزبيب والسنوبر وبصل المكرمل.",
    "descriptionEn": "Saudi Arabia's iconic dish! Long-grain Basmati rice infused with whole aromatic spices, tender spiced meat, crispy onions, raisins, and toasted almonds.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 50,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "سعودي",
      "خليجي",
      "كبسة",
      "بسمتي",
      "Gulf Feast"
    ],
    "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تتنوع بهارات الكبسة الخليجية لتشمل اللومي المجفف والقرفة والهيل والقرنفل، مما يعطي الأرز طعماً وريحة ملكية زكية.",
    "storyEn": "Saudi Kabsa gets its irresistible aroma from black dried lime (Loomi), cardamom pods, cinnamon bark, and cloves.",
    "ingredients": [
      {
        "id": "kb1",
        "nameAr": "لحم بقري أو غنم بالعظم",
        "nameEn": "Bone-in Beef or Lamb Chunks",
        "amount": 1000,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "kb2",
        "nameAr": "أرز بسمتي فاخر منقوع",
        "nameEn": "Aged Basmati Rice",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "kb3",
        "nameAr": "طماطم ومعجون طماطم وبصل",
        "nameEn": "Tomatoes, Tomato Paste & Onions",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "kb4",
        "nameAr": "لومي مجفف وقرفة وهيل وقرنفل",
        "nameEn": "Black Loomi, Cinnamon, Cardamom & Cloves",
        "amount": 1,
        "unitAr": "مجموعة بهارات",
        "unitEn": "whole spice set",
        "aisle": "pantry"
      },
      {
        "id": "kb5",
        "nameAr": "سمن وزبدة وزبيب ومكسرات",
        "nameEn": "Ghee, Raisins & Almonds",
        "amount": 100,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      }
    ],
    "instructionsAr": [
      "شوح البصل في السمن البلدي مع البهارات الصحيحة (اللومي، القرفة، الهيل).",
      "أضف قطع اللحم وحمرها حتى تتسد مسامها، ثم أضف معجون الطماطم والطماطم المفرومة والماء المغلي.",
      "غط القدر واترك اللحم ينضج تماماً.",
      "ارفع اللحم وحمره في الفرن لقوام مقرمش.",
      "أضف الأرز البسمتي لمرق اللحم المعطر، واتركه يغلي ثم هدئ النار 20 دقيقة.",
      "قدم الكبسة في سدر واسع مع اللحم المحمر والزبيب والمكسرات المقرمشة وسلطة الدقوس الحارة."
    ],
    "instructionsEn": [
      "Sauté onions in ghee with whole spices (loomi, cinnamon, cardamom, cloves).",
      "Add meat chunks, brown on all sides, then stir in tomato paste, fresh tomatoes, and boiling water.",
      "Cover and simmer until meat is ultra tender.",
      "Transfer meat to oven tray and broil until browned crisp.",
      "Cook soaked Basmati rice in the fragrant seasoned broth until fluffy.",
      "Serve Kabsa rice on a wide dish, top with broiled meat, raisins, toasted almonds, and spicy Daqoos sauce."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "سلق لحم الكبسة",
        "titleEn": "Simmer Kabsa Meat",
        "durationMinutes": 45
      },
      {
        "stepIndex": 4,
        "titleAr": "ترديك الأرز البسمتي",
        "titleEn": "Simmer Basmati Rice",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 350,
      "dislikes": 8
    },
    "rating": 4.9
  },
  {
    "id": "arabic-shakshuka",
    "titleAr": "الشكشوكة العربية بالأعشاب والبيض",
    "titleEn": "Authentic Arab Herbs & Tomato Shakshuka",
    "descriptionAr": "إفطار عربي مبدع! بيض مسلوق داخل صلصة طماطم مسبكة بالفلفل الملون والبصل والثوم والكزبرة والكمون وتقدم مع الخبز البلدي الدافئ.",
    "descriptionEn": "The beloved Arab skillet breakfast! Eggs gently poached in a bubbling spiced tomato, bell pepper, garlic, cumin, and cilantro sauce.",
    "region": "general",
    "mealType": [
      "breakfast",
      "suhoor",
      "dinner"
    ],
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 15,
    "servings": 4,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "عربي",
      "إفطار",
      "سحور",
      "بيض",
      "سريع",
      "Skillet Classic"
    ],
    "image": "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تعتبر الشكشوكة من أكثر الأطباق شعبية من المغرب إلى الخليج ومصر، وتتميز بسهولة تحضيرها وطعمها الغني المحبب للجميع.",
    "storyEn": "A universal Mediterranean favorite enjoyed from North Africa to Egypt and the Levant, perfect for breakfast or quick Suhoor meals.",
    "ingredients": [
      {
        "id": "sh1",
        "nameAr": "بيض طازج",
        "nameEn": "Fresh Eggs",
        "amount": 6,
        "unitAr": "حبات",
        "unitEn": "pcs",
        "aisle": "dairy"
      },
      {
        "id": "sh2",
        "nameAr": "طماطم مفرومة وفلفل ألوان",
        "nameEn": "Diced Tomatoes & Bell Peppers",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "sh3",
        "nameAr": "بصل وثوم مفروم",
        "nameEn": "Diced Onion & Garlic",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "sh4",
        "nameAr": "زيت زيتون بكر",
        "nameEn": "Extra Virgin Olive Oil",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "sh5",
        "nameAr": "كمون وبابريكا وكزبرة وفلفل أسود",
        "nameEn": "Cumin, Paprika, Coriander & Pepper",
        "amount": 1.5,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "sh6",
        "nameAr": "جبن فيتا أو كزبرة طازجة للتزيين",
        "nameEn": "Feta Cheese & Fresh Parsley",
        "amount": 80,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      }
    ],
    "instructionsAr": [
      "شوح البصل والفلفل الألوان والثوم في زيت الزيتون حتى يطرى.",
      "أضف الطماطم المفرومة والكمون والبابريكا والملح واترك الصلصة تتسبك 8 دقائق.",
      "اصنع تجاويف صغيرة في الصلصة وافقس بيضة في كل تجويف.",
      "غط المقلاة واترك البيض ينضج على نار هادئة بالدرجة المفضلة.",
      "زين بالجبن الفيتا والكزبرة الخضراء وتقدم مباشرة مع الخبز الدافئ."
    ],
    "instructionsEn": [
      "Sauté onions, garlic, and bell peppers in olive oil until soft.",
      "Stir in diced tomatoes, cumin, paprika, and salt; simmer for 8 minutes until thickened.",
      "Make small wells in the sauce and crack an egg into each well.",
      "Cover skillet and cook over low heat until egg whites set but yolks remain soft.",
      "Garnish with crumbled feta and fresh parsley; serve hot with pita bread."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "تسبيك صلصة الشكشوكة",
        "titleEn": "Simmer Tomato Sauce",
        "durationMinutes": 8
      },
      {
        "stepIndex": 3,
        "titleAr": "طهي البيض بالبخار",
        "titleEn": "Poach Eggs in Sauce",
        "durationMinutes": 6
      }
    ],
    "votesCount": {
      "likes": 275,
      "dislikes": 3
    },
    "rating": 4.87
  },
  {
    "id": "ramadan-qatayef",
    "titleAr": "القطايف الرمضانية بالمكسرات والقشطة",
    "titleEn": "Ramadan Stuffed Qatayef (Nuts & Cream)",
    "descriptionAr": "رمز البهجة الرمضانية! أقراص العجين الذهبية المحشوة بخلطة المكسرات مع القرفة أو القشطة البلدية والمقلية حتى التقرمش ثم المسقية بالشربات المعطر بماء الورد.",
    "descriptionEn": "The supreme icon of Ramadan sweet nights! Golden folded pancakes stuffed with spiced nuts or rich cream, fried crisp, and drenched in scented orange blossom syrup.",
    "region": "general",
    "mealType": [
      "dessert"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 15,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "رمضاني",
      "حلويات",
      "قطايف",
      "قشطة",
      "Ramadan Sweet"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Qatayef_with_honey_JO.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Qatayef_with_honey_JO.jpg",
      "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تعتبر القطايف أقدم حلوى رمضانية ارتبطت بليالي الفاطميين والمماليك، وتصنع خصيصاً في شهر رمضان المبارك.",
    "storyEn": "Serving Qatayef after Ramadan Iftar has been a tradition since Fatimid Cairo, representing festive joy and family warmth.",
    "ingredients": [
      {
        "id": "q1",
        "nameAr": "عجينة قطايف طازجة",
        "nameEn": "Fresh Qatayef Pancake Shells",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "bakery"
      },
      {
        "id": "q2",
        "nameAr": "مكسرات مفرومة (بندق، لوز، جوز هند، زبيب)",
        "nameEn": "Chopped Nuts, Coconut & Raisins",
        "amount": 200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "q3",
        "nameAr": "قشطة بلدي أو نوتيلا",
        "nameEn": "Clotted Ashta Cream or Hazelnut Spread",
        "amount": 200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "q4",
        "nameAr": "شربات ثقيل دافئ بماء الورد",
        "nameEn": "Thick Sugar Syrup with Rose Water",
        "amount": 300,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      },
      {
        "id": "q5",
        "nameAr": "زيت لقلي القطايف",
        "nameEn": "Vegetable Oil for Frying",
        "amount": 250,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "احشُ نصف أقراص القطايف بخلطة المكسرات والقرفة واغلق الأطراف بإحكام.",
      "للقطايف العصافيري: احشُ نصف القرص واغلقه كالقمع ثم احشه بالقشطة البلدية وتزيين الفستق.",
      "اقلِ قطايف المكسرات في زيت ساخن حتى تصبح ذهبية مقرمشة.",
      "اصفِ القطايف وسقطها فوراً في الشربات البارد لثوانٍ ثم صفيها.",
      "تقدم دافئة ومقرمشة مع شاي النعناع الرمضاني."
    ],
    "instructionsEn": [
      "Stuff half the Qatayef shells with chopped nut mixture and pinch edges tightly to seal.",
      "For Ashta Qatayef (Asafiri): Fold halfway like a cone, fill with fresh cream and dip in ground pistachios.",
      "Deep fry nut-stuffed Qatayef in hot oil until deep golden crisp.",
      "Remove from oil and submerge immediately into cool sugar syrup.",
      "Serve warm alongside fresh mint tea."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "قلي القطايف الذهبية",
        "titleEn": "Fry Golden Qatayef",
        "durationMinutes": 5
      }
    ],
    "votesCount": {
      "likes": 380,
      "dislikes": 4
    },
    "rating": 4.93
  },
  {
    "id": "levant-beef-shawarma",
    "titleAr": "شاورما اللحم بتتبيلة الشارع الشامي",
    "titleEn": "Levantine Beef Shawarma Street Platter",
    "descriptionAr": "شرائح اللحم البقري المتبلة بالخل والبهارات الشامية والمشوية على النيران، تقدم مع صوص الطحينة بالبقدونس والسماق والخبز الصاج.",
    "descriptionEn": "Thin strips of spiced beef marinated in aromatic vinegar, seared to smoky perfection, served with parsley sumac onions, tahini, and fresh flatbread.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "snack"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 15,
    "servings": 4,
    "difficulty": "medium",
    "tags": [
      "شامي",
      "شاورما",
      "لحم",
      "سندوتشات",
      "Street Icon"
    ],
    "image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "سر شاورما الشارع الشامي يكمن في إضافة رشة سماق للبصل ولية الضأن المذابة أثناء تشويح اللحم على نار عالية.",
    "storyEn": "The Levant street secrets: a generous sumac onion salad and flash-searing with a touch of rendered lamb fat.",
    "ingredients": [
      {
        "id": "sw1",
        "nameAr": "شرائح لحم بقري رفيعة",
        "nameEn": "Thinly Sliced Beef Flank",
        "amount": 700,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "sw2",
        "nameAr": "خل تفاح ولين زبادي للتبيلة",
        "nameEn": "Yogurt & Vinegar Marinade",
        "amount": 150,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "sw3",
        "nameAr": "بصل ومخلل وسماق وبقدونس",
        "nameEn": "Onions, Pickles, Sumac & Parsley",
        "amount": 200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "sw4",
        "nameAr": "طحينة وليمون وثوم للصلصة",
        "nameEn": "Tahini, Lemon & Garlic Sauce",
        "amount": 100,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "sw5",
        "nameAr": "خبز صاج أو شراك",
        "nameEn": "Saj or Pita Flatbreads",
        "amount": 6,
        "unitAr": "أرغفة",
        "unitEn": "pcs",
        "aisle": "bakery"
      }
    ],
    "instructionsAr": [
      "انقع شرائح اللحم في الزبادي والخل والبهارات (هيل، قرفة، جوزة الطيب، فلفل أسود) لـ 3 ساعات.",
      "سخن صاج حامي جداً مع قليلي زيت أو لية حمر اللحم حتى يتشوح ويكتسب نكهة الشواء.",
      "خلط البصل المفروم مع السماق والبقدونس.",
      "احشُ الشاورما في خبز الصاج مع صوص الطحينة والبصل بالسماق والخيار المخلل.",
      "حمص السندوتشات على الصاج وتقدم سخنة."
    ],
    "instructionsEn": [
      "Marinate beef strips in yogurt, vinegar, and warm shawarma spices for at least 3 hours.",
      "Sear beef strips over high heat until browned and juicy.",
      "Toss sliced onions with sumac and fresh parsley.",
      "Assemble wraps: Spread tahini, add beef shawarma, sumac onions, and pickles.",
      "Toast wraps on a hot skillet until crispy."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "تشويح الشاورما الحامي",
        "titleEn": "High Heat Beef Sear",
        "durationMinutes": 10
      }
    ],
    "votesCount": {
      "likes": 310,
      "dislikes": 6
    },
    "rating": 4.88
  },
  {
    "id": "gulf-mandi-chicken",
    "titleAr": "الدجاج المندي اليمني بالأرز المعطر والتدخين",
    "titleEn": "Yemeni Chicken Mandi with Smoked Basmati Rice",
    "descriptionAr": "الدجاج المندي الذهبي المتبل بالكركم والهيل والزعفران مع الأرز البسمتي المعطر بالبهارات واللومي والمبخر بالجمر المشتعل.",
    "descriptionEn": "Golden roasted chicken marinated in turmeric, saffron, and cardamom served over spiced basmati rice infused with authentic charcoal smoke.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 50,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "يمني",
      "خليجي",
      "مندي",
      "دجاج",
      "بسمتي",
      "Smoked Feast"
    ],
    "image": "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "يعود المندي الأصيل إلى حضرموت باليمن، حيث يطهى تقليدياً في تنور حفري تحت الأرض ليمنح الدجاج والأرز طعماً مدخناً وفريداً لا يُنسى.",
    "storyEn": "Originating in Hadramout, Yemen, Mandi is traditionally slow-cooked underground in a tannour pit, locking in rich smoky juices.",
    "ingredients": [
      {
        "id": "md1",
        "nameAr": "دجاجتان كاملتان مقطعتان إلى أنصاف",
        "nameEn": "Two Whole Chickens (halved)",
        "amount": 2000,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "md2",
        "nameAr": "أرز بسمتي طويل الحبة منقوع",
        "nameEn": "Aged Long Grain Basmati Rice",
        "amount": 600,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "md3",
        "nameAr": "زعفران وكركم وهيل ولومي",
        "nameEn": "Saffron Water, Turmeric & Loomi",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "md4",
        "nameAr": "بصل ومثوم وقرنفل وقرفة",
        "nameEn": "Onions, Garlic, Cloves & Cinnamon Bark",
        "amount": 3,
        "unitAr": "حبات",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "md5",
        "nameAr": "سمن بلدي وجمرة فحم للتدخين",
        "nameEn": "Ghee & Charcoal Piece (for smoking)",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "تبل الدجاج بالكركم والملح والزعفران والبهارات وقليل من الزيت.",
      "شوح البصل في السمن مع بهارات المندي الصحيحة (قرنفل، هيل، قرفة، لومي).",
      "أضف الأرز البسمتي المنقوع للقدر مع الماء الساخن والملح.",
      "ضع شبكاً فوق قدر الأرز ورص قطع الدجاج المتبلة فوقه، ثم غلف القدر بقصدير محكم وادخله الفرن ساعة عند 200 مئوية.",
      "بعد نضج الدجاج والأرز، ضع قشرة بصلة بها ملعقة سمن في منتصف القدر، واسقط جمرة فحم شعلة وغطِ القدر فوراً 10 دقائق للتدخين.",
      "يقدم المندي في سدر كبير مع سلطة الدقوس الحارة واللبن بالخيار."
    ],
    "instructionsEn": [
      "Rub halved chickens with turmeric, saffron water, sea salt, and oil.",
      "Sauté onions in ghee with whole spices (cloves, cardamom, cinnamon, dried lime).",
      "Add soaked Basmati rice to the pot with boiling water.",
      "Place a wire rack over the rice pot, set seasoned chicken on top, and seal tightly with foil. Bake at 200°C for 50 mins.",
      "Drop a lit charcoal piece into a small ghee-filled foil dish inside the pot, cover immediately for 10 mins to infuse intense smoke.",
      "Serve Mandi on a large platter with spicy Daqoos tomato dip."
    ],
    "timerSteps": [
      {
        "stepIndex": 3,
        "titleAr": "خبز المندي في الفرن",
        "titleEn": "Bake Sealed Mandi",
        "durationMinutes": 50
      },
      {
        "stepIndex": 4,
        "titleAr": "تبخير المندي بالجمرة",
        "titleEn": "Smoke Mandi with Charcoal",
        "durationMinutes": 10
      }
    ],
    "votesCount": {
      "likes": 360,
      "dislikes": 5
    },
    "rating": 4.93
  },
  {
    "id": "egypt-bamia-beef",
    "titleAr": "طاجن البامية المصرية باللحم الضأن والليمون",
    "titleEn": "Egyptian Okra & Lamb Tajine (Bamia)",
    "descriptionAr": "طاجن البامية الصغيرة المسبكة بصلصة الطماطم مع الثوم والكزبرة وقطع اللحم الضأن الطري بالفرن الفخاري.",
    "descriptionEn": "Tender baby okra simmered in a rich garlic coriander tomato sauce with slow-cooked succulent lamb baked in a clay pot.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 55,
    "servings": 5,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "طاجن",
      "بامية",
      "لحم ضأن",
      "Comfort Stew"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Beef%20Okra_Bamia.jpg?updatedAt=1784964071603",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Beef%20Okra_Bamia.jpg?updatedAt=1784964071603",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تعتبر البامية باللحم الضأن من أقدم وأعرق أطباق المطبخ المصري الريفي، حيث يمنحها الفخار نكهة دافئة لا تضاهى.",
    "storyEn": "A cornerstone of Egyptian countryside cooking, slow-baked in unglazed earthenware clay pots for incredible flavor density.",
    "ingredients": [
      {
        "id": "bm1",
        "nameAr": "بامية خضراء صغيرة (مقمعة)",
        "nameEn": "Fresh Baby Okra (trimmed)",
        "amount": 600,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "bm2",
        "nameAr": "لحم ضأن بالعظم مسلوق",
        "nameEn": "Bone-in Cooked Lamb Chunks",
        "amount": 800,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "bm3",
        "nameAr": "عصير طماطم طازج ومعجون طماطم",
        "nameEn": "Tomato Puree & Tomato Paste",
        "amount": 500,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "produce"
      },
      {
        "id": "bm4",
        "nameAr": "ثوم مفروم بكثرة وكزبرة جافة",
        "nameEn": "Minced Garlic & Ground Coriander",
        "amount": 10,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "bm5",
        "nameAr": "عصير ليمون وفلفل حار وسمن بلدي",
        "nameEn": "Lemon Juice, Green Chili & Ghee",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "شوح البصل والثوم المفروم في السمن البلدي ثم أضف عصير الطماطم والصلصة والملح والفلفل والكمون.",
      "أضف البامية المقمعة وقطع اللحم المسلوق ومرق اللحم الساخن والفلفل الحار.",
      "اترك البامية تغلي 10 دقائق ثم انقل المكونات إلى طاجن فخار.",
      "حضر الطشة: احمر ثوماً مفروماً مع الكزبرة الجافة بالسمن وادعكها بعصير الليمون ثم اسكبها فوق الطاجن.",
      "ادخل الطاجن إلى فرن ساخن عند 200 مئوية لمدة 30 دقيقة حتى تتسبك وتحمر.",
      "تقدم مع الأرز بالشعرية والباذنجان المخلل بالثوم والخافور."
    ],
    "instructionsEn": [
      "Sauté diced onions and garlic in ghee, pour fresh tomato puree and paste, seasoning with salt and pepper.",
      "Toss trimmed okra, cooked lamb, green chili, and rich broth into the sauce.",
      "Simmer for 10 minutes then transfer to an ovenproof clay tajine.",
      "Sauté remaining garlic and dry coriander in ghee, finish with fresh lemon juice, and pour over the tajine.",
      "Bake at 200°C for 30 minutes until bubbling and caramelized.",
      "Serve with Egyptian vermicelli rice and pickled garlic eggplant."
    ],
    "timerSteps": [
      {
        "stepIndex": 4,
        "titleAr": "خبز طاجن البامية بالفرن",
        "titleEn": "Bake Okra Clay Tajine",
        "durationMinutes": 30
      }
    ],
    "votesCount": {
      "likes": 310,
      "dislikes": 4
    },
    "rating": 4.89
  },
  {
    "id": "levant-musakhan",
    "titleAr": "المسخن الفلسطيني بالسماق والزيت والخبز البلدي",
    "titleEn": "Palestinian Musakhan with Sumac & Olive Oil",
    "descriptionAr": "قطع الدجاج المحمية بالفرن والمتبلة بوفيرة بالسماق البلدي، والمقدمة فوق خبز الطابون المشبع بالبصل المكرمل وزيت الزيتون البكر.",
    "descriptionEn": "Roasted spiced chicken served atop Taboon flatbread drenched in caramelized sumac onions, extra virgin olive oil, and toasted pine nuts.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 45,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "فلسطيني",
      "شامي",
      "مسخن",
      "سماق",
      "زيت زيتون",
      "Heritage Dish"
    ],
    "image": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "طبق التراث الشامي والاحتفال بموسم عصر الزيتون في فلسطين، حيث يمتزج زيت الزيتون البكر مع البصل المكرمل والسماق الجبلي اليدوي.",
    "storyEn": "A celebration of the olive harvest in Palestine, marrying fresh-pressed olive oil with wild mountain sumac and wood-fired bread.",
    "ingredients": [
      {
        "id": "ms1",
        "nameAr": "دجاجتان مقطعتان إلى أرباع",
        "nameEn": "Two Whole Chickens (quartered)",
        "amount": 2000,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "ms2",
        "nameAr": "بصل أحمر مفروم شرائح خشنة",
        "nameEn": "Coarsely Sliced Red Onions",
        "amount": 1500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "ms3",
        "nameAr": "سماق بلدي جودة عالية",
        "nameEn": "Pure Mountain Sumac Powder",
        "amount": 120,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "ms4",
        "nameAr": "زيت زيتون فلسطيني بكر",
        "nameEn": "Extra Virgin Palestinian Olive Oil",
        "amount": 350,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      },
      {
        "id": "ms5",
        "nameAr": "خبز طابون أو طابونة خفيف",
        "nameEn": "Taboon Flatbreads",
        "amount": 6,
        "unitAr": "أرغفة",
        "unitEn": "loaves",
        "aisle": "bakery"
      },
      {
        "id": "ms6",
        "nameAr": "صنوبر ولوز محمر وزيت",
        "nameEn": "Toasted Pine Nuts & Almonds",
        "amount": 80,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اسلق قطع الدجاج مع البصل والهيل حتى تنضج ثم ارفعها وتبلها بالسماق وزيت الزيتون والملح.",
      "في قدر كبير، طَهِّ البصل الشرائح بوفيرة من زيت الزيتون على نار هادئة جداً حتى يذوب ويصبح مكرمل كالحلوى.",
      "أضف نصف كمية السماق والملح والفلفل للبصل المكرمل وقلب جيداً.",
      "اغمس أرغفة خبز الطابون في زيت البصل والسماق ورصها في صينية فرن، ثم غطها بخلطة البصل المكرمل والمكسرات.",
      "رص قطع الدجاج المتبلة بالسماق على الوجه وحمرها بالفرن حتي تكتسب لوناً ذهبياً مقرمشاً.",
      "يقدم دافئاً مع اللبن المصفى (اللبنية) والمخللات الشامية."
    ],
    "instructionsEn": [
      "Poach chicken with cardamom and onions until tender, then rub generously with sumac, olive oil, and salt.",
      "Slowly cook sliced red onions in abundant olive oil over low heat until completely melted and sweet.",
      "Mix sumac and sea salt into the caramelized onions.",
      "Dip Taboon breads into the fragrant onion oil, layer in baking trays, and spread the sumac onion mixture over top.",
      "Arrange chicken quarters on top and broil in the oven until crispy golden.",
      "Garnish with toasted pine nuts and serve with cool strained yogurt."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "تكركيل البصل بزيت الزيتون",
        "titleEn": "Caramelize Sumac Onions",
        "durationMinutes": 25
      },
      {
        "stepIndex": 4,
        "titleAr": "تحمير المسخن بالفرن",
        "titleEn": "Broil Musakhan Tray",
        "durationMinutes": 15
      }
    ],
    "votesCount": {
      "likes": 390,
      "dislikes": 3
    },
    "rating": 4.95
  },
  {
    "id": "maghreb-couscous-lamb",
    "titleAr": "الكسكسي المغربي باللحم والخضار السبعة",
    "titleEn": "Moroccan Lamb Couscous with Seven Vegetables",
    "descriptionAr": "حبيبات الكسكسي الناعمة المبخرة بالسمن والبهارات، وتعلوها قطع اللحم الطري مع القرع والجزَر واللفت والحمص والصلصة الدافئة.",
    "descriptionEn": "Fluffy steamed couscous grains served with melt-in-mouth lamb, chickpeas, and a rainbow of seven tender spiced winter vegetables.",
    "region": "maghreb",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 35,
    "cookTimeMinutes": 60,
    "servings": 6,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "مغاربي",
      "مغربي",
      "كسكسي",
      "خضار",
      "Couscous Feast"
    ],
    "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "يعتبر الكسكسي طبق الجمعة والأعياد السعيد في دول المغرب العربي، ويحضر بتبخير حبيبات السميد ثلاث مرات فوق المرق المعطر بالرأس الحانوت.",
    "storyEn": "The traditional Friday gathering centerpiece across North Africa, steamed three times over simmering meat broth for ethereal lightness.",
    "ingredients": [
      {
        "id": "cs1",
        "nameAr": "كسكسي سميد متوسط الحبة",
        "nameEn": "Medium Couscous Semolina",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "cs2",
        "nameAr": "لحم غنم أو بقري طري",
        "nameEn": "Lamb or Beef Stew Chunks",
        "amount": 1000,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "cs3",
        "nameAr": "خضار سبعة (قرع، جزر، لفت، كوسة، باذنجان، حمص، ملفوف)",
        "nameEn": "Seven Veggies (Squash, Carrot, Turnip, Zucchini, Eggplant, Cabbage, Chickpeas)",
        "amount": 1200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "cs4",
        "nameAr": "رأس الحانوت وزعفران وزنجبيل",
        "nameEn": "Ras el Hanout, Saffron & Ginger",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "cs5",
        "nameAr": "سمن مغربي (سمن حار) وزيت زيتون",
        "nameEn": "Traditional Moroccan Smen & Olive Oil",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      }
    ],
    "instructionsAr": [
      "شوح اللحم مع البصل والزيت ورأس الحانوت والكركم والزنجبيل والزعفران في قدر الكسكاس السفلي.",
      "أضف ماء مغلي والحمص واترك اللحم يغلي 30 دقيقة.",
      "بلل حبيبات الكسكسي بقليل من الماء والزيت، وضعه في الكسكاس (المصفاة العلوية) لكي يتبخر فوق مرق اللحم 20 دقيقة.",
      "ارفع الكسكسي ورشه بالماء والملح ودلكه بيدك ثم أعده للتبخير مرة ثانية.",
      "أضف الخضار السبعة لقدر المرق السفلية بالتدريج حسب درجة استوائها.",
      "افرد الكسكسي المبخر في قصعة واسعة، وادهنه بالسمن الحار المغربي، ورص قطع اللحم والخضار الملوّنة وسقِه بالمرق الدافي."
    ],
    "instructionsEn": [
      "Sauté lamb with diced onions, olive oil, Ras el Hanout, ginger, turmeric, and saffron in the bottom pot of a steamer.",
      "Add boiling water and soaked chickpeas; simmer for 30 minutes.",
      "Drizzle couscous with water and oil, place in top steamer basket over the simmering broth, and steam for 20 minutes.",
      "Fluff couscous with salted water and butter, then return to steam a second time.",
      "Add seven vegetables to the broth according to cooking times.",
      "Mound steamed couscous onto a large dish, rub with Smen butter, arrange meat and colorful vegetables, and ladle broth over."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "تبخير الكسكسي الأولى",
        "titleEn": "First Couscous Steam",
        "durationMinutes": 20
      },
      {
        "stepIndex": 3,
        "titleAr": "تبخير الكسكسي الثانية",
        "titleEn": "Second Couscous Steam",
        "durationMinutes": 15
      }
    ],
    "votesCount": {
      "likes": 330,
      "dislikes": 6
    },
    "rating": 4.91
  },
  {
    "id": "egypt-mesakaa",
    "titleAr": "المسقعة المصرية باللحم المفروم والباذنجان",
    "titleEn": "Egyptian Eggplant Moussaka (Mesakaa)",
    "descriptionAr": "شرائح الباذنجان والفلفل المقلي والمصفوفة في صينية بالفرن مع اللحم المفروم المعصج بالصلصة والثوم والكمون.",
    "descriptionEn": "Fried eggplant slices layered with garlic tomato meat sauce and chili peppers baked until bubbly and golden.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 35,
    "servings": 5,
    "difficulty": "easy",
    "tags": [
      "مصري",
      "باذنجان",
      "مسقعة",
      "فرن",
      "Comfort Food"
    ],
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "المسقعة المصرية طبق مصري أصيل يعشقه الجميع، وتتميز بعصاج اللحم المتبل بصلصة الثوم والخل والخلطة الكمونية.",
    "storyEn": "A beloved Egyptian classic featuring rich layers of pan-fried eggplant soaked in garlic tomato meat sauce.",
    "ingredients": [
      {
        "id": "msq1",
        "nameAr": "باذنجان رومي مقطع شرائح",
        "nameEn": "Egyptian Large Eggplants (sliced)",
        "amount": 1000,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "msq2",
        "nameAr": "لحم مفروم معصج بالبصل",
        "nameEn": "Minced Beef filling",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "msq3",
        "nameAr": "عصير طماطم ومعجون طماطم",
        "nameEn": "Tomato Puree & Tomato Paste",
        "amount": 500,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "produce"
      },
      {
        "id": "msq4",
        "nameAr": "ثوم مفروم وفلفل أخضر حار",
        "nameEn": "Minced Garlic & Green Chilies",
        "amount": 8,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "msq5",
        "nameAr": "خل وكمون وزيت للقلي",
        "nameEn": "Vinegar, Cumin & Frying Oil",
        "amount": 150,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "رش شرائح الباذنجان بالملح واقلها في زيت ساخن حتى تكتسب لوناً ذهبياً، ثم صفها.",
      "شوح الثوم المفروم مع الخل وعصير الطماطم والصلصة والكمون والملح لتسبيك الصلصة.",
      "افرد نصف شرائح الباذنجان والفلفل في صينية فرن.",
      "ضع حشوة اللحم المعصج فوق الباذنجان، ثم غطها بباقت الباذنجان والصلصة المسبكة.",
      "ادخل الصينية فرناً ساخناً عند 190 مئوية لمدة 25 دقيقة.",
      "تقدم دافئة مع الخبز البلدي والباذنجان المخلل."
    ],
    "instructionsEn": [
      "Salt eggplant slices and fry in oil until golden brown; drain on paper towels.",
      "Sauté minced garlic, add a splash of vinegar, tomato puree, cumin, and simmer into a thick sauce.",
      "Layer half the fried eggplant and chilies in a baking dish.",
      "Spread cooked minced meat over top, cover with remaining eggplant and ladle garlic tomato sauce over.",
      "Bake at 190°C for 25 minutes until bubbling.",
      "Serve with warm baladi bread."
    ],
    "timerSteps": [
      {
        "stepIndex": 4,
        "titleAr": "خبز صينية المسقعة",
        "titleEn": "Bake Mesakaa Casserole",
        "durationMinutes": 25
      }
    ],
    "votesCount": {
      "likes": 270,
      "dislikes": 5
    },
    "rating": 4.84
  },
  {
    "id": "ramadan-kunafa-ashta",
    "titleAr": "الكنافة الرمضانية النابلسية بالقشطة والفسدق",
    "titleEn": "Royal Ramadan Kunafa with Ashta Cream",
    "descriptionAr": "خيوط العجين الذهبية المحمصة بالسمن البلدي والمحشوة بالقشطة البلدية أو الجبن النابلسي والمسقية بالشربات الدافئ والمكسرات.",
    "descriptionEn": "Golden crispy shredded pastry layered with rich clotted cream or cheese, drenched in scented rose blossom syrup and pistachios.",
    "region": "general",
    "mealType": [
      "dessert"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 25,
    "servings": 8,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "رمضاني",
      "حلويات",
      "كنافة",
      "قشطة",
      "Sweet Icon"
    ],
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Cheese%20Kanafeh.jpg?width=1000",
    "galleryImages": [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "ملكة الحلويات العربية الرمضانية، يعود أصلها لمدينة نابلس وتشتهر بلونها الذهبي وقوامها المقرمش المحشو بالقشطة الذائبة.",
    "storyEn": "The crown jewel of Middle Eastern sweet making, famous for its crisp buttery crust and silky warm cream center.",
    "ingredients": [
      {
        "id": "kn1",
        "nameAr": "عجين كنافة شعر طازج",
        "nameEn": "Fresh Shredded Kunafa Dough",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "bakery"
      },
      {
        "id": "kn2",
        "nameAr": "سمن بلدي مذاب",
        "nameEn": "Melted Ghee (Samen)",
        "amount": 200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "kn3",
        "nameAr": "قشطة بلدي أو جبن نابلسي حلو",
        "nameEn": "Clotted Cream (Ashta) or Sweet Nabulsi Cheese",
        "amount": 350,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "kn4",
        "nameAr": "شربات متوسط بماء الورد والليمون",
        "nameEn": "Sugar Syrup with Rosewater",
        "amount": 300,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      },
      {
        "id": "kn5",
        "nameAr": "فسدق حلبي مفروم للتزيين",
        "nameEn": "Crushed Pistachios",
        "amount": 80,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "فرك عجينة الكنافة بالسمن البلدي المذاب جيدا حتى تتشبع.",
      "كبس نصف كمية الكنافة في صينية مقاس 30 بإحكام.",
      "وزع القشطة البلدية أو الجبن النابلسي في منتصف الصينية مع الابتعاد عن الأطراف.",
      "غطِ القشطة بباقت الكنافة واضغط عليها برفق.",
      "ادخل الكنافة فرناً ساخناً عند 200 مئوية 25 دقيقة حتي تحمر الأطراف وتصبح ذهبية.",
      "اقلب الكنافة فوراً واسقها بالشربات الدافئ وزينها بالفسدق الحلبي المفروم."
    ],
    "instructionsEn": [
      "Shred kunafa pastry finely and rub thoroughly with warm melted ghee.",
      "Press half the buttery dough firmly into the bottom of a 12-inch baking pan.",
      "Spread thick clotted cream or sweet cheese evenly, keeping away from pan edges.",
      "Cover with remaining dough and smooth gently.",
      "Bake at 200°C for 25 minutes until edges turn deep golden crisp.",
      "Invert onto a serving dish, immediately pour warm scented syrup, and garnish with pistachios."
    ],
    "timerSteps": [
      {
        "stepIndex": 4,
        "titleAr": "خبز الكنافة بالفرن",
        "titleEn": "Bake Kunafa Tray",
        "durationMinutes": 25
      }
    ],
    "votesCount": {
      "likes": 420,
      "dislikes": 5
    },
    "rating": 4.97
  },
  {
    "id": "levant-kibbeh-shami",
    "titleAr": "الكبة الشامية المقلية بالجوز واللحم",
    "titleEn": "Levantine Crispy Fried Kibbeh",
    "descriptionAr": "أقراص البرغل الناعم المحشوة باللحم المفروم المتبل والبصل والصنوبر والجوز، والمقلية حتى تكتسب قشرة مقرمشة ولذيذة.",
    "descriptionEn": "Bulgur wheat shells filled with spiced minced lamb, caramelized onions, pine nuts, and walnuts fried to crunchy perfection.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "snack",
      "iftar"
    ],
    "prepTimeMinutes": 40,
    "cookTimeMinutes": 20,
    "servings": 6,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "شامي",
      "كبة",
      "برغل",
      "صنوبر",
      "Levantine Classic"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Fried%20Kibbeh.jpg?updatedAt=1784964171694",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Fried%20Kibbeh.jpg?updatedAt=1784964171694",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تعتبر الكبة زين الموائد الشامية في رمضان والعزائم، وتتطلب مهارة عالية في تشكيل الأقراص الرقيقة جداً المحشوة باللحم والمكسرات.",
    "storyEn": "An iconic symbol of Levantine culinary craft, requiring delicate hand skills to shape wafer-thin crispy shells.",
    "ingredients": [
      {
        "id": "kb1",
        "nameAr": "برغل أبيض ناعم منقوع",
        "nameEn": "Fine White Bulgur Wheat (soaked)",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "kb2",
        "nameAr": "لحم هبرة ناعم للقشرة",
        "nameEn": "Lean Beef or Lamb (for shell paste)",
        "amount": 350,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "kb3",
        "nameAr": "لحم مفروم للحشوة مع بصل",
        "nameEn": "Minced Meat & Onions (for filling)",
        "amount": 450,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "kb4",
        "nameAr": "صنوبر وجوز مقطع وبودرة بهارات كبة",
        "nameEn": "Pine Nuts, Walnuts & Kibbeh Spices",
        "amount": 100,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "kb5",
        "nameAr": "زيت لقلي الكبة",
        "nameEn": "Oil for Deep Frying",
        "amount": 300,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اطحن البرغل مع اللحم الهبرة والبصل والبهارات في المفرمة مرتين حتى تتكون عجينة ناعمة.",
      "عصّج لحم الحشوة مع البصل والصنوبر والجوز ودبس الرمان.",
      "شكل أقراص الكبة بفتحة تجويف رقيقة جداً، واحشها باللحم واغلق الأطراف.",
      "اقلِ الكبة في زيت غزير ساخن حتى تصبح مقرمشة وذهبية.",
      "تقدم مع الشوربة وسلطة اللبن بالخيار."
    ],
    "instructionsEn": [
      "Process fine bulgur, lean meat, onions, and spices through a meat grinder twice until a malleable paste forms.",
      "Sauté minced meat filling with onions, toasted pine nuts, walnuts, and pomegranate molasses.",
      "Shape paste into hollow thin-walled ovals, stuff with filling, and seal pointed ends cleanly.",
      "Deep fry in hot oil until deeply golden crisp.",
      "Serve hot alongside lentil soup and cucumber yogurt salad."
    ],
    "timerSteps": [
      {
        "stepIndex": 3,
        "titleAr": "قلي أقراص الكبة",
        "titleEn": "Fry Golden Kibbeh",
        "durationMinutes": 8
      }
    ],
    "votesCount": {
      "likes": 345,
      "dislikes": 6
    },
    "rating": 4.9
  },
  {
    "id": "ramadan-sambousak",
    "titleAr": "السمبوسك الرمضانية الهشة بالجبن واللحم",
    "titleEn": "Crisp Ramadan Sambousak (Cheese & Meat)",
    "descriptionAr": "مثلثات العجين المقرمشة المحشوة بالأجبان المعطرة بحبة البركة أو اللحم المفروم المتبل، والمقلية أو المخبوزة بالفرن.",
    "descriptionEn": "Golden crispy pastry triangles stuffed with spiced minced meat or rich melting cheese with black cumin seeds.",
    "region": "general",
    "mealType": [
      "snack",
      "iftar",
      "suhoor"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 15,
    "servings": 6,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "رمضاني",
      "مقبلات",
      "سمبوسك",
      "جبن",
      "Iftar Appetizer"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Sambousek.JPG",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Sambousek.JPG",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "لا تخلو سفرة إفطار رمضانية في العالم العربي من مقبلات السمبوسك المقرمشة التي تقدم فور آذان المغرب.",
    "storyEn": "An absolute non-negotiable starter across Arab Iftar tables, celebrated for its flaky golden shell.",
    "ingredients": [
      {
        "id": "sb1",
        "nameAr": "شرائح عجينة سمبوسك طازجة",
        "nameEn": "Fresh Sambousak Pastry Sheets",
        "amount": 300,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "bakery"
      },
      {
        "id": "sb2",
        "nameAr": "لحم مفروم معصج بالبنوة والبهارات",
        "nameEn": "Spiced Cooked Minced Beef",
        "amount": 250,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "sb3",
        "nameAr": "خليط جبن عكاوي وموزاريلا بحبة البركة",
        "nameEn": "Akawi & Mozzarella Cheese with Nigella Seeds",
        "amount": 250,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "sb4",
        "nameAr": "زيت لقلي السمبوسك",
        "nameEn": "Frying Oil",
        "amount": 250,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "احشُ شرائح العجينة باللحم المعصج أو خليط الجبن وحبة البركة واطوها على شكل مثلثات محكمة.",
      "اقلِ مثلثات السمبوسك في زيت ساخن حتى تكتسب لوناً ذهبياً مقرمشاً.",
      "صفها على ورق مطبخ وتقدم فوراً دافئة ومقرمشة."
    ],
    "instructionsEn": [
      "Fill pastry strips with spiced beef or black seed cheese blend, folding into tight triangular pockets.",
      "Fry in hot oil until puffed and golden brown.",
      "Drain on towels and serve immediately crisp."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "قلي السمبوسك الذهبية",
        "titleEn": "Fry Sambousak Triangles",
        "durationMinutes": 6
      }
    ],
    "votesCount": {
      "likes": 360,
      "dislikes": 4
    },
    "rating": 4.91
  },
  {
    "id": "levant-fattoush-tabbouleh",
    "titleAr": "سلطة الفتوش الشامية بالدبس والخبز المحمص",
    "titleEn": "Levantine Fattoush & Tabbouleh Fresh Salad",
    "descriptionAr": "سلطة الخضار الطازجة مع الخبز المحمص ودبس الرمان والنعناع الطازج، والسماق الجبلي.",
    "descriptionEn": "Vibrant tossed salad with crisp garden greens, fried pita chips, tangy sumac, and rich pomegranate molasses dressing.",
    "region": "levant",
    "mealType": [
      "breakfast",
      "lunch",
      "dinner",
      "snack",
      "iftar",
      "suhoor"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 0,
    "servings": 4,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "شامي",
      "سلطة",
      "فتوش",
      "تبولة",
      "نباتي",
      "Fresh Salad"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Fattoush.JPG",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Fattoush.JPG",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "السلطة الأولى على السفرة الرمضانية والشامية، تجمع انتعاش الأعشاب الخضراء مع حموضة السماق ودبس الرمان وقرمشة الخبز.",
    "storyEn": "The most famous refreshing salad of the Levant, bringing zesty pomegranate molasses and crispy pita together.",
    "ingredients": [
      {
        "id": "ft1",
        "nameAr": "خيار وطماطم وفجل وبقلة وخس",
        "nameEn": "Cucumbers, Tomatoes, Radishes, Purslane & Romaine",
        "amount": 600,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "ft2",
        "nameAr": "خبز عربي مقطع ومقلي أو محمص",
        "nameEn": "Crispy Fried Pita Bread Chips",
        "amount": 150,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "bakery"
      },
      {
        "id": "ft3",
        "nameAr": "دبس رمان بكر وسماق وعصير ليمون",
        "nameEn": "Pomegranate Molasses, Sumac & Lemon Juice",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "ft4",
        "nameAr": "زيت زيتون بكر ونعناع طازج",
        "nameEn": "Extra Virgin Olive Oil & Fresh Mint",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "produce"
      }
    ],
    "instructionsAr": [
      "افرم الخضروات (طماطم، خيار، فجل، خس، نعناع، بقلة) قطعا متوسطة الحجم.",
      "اخلط التتبيلة: زيت الزيتون ودبس الرمان وعصير الليمون والسماق والثوم والملح.",
      "اخلط الخضروات مع التتبيلة، وزين بالخبز المحمص المقرمش على الوجه وتقدم فوراً."
    ],
    "instructionsEn": [
      "Chop cucumbers, tomatoes, radishes, lettuce, fresh mint, and purslane into bite-sized pieces.",
      "Whisk dressing: extra virgin olive oil, pomegranate molasses, fresh lemon juice, sumac, minced garlic, and salt.",
      "Toss salad with dressing, top with crunchy fried pita chips, and serve immediately."
    ],
    "timerSteps": [],
    "votesCount": {
      "likes": 310,
      "dislikes": 2
    },
    "rating": 4.92
  },
  {
    "id": "egypt-mombar",
    "titleAr": "الممبار المصري المحشي بالأرز المسبك",
    "titleEn": "Egyptian Stuffed Beef Tripe (Mombar)",
    "descriptionAr": "أمعاء البقر الدقيقة المحشوة بخلطة الأرز المصرية المعطرة بالأعشاب والصلصة والمغلي ثم المقلي حتي يصبح مقرمشاً وذهبياً.",
    "descriptionEn": "Beef sausage casing stuffed with seasoned herbs and rice filling, boiled in fragrant broth and fried crispy golden.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "snack",
      "iftar"
    ],
    "prepTimeMinutes": 35,
    "cookTimeMinutes": 45,
    "servings": 5,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "ممبار",
      "محشي",
      "شعبي",
      "Street Icon"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Mombar.jpeg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Mombar.jpeg",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "يعشق المصريون الممبار المقرمش المحمر بالسمن البلدي، ويعد من أشهر الأطباق الشعبية في أعياد الأضحى والعزائم.",
    "storyEn": "A revered Egyptian street delicacy, boiled in savory herb stock and pan-fried until golden crunchy.",
    "ingredients": [
      {
        "id": "mb1",
        "nameAr": "ممبار بقري نظيف تماماً",
        "nameEn": "Cleaned Beef Intestine Casings",
        "amount": 1000,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "mb2",
        "nameAr": "أرز مصري وخضرة محشي",
        "nameEn": "Egyptian Rice & Fresh Herbs (Dill, Parsley, Cilantro)",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "mb3",
        "nameAr": "صلصة طماطم وبصل مفروم وسمن",
        "nameEn": "Tomato Puree, Diced Onions & Ghee",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "mb4",
        "nameAr": "بهارات وقرفة وفلفل حار",
        "nameEn": "Egyptian Spices & Chili Flakes",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "mb5",
        "nameAr": "زيت لقلي الممبار",
        "nameEn": "Frying Oil",
        "amount": 250,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "خلط الأرز المغسول مع خضرة المحشي والبصل النيء وعصير الطماطم والسمن والبهارات.",
      "احشُ وحدات الممبار حتى نصفها فقط لتسمح بانتفاخ الأرز.",
      "اسقط الممبار في ماء مغلي مع بصل وهيل وقرفة، حيث يغلق تلقائياً من الطرفين ويغلي 45 دقيقة.",
      "اصفِ الممبار واقله في زيت ساخن حتي يصبح مقرمشاً وذهبياً.",
      "يرش بالملح والفلفل الأسود والبقدونس المفروم ويقدم ساخناً."
    ],
    "instructionsEn": [
      "Mix washed rice with fresh herbs, raw onions, seasoned tomato puree, and ghee.",
      "Stuff casings half-full to allow room for rice expansion.",
      "Drop stuffed mombar into boiling herb water; ends seal automatically. Simmer 45 minutes.",
      "Drain and fry in hot oil until deep golden crispy.",
      "Sprinkle with salt, black pepper, chopped parsley, and serve piping hot."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "سلق وحدات الممبار",
        "titleEn": "Boil Stuffed Mombar",
        "durationMinutes": 45
      },
      {
        "stepIndex": 3,
        "titleAr": "قلي الممبار الذهبي",
        "titleEn": "Fry Golden Crisp Mombar",
        "durationMinutes": 10
      }
    ],
    "votesCount": {
      "likes": 350,
      "dislikes": 8
    },
    "rating": 4.88
  },
  {
    "id": "egypt-kofta-haty",
    "titleAr": "كفتة الحاتي المصرية",
    "titleEn": "Egyptian Kofta Haty",
    "descriptionAr": "أصابع لحم متبلة بالبصل والبقدونس ومشوية على الفحم على طريقة محلات الكباب المصرية.",
    "descriptionEn": "Charcoal-grilled minced beef and lamb skewers seasoned with onion, parsley, and warm spices.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 30,
    "cookTimeMinutes": 18,
    "servings": 5,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "مشويات",
      "كفتة",
      "عزائم"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Koftet-el-hati.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Koftet-el-hati.jpg"
    ],
    "storyAr": "ترتبط كفتة الحاتي بمحلات الكباب الشعبية في القاهرة والإسكندرية، حيث تمنحها نار الفحم رائحتها المميزة.",
    "storyEn": "Kofta Haty is associated with Egypt's neighborhood kebab shops, where charcoal gives the skewers their characteristic smoky aroma.",
    "ingredients": [
      {
        "id": "ekh1",
        "nameAr": "لحم بقري مفروم",
        "nameEn": "Minced beef",
        "amount": 700,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "ekh2",
        "nameAr": "لحم ضأن مفروم",
        "nameEn": "Minced lamb",
        "amount": 200,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "ekh3",
        "nameAr": "بصل مبشور ومصفى",
        "nameEn": "Grated, drained onion",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "ekh4",
        "nameAr": "بقدونس مفروم",
        "nameEn": "Chopped parsley",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "produce"
      },
      {
        "id": "ekh5",
        "nameAr": "بهارات لحم وفلفل أسود",
        "nameEn": "Meat spice and black pepper",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "ekh6",
        "nameAr": "ملح",
        "nameEn": "Salt",
        "amount": 1.5,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اخلط اللحم مع البصل المصفى والبقدونس والبهارات والملح حتى يتماسك الخليط.",
      "غط الخليط وبرّده 20 دقيقة، ثم شكله أصابع حول أسياخ معدنية.",
      "اشوِ الكفتة على فحم متوسط الحرارة مع تدويرها حتى تتحمر وتنضج.",
      "اتركها دقيقتين ثم قدمها مع الطحينة والخبز البلدي والسلطة."
    ],
    "instructionsEn": [
      "Mix both meats with drained onion, parsley, spices, and salt until cohesive.",
      "Cover and chill for 20 minutes, then shape firmly around metal skewers.",
      "Grill over medium charcoal, turning until browned and safely cooked through.",
      "Rest for two minutes and serve with tahini, baladi bread, and salad."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "تبريد الخليط",
        "titleEn": "Chill mixture",
        "durationMinutes": 20
      },
      {
        "stepIndex": 2,
        "titleAr": "شوي الكفتة",
        "titleEn": "Grill kofta",
        "durationMinutes": 12
      }
    ],
    "votesCount": {
      "likes": 180,
      "dislikes": 4
    },
    "rating": 4.88
  },
  {
    "id": "egypt-hamam-mahshi",
    "titleAr": "حمام محشي بالفريك",
    "titleEn": "Egyptian Pigeon Stuffed with Freekeh",
    "descriptionAr": "حمام كامل محشو بالفريك المتبل ومسلوق ثم محمر بالسمن البلدي.",
    "descriptionEn": "Whole pigeon filled with spiced freekeh, gently simmered, then browned in ghee.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 35,
    "cookTimeMinutes": 60,
    "servings": 4,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "حمام",
      "فريك",
      "عزائم"
    ],
    "image": "https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "الحمام المحشي طبق احتفالي قديم في الريف والمدن المصرية ويقدم عادة في الولائم والمناسبات.",
    "storyEn": "Stuffed pigeon is a long-standing Egyptian celebration dish served at family feasts in both rural and urban communities.",
    "ingredients": [
      {
        "id": "ehm1",
        "nameAr": "حمام منظف",
        "nameEn": "Cleaned pigeons",
        "amount": 4,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "meat"
      },
      {
        "id": "ehm2",
        "nameAr": "فريك مغسول",
        "nameEn": "Rinsed freekeh",
        "amount": 1.5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "ehm3",
        "nameAr": "بصل مفروم",
        "nameEn": "Chopped onion",
        "amount": 1,
        "unitAr": "حبة",
        "unitEn": "pc",
        "aisle": "produce"
      },
      {
        "id": "ehm4",
        "nameAr": "كبد وقوانص الحمام",
        "nameEn": "Pigeon liver and giblets",
        "amount": 150,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "ehm5",
        "nameAr": "سمن بلدي",
        "nameEn": "Ghee",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "ehm6",
        "nameAr": "هيل وورق غار وفلفل",
        "nameEn": "Cardamom, bay, and pepper",
        "amount": 1,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "شوح البصل والكبد والقوانص في السمن ثم أضف الفريك والبهارات وقليلاً من الماء حتى نصف النضج.",
      "احش الحمام دون ضغط زائد وأغلق الفتحة بخيط مطبخ.",
      "اسلق الحمام برفق في ماء متبل بالهيل وورق الغار حتى ينضج.",
      "جففه وادهنه بالسمن ثم حمّره في الفرن قبل التقديم."
    ],
    "instructionsEn": [
      "Sauté onion, liver, and giblets in ghee; add freekeh, spices, and a little water and cook halfway.",
      "Loosely stuff each pigeon and secure the opening with kitchen twine.",
      "Gently simmer in water seasoned with cardamom and bay until cooked through.",
      "Dry, brush with ghee, and roast briefly until deeply browned."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "سلق الحمام",
        "titleEn": "Simmer pigeons",
        "durationMinutes": 40
      },
      {
        "stepIndex": 3,
        "titleAr": "التحمير",
        "titleEn": "Brown in oven",
        "durationMinutes": 12
      }
    ],
    "votesCount": {
      "likes": 210,
      "dislikes": 5
    },
    "rating": 4.91
  },
  {
    "id": "egypt-roz-meammar",
    "titleAr": "أرز معمر مصري بالسمن والقشطة",
    "titleEn": "Egyptian Roz Meammar Casserole",
    "descriptionAr": "أرز قصير الحبة مخبوز بالحليب والقشطة والسمن البلدي حتى تتكون قشرة ذهبية محمرة.",
    "descriptionEn": "Short-grain rice baked with milk, cream, and ghee beneath a golden bubbly crust.",
    "region": "egypt",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 55,
    "servings": 6,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "أرز",
      "طاجن",
      "ريفي"
    ],
    "image": "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "يشتهر الأرز المعمر في قرى دلتا النيل ويخبز تقليدياً في طواجن فخار تحتفظ بالحرارة.",
    "storyEn": "Roz meammar is strongly associated with Nile Delta villages and is traditionally baked in heat-retaining clay casseroles.",
    "ingredients": [
      {
        "id": "erm1",
        "nameAr": "أرز مصري قصير الحبة",
        "nameEn": "Egyptian short-grain rice",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "erm2",
        "nameAr": "حليب كامل الدسم",
        "nameEn": "Whole milk",
        "amount": 4,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "dairy"
      },
      {
        "id": "erm3",
        "nameAr": "قشطة بلدي",
        "nameEn": "Cream",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "dairy"
      },
      {
        "id": "erm4",
        "nameAr": "سمن بلدي",
        "nameEn": "Ghee",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "erm5",
        "nameAr": "ملح",
        "nameEn": "Salt",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "erm6",
        "nameAr": "فلفل أسود",
        "nameEn": "Black pepper",
        "amount": 0.5,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اغسل الأرز وانقعه 15 دقيقة ثم صفه وضعه في طاجن مدهون بالسمن.",
      "سخن الحليب مع الملح والفلفل دون غليان واسكبه فوق الأرز.",
      "وزع القشطة والسمن على الوجه واخبز في فرن ساخن حتى يمتص الأرز السائل.",
      "ارفع الحرارة في الدقائق الأخيرة حتى يصبح الوجه ذهبياً ثم أرحه قبل التقديم."
    ],
    "instructionsEn": [
      "Rinse rice, soak for 15 minutes, drain, and place in a ghee-coated casserole.",
      "Warm milk with salt and pepper without boiling, then pour it over the rice.",
      "Dot the top with cream and ghee and bake until the rice absorbs the liquid.",
      "Increase heat briefly to brown the top, then rest before serving."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "نقع الأرز",
        "titleEn": "Soak rice",
        "durationMinutes": 15
      },
      {
        "stepIndex": 2,
        "titleAr": "خبز الأرز",
        "titleEn": "Bake rice",
        "durationMinutes": 45
      }
    ],
    "votesCount": {
      "likes": 195,
      "dislikes": 3
    },
    "rating": 4.87
  },
  {
    "id": "egypt-bessara",
    "titleAr": "البصارة المصرية بالأعشاب",
    "titleEn": "Egyptian Bessara Herb Dip",
    "descriptionAr": "مهروس فول مدشوش أخضر بالأعشاب والثوم يزين بالبصل المقرمش وزيت الزيتون.",
    "descriptionEn": "A green split-fava purée with herbs and garlic, topped with crisp golden onions.",
    "region": "egypt",
    "mealType": [
      "breakfast",
      "lunch",
      "dinner"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 45,
    "servings": 6,
    "difficulty": "easy",
    "isRamadanSpecial": false,
    "tags": [
      "مصري",
      "نباتي",
      "فول",
      "اقتصادي"
    ],
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "البصارة من أطباق البيوت المصرية الاقتصادية القديمة وتعتمد على الفول المدشوش والأعشاب المتاحة.",
    "storyEn": "Bessara is an old, economical Egyptian home dish built from split fava beans and abundant fresh herbs.",
    "ingredients": [
      {
        "id": "eb1",
        "nameAr": "فول مدشوش",
        "nameEn": "Split fava beans",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "eb2",
        "nameAr": "بقدونس وشبت وكزبرة",
        "nameEn": "Parsley, dill, and cilantro",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "produce"
      },
      {
        "id": "eb3",
        "nameAr": "بصل",
        "nameEn": "Onions",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "eb4",
        "nameAr": "ثوم",
        "nameEn": "Garlic",
        "amount": 6,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "eb5",
        "nameAr": "كمون وكزبرة جافة",
        "nameEn": "Cumin and ground coriander",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "eb6",
        "nameAr": "زيت نباتي",
        "nameEn": "Vegetable oil",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اغسل الفول المدشوش واسلقه مع بصلة والثوم والأعشاب حتى يطرى تماماً.",
      "اخلط المزيج حتى يصبح مهروساً ناعماً ثم أعده إلى نار هادئة وتبله.",
      "حمّر شرائح البصل في الزيت حتى تصبح مقرمشة واحتفظ بقليل من الزيت.",
      "قدم البصارة دافئة أو باردة وزينها بالبصل المقرمش."
    ],
    "instructionsEn": [
      "Rinse split favas and simmer with one onion, garlic, and herbs until completely tender.",
      "Blend smooth, return to low heat, and season with cumin, coriander, and salt.",
      "Fry sliced remaining onions in oil until crisp and reserve a little flavored oil.",
      "Serve warm or cool, topped with the crisp onions."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "سلق الفول",
        "titleEn": "Simmer fava beans",
        "durationMinutes": 35
      },
      {
        "stepIndex": 2,
        "titleAr": "تحمير البصل",
        "titleEn": "Crisp onions",
        "durationMinutes": 10
      }
    ],
    "votesCount": {
      "likes": 160,
      "dislikes": 4
    },
    "rating": 4.82
  },
  {
    "id": "egypt-feteer-meshaltet",
    "titleAr": "الفطير المشلتت الفلاحي",
    "titleEn": "Egyptian Feteer Meshaltet Pastry",
    "descriptionAr": "فطير ريفي متعدد الطبقات مورق بالسمن البلدي ويقدم مع العسل والجبن القديم.",
    "descriptionEn": "A flaky, many-layered country pastry enriched with ghee and served with honey or aged cheese.",
    "region": "egypt",
    "mealType": [
      "breakfast",
      "snack"
    ],
    "prepTimeMinutes": 45,
    "cookTimeMinutes": 25,
    "servings": 8,
    "difficulty": "hard",
    "isRamadanSpecial": false,
    "tags": [
      "مصري",
      "فطير",
      "ريفي",
      "مخبوزات"
    ],
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "الفطير المشلتت رمز للضيافة الريفية المصرية، وتبنى طبقاته بفرد العجين وطيه مراراً بالسمن.",
    "storyEn": "Feteer meshaltet is a symbol of rural Egyptian hospitality, with layers built by repeatedly stretching and folding ghee-brushed dough.",
    "ingredients": [
      {
        "id": "efm1",
        "nameAr": "دقيق خبز",
        "nameEn": "Bread flour",
        "amount": 750,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "efm2",
        "nameAr": "ماء فاتر",
        "nameEn": "Lukewarm water",
        "amount": 400,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "other"
      },
      {
        "id": "efm3",
        "nameAr": "ملح",
        "nameEn": "Salt",
        "amount": 1.5,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "efm4",
        "nameAr": "سمن بلدي مذاب",
        "nameEn": "Melted ghee",
        "amount": 250,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "efm5",
        "nameAr": "زيت",
        "nameEn": "Oil",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "efm6",
        "nameAr": "عسل للتقديم",
        "nameEn": "Honey, to serve",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اعجن الدقيق والماء والملح حتى تصبح العجينة ناعمة ثم أرحها 30 دقيقة.",
      "قسم العجين كرات وادهنها بالزيت، ثم افرد كل كرة رقيقة جداً على سطح مدهون.",
      "ادهن بالسمن واطوِ العجين على نفسه، وضع الطبقات داخل بعضها لتكوين قرص.",
      "أرح القرص 15 دقيقة ثم اخبزه في فرن شديد الحرارة حتى ينتفخ ويحمر."
    ],
    "instructionsEn": [
      "Knead flour, water, and salt until smooth, then rest for 30 minutes.",
      "Divide into oiled balls and stretch each paper-thin on a greased surface.",
      "Brush with ghee, fold, and nest the folded layers together into one round.",
      "Rest for 15 minutes, then bake in a very hot oven until puffed and golden."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "راحة العجين",
        "titleEn": "Rest dough",
        "durationMinutes": 30
      },
      {
        "stepIndex": 3,
        "titleAr": "خبز الفطير",
        "titleEn": "Bake feteer",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 230,
      "dislikes": 5
    },
    "rating": 4.92
  },
  {
    "id": "egypt-roz-bel-laban",
    "titleAr": "أرز باللبن المصري بالمكسرات",
    "titleEn": "Egyptian Rice Pudding with Pistachios",
    "descriptionAr": "حلوى كريمية من الأرز والحليب والفانيليا تزين بالفستق والقرفة.",
    "descriptionEn": "Creamy rice pudding scented with vanilla and finished with crushed pistachios or cinnamon.",
    "region": "egypt",
    "mealType": [
      "dessert",
      "snack",
      "suhoor"
    ],
    "prepTimeMinutes": 5,
    "cookTimeMinutes": 40,
    "servings": 6,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "حلويات",
      "أرز باللبن",
      "بارد"
    ],
    "image": "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "الأرز باللبن حلوى منزلية ومحلّية واسعة الانتشار في مصر وتقدم ساخنة أو مبردة.",
    "storyEn": "Rice pudding is a widely loved Egyptian home and dairy-shop dessert, served either warm or thoroughly chilled.",
    "ingredients": [
      {
        "id": "erbl1",
        "nameAr": "أرز مصري",
        "nameEn": "Egyptian short-grain rice",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "erbl2",
        "nameAr": "حليب كامل الدسم",
        "nameEn": "Whole milk",
        "amount": 1.5,
        "unitAr": "لتر",
        "unitEn": "L",
        "aisle": "dairy"
      },
      {
        "id": "erbl3",
        "nameAr": "سكر",
        "nameEn": "Sugar",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "erbl4",
        "nameAr": "نشا ذرة",
        "nameEn": "Cornstarch",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "erbl5",
        "nameAr": "فانيليا",
        "nameEn": "Vanilla",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "erbl6",
        "nameAr": "فستق أو قرفة",
        "nameEn": "Pistachios or cinnamon",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اسلق الأرز في ماء قليل حتى يطرى ويمتص الماء.",
      "أضف معظم الحليب الساخن والسكر واطهه على نار هادئة مع التقليب.",
      "ذب النشا في الحليب المتبقي وأضفه مع الفانيليا حتى يثخن القوام.",
      "وزع في أطباق وزين بالفستق أو القرفة وقدمه دافئاً أو مبرداً."
    ],
    "instructionsEn": [
      "Simmer rice in a small amount of water until tender and the water is absorbed.",
      "Add most of the warm milk and sugar; cook gently while stirring.",
      "Dissolve cornstarch in remaining milk and add with vanilla, stirring until thick.",
      "Portion, garnish with pistachios or cinnamon, and serve warm or chilled."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "سلق الأرز",
        "titleEn": "Cook rice",
        "durationMinutes": 15
      },
      {
        "stepIndex": 2,
        "titleAr": "تكثيف المهلبية",
        "titleEn": "Thicken pudding",
        "durationMinutes": 6
      }
    ],
    "votesCount": {
      "likes": 175,
      "dislikes": 2
    },
    "rating": 4.86
  },
  {
    "id": "egypt-basbousa",
    "titleAr": "البسبوسة المصرية المكرملة",
    "titleEn": "Egyptian Basbousa Semolina Cake",
    "descriptionAr": "كيكة سميد طرية بالسمن والزبادي تسقى بشربات الليمون الدافئ وتزين بالمكسرات.",
    "descriptionEn": "Tender semolina cake enriched with ghee and yogurt and soaked in lemon rose syrup.",
    "region": "egypt",
    "mealType": [
      "dessert",
      "snack",
      "iftar"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 35,
    "servings": 12,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "حلويات",
      "سميد",
      "رمضان"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Basboosa.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Basboosa.jpg"
    ],
    "storyAr": "البسبوسة من أشهر حلويات الصواني في مصر وتظهر بقوة في رمضان والمناسبات العائلية.",
    "storyEn": "Basbousa is among Egypt's best-known tray bakes and is especially prominent during Ramadan and family gatherings.",
    "ingredients": [
      {
        "id": "eb1",
        "nameAr": "سميد خشن",
        "nameEn": "Coarse semolina",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "eb2",
        "nameAr": "سكر",
        "nameEn": "Sugar",
        "amount": 1.5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "eb3",
        "nameAr": "زبادي",
        "nameEn": "Yogurt",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "dairy"
      },
      {
        "id": "eb4",
        "nameAr": "سمن مذاب",
        "nameEn": "Melted ghee",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "dairy"
      },
      {
        "id": "eb5",
        "nameAr": "جوز هند",
        "nameEn": "Desiccated coconut",
        "amount": 0.25,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "eb6",
        "nameAr": "عصير ليمون",
        "nameEn": "Lemon juice",
        "amount": 1,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "produce"
      }
    ],
    "instructionsAr": [
      "اغل كوب سكر مع كوب ماء وعصير الليمون عشر دقائق ثم برد الشربات.",
      "اخلط السميد مع السكر المتبقي وجوز الهند ثم أضف السمن والزبادي دون إفراط في الخلط.",
      "افرد الخليط في صينية مدهونة وقطعه معينات ثم اخبزه حتى يصبح ذهبياً.",
      "اسق البسبوسة الساخنة بالشربات البارد واتركها تتشرب قبل التقديم."
    ],
    "instructionsEn": [
      "Boil one cup sugar with one cup water and lemon for ten minutes; cool the syrup.",
      "Combine semolina, remaining sugar, and coconut, then fold in ghee and yogurt without overmixing.",
      "Spread in a greased pan, score into diamonds, and bake until golden.",
      "Pour cool syrup over the hot cake and let it absorb before serving."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "غلي الشربات",
        "titleEn": "Boil syrup",
        "durationMinutes": 10
      },
      {
        "stepIndex": 2,
        "titleAr": "خبز البسبوسة",
        "titleEn": "Bake basbousa",
        "durationMinutes": 30
      }
    ],
    "votesCount": {
      "likes": 290,
      "dislikes": 6
    },
    "rating": 4.91
  },
  {
    "id": "egypt-feseekh",
    "titleAr": "طبق الفسيخ المصري بالليمون والبصل",
    "titleEn": "Egyptian Cured Feseekh Platter",
    "descriptionAr": "سمك بوري مملح تقليدي يقدم منظفاً مع عصير الليمون والخل والبصل الأخضر والطحينة.",
    "descriptionEn": "Traditional salt-cured grey mullet, carefully cleaned and served with lemon, spring onion, and tahini dip.",
    "region": "egypt",
    "mealType": [
      "lunch"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 0,
    "servings": 4,
    "difficulty": "medium",
    "isRamadanSpecial": false,
    "tags": [
      "مصري",
      "شم النسيم",
      "سمك مملح",
      "تراثي"
    ],
    "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "يرتبط الفسيخ ارتباطاً وثيقاً باحتفال شم النسيم المصري منذ آلاف السنين.",
    "storyEn": "Feseekh is closely tied to Egypt's ancient Sham El-Nessim spring celebration.",
    "ingredients": [
      {
        "id": "ef1",
        "nameAr": "فسيخ بوري جاهز من مصدر مرخص",
        "nameEn": "Licensed, ready-cured feseekh mullet",
        "amount": 800,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "ef2",
        "nameAr": "ليمون",
        "nameEn": "Lemons",
        "amount": 4,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "ef3",
        "nameAr": "بصل أخضر",
        "nameEn": "Spring onions",
        "amount": 2,
        "unitAr": "حزمة",
        "unitEn": "bunches",
        "aisle": "produce"
      },
      {
        "id": "ef4",
        "nameAr": "طحينة",
        "nameEn": "Tahini",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "ef5",
        "nameAr": "خل",
        "nameEn": "Vinegar",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "ef6",
        "nameAr": "خبز بلدي",
        "nameEn": "Baladi bread",
        "amount": 4,
        "unitAr": "رغيف",
        "unitEn": "loaves",
        "aisle": "bakery"
      }
    ],
    "instructionsAr": [
      "استخدم فقط فسيخاً جاهزاً من منشأة مرخصة ولا تحاول تمليح السمك منزلياً.",
      "انزع الجلد والرأس والأحشاء والعظام بسكين نظيف.",
      "قطع اللحم وضع عليه عصير الليمون والخل مباشرة قبل التقديم.",
      "قدمه فوراً مع البصل الأخضر والطحينة والخبز."
    ],
    "instructionsEn": [
      "Use ready-cured feseekh from a licensed producer.",
      "Remove skin, head, viscera, and bones using clean utensils.",
      "Cut the flesh and dress with lemon juice and vinegar immediately before serving.",
      "Serve promptly with spring onion, tahini, and pita bread."
    ],
    "timerSteps": [],
    "votesCount": {
      "likes": 140,
      "dislikes": 8
    },
    "rating": 4.75
  },
  {
    "id": "lebanon-manakish-zaatar",
    "titleAr": "مناقيش الزعتر اللبنانية",
    "titleEn": "Lebanese Za'atar Manakish",
    "descriptionAr": "أقراص عجين طرية مخبوزة بخليط الزعتر اللبناني والسماق والسمسم وزيت الزيتون البكر.",
    "descriptionEn": "Soft oven-baked flatbreads topped with fragrant za'atar, sumac, sesame, and extra virgin olive oil.",
    "region": "levant",
    "mealType": [
      "breakfast",
      "snack"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 10,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": false,
    "tags": [
      "لبناني",
      "مناقيش",
      "زعتر",
      "فطور"
    ],
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "المناقيش من أساسيات أفران الأحياء في لبنان وتؤكل ساخنة في الصباح مطوية مع الخضار.",
    "storyEn": "Manakish are a staple of Lebanese neighborhood bakeries, commonly eaten hot in the morning and folded around fresh vegetables.",
    "ingredients": [
      {
        "id": "lmz1",
        "nameAr": "دقيق",
        "nameEn": "Flour",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "lmz2",
        "nameAr": "خميرة فورية",
        "nameEn": "Instant yeast",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "lmz3",
        "nameAr": "ماء فاتر",
        "nameEn": "Lukewarm water",
        "amount": 300,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "other"
      },
      {
        "id": "lmz4",
        "nameAr": "زعتر لبناني",
        "nameEn": "Lebanese za'atar",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "lmz5",
        "nameAr": "زيت زيتون",
        "nameEn": "Olive oil",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "lmz6",
        "nameAr": "ملح وسكر",
        "nameEn": "Salt and sugar",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اخلط الدقيق والخميرة والسكر والملح ثم اعجن بالماء حتى تصبح العجينة ناعمة.",
      "غط العجين واتركه يختمر حتى يتضاعف، ثم قسمه ست كرات.",
      "اخلط الزعتر بزيت الزيتون وافرد كل كرة وضع الخليط فوقها مع ترك حافة.",
      "اخبز على صاج شديد السخونة حتى تنتفخ الحواف وينضج القاع."
    ],
    "instructionsEn": [
      "Mix flour, yeast, sugar, and salt; knead with water until smooth.",
      "Cover and proof until doubled, then divide into six balls.",
      "Mix za'atar with olive oil, flatten each ball, and spread topping short of the edge.",
      "Bake on a very hot tray or stone until edges puff and the base is cooked."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "تخمير العجين",
        "titleEn": "Proof dough",
        "durationMinutes": 60
      },
      {
        "stepIndex": 3,
        "titleAr": "خبز المناقيش",
        "titleEn": "Bake manakish",
        "durationMinutes": 8
      }
    ],
    "votesCount": {
      "likes": 260,
      "dislikes": 3
    },
    "rating": 4.9
  },
  {
    "id": "lebanon-mujadara",
    "titleAr": "المجدرة اللبنانية بالبصل المكرمل",
    "titleEn": "Lebanese Mujadara with Crispy Onions",
    "descriptionAr": "عدس بني وأرز متبلان بالكمون والبهارات ومغطّيان بشرائح البصل المكرمل الداكن.",
    "descriptionEn": "Brown lentils and rice seasoned with cumin and crowned with deeply caramelized golden brown onions.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 45,
    "servings": 6,
    "difficulty": "easy",
    "isRamadanSpecial": false,
    "tags": [
      "لبناني",
      "نباتي",
      "عدس",
      "اقتصادي"
    ],
    "image": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "المجدرة طبق منزلي نباتي متجذر في بلاد الشام ويعتمد على مكونات المؤونة البسيطة.",
    "storyEn": "Mujadara is a deeply rooted Levantine meatless home dish based on simple pantry staples.",
    "ingredients": [
      {
        "id": "lm1",
        "nameAr": "عدس بني",
        "nameEn": "Brown lentils",
        "amount": 1.5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "lm2",
        "nameAr": "أرز طويل الحبة",
        "nameEn": "Long-grain rice",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "lm3",
        "nameAr": "بصل",
        "nameEn": "Onions",
        "amount": 4,
        "unitAr": "حبة كبيرة",
        "unitEn": "large pcs",
        "aisle": "produce"
      },
      {
        "id": "lm4",
        "nameAr": "زيت زيتون",
        "nameEn": "Olive oil",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "lm5",
        "nameAr": "كمون",
        "nameEn": "Cumin",
        "amount": 1.5,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "lm6",
        "nameAr": "ملح وفلفل",
        "nameEn": "Salt and pepper",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اسلق العدس حتى يقترب من النضج مع الاحتفاظ بماء السلق.",
      "حمّر شرائح البصل ببطء في زيت الزيتون حتى تصبح داكنة ومكرملة.",
      "أضف الأرز والعدس والكمون وماء السلق الكافي واطه على نار هادئة.",
      "اترك المجدرة ترتاح ثم قدمها مع البصل المكرمل واللبن أو السلطة."
    ],
    "instructionsEn": [
      "Simmer lentils until nearly tender, reserving their cooking liquid.",
      "Slowly fry sliced onions in olive oil until deep brown and caramelized.",
      "Add rice, lentils, cumin, and enough reserved liquid; cover and cook gently.",
      "Rest, then serve topped with onions and accompanied by yogurt or salad."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "كرملة البصل",
        "titleEn": "Caramelize onions",
        "durationMinutes": 25
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الأرز والعدس",
        "titleEn": "Cook rice and lentils",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 190,
      "dislikes": 4
    },
    "rating": 4.85
  },
  {
    "id": "lebanon-shish-tawook",
    "titleAr": "الشيش طاووق اللبناني بالمستكة والتومية",
    "titleEn": "Lebanese Shish Tawook Skewers",
    "descriptionAr": "مكعبات دجاج طرية منقوعة باللبن والثوم والليمون والبابريكا ومشوية على أسياخ.",
    "descriptionEn": "Juicy chicken cubes marinated in yogurt, garlic, lemon, and paprika, grilled to smoky perfection.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 15,
    "servings": 5,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "لبناني",
      "دجاج",
      "مشويات",
      "ثوم"
    ],
    "image": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "الشيش طاووق من أشهر المشويات اللبنانية ويقدم غالباً مع الثومية والمخلل والخبز.",
    "storyEn": "Shish tawook is a mainstay of Lebanese grills, commonly paired with garlic sauce, pickles, and flatbread.",
    "ingredients": [
      {
        "id": "lst1",
        "nameAr": "صدور دجاج",
        "nameEn": "Chicken breast",
        "amount": 900,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "lst2",
        "nameAr": "لبن زبادي",
        "nameEn": "Yogurt",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "dairy"
      },
      {
        "id": "lst3",
        "nameAr": "ثوم مهروس",
        "nameEn": "Crushed garlic",
        "amount": 6,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "lst4",
        "nameAr": "عصير ليمون",
        "nameEn": "Lemon juice",
        "amount": 0.25,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "produce"
      },
      {
        "id": "lst5",
        "nameAr": "معجون طماطم",
        "nameEn": "Tomato paste",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "lst6",
        "nameAr": "بابريكا وزعتر",
        "nameEn": "Paprika and oregano",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اخلط اللبن والثوم والليمون ومعجون الطماطم والبهارات.",
      "أضف مكعبات الدجاج وانقعها في الثلاجة ساعتين على الأقل.",
      "شك الدجاج في أسياخ واشوه على حرارة متوسطة مع التقليب.",
      "تأكد من نضج الدجاج تماماً ثم أرحه وقدمه مع الثومية."
    ],
    "instructionsEn": [
      "Combine yogurt, garlic, lemon, tomato paste, and spices.",
      "Coat chicken cubes and marinate under refrigeration for at least two hours.",
      "Thread onto skewers and grill over medium heat, turning evenly.",
      "Verify the chicken is safely cooked through, rest briefly, and serve with toum."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "نقع الدجاج",
        "titleEn": "Marinate chicken",
        "durationMinutes": 120
      },
      {
        "stepIndex": 2,
        "titleAr": "شوي الدجاج",
        "titleEn": "Grill chicken",
        "durationMinutes": 12
      }
    ],
    "votesCount": {
      "likes": 280,
      "dislikes": 5
    },
    "rating": 4.91
  },
  {
    "id": "lebanon-batata-harra",
    "titleAr": "البطاطا الحرة اللبنانية",
    "titleEn": "Lebanese Spicy Batata Harra",
    "descriptionAr": "مكعبات بطاطا ذهبية مقرمشة بالثوم والكزبرة الخضراء والفلفل الأحمر الحار والليمون.",
    "descriptionEn": "Crisp golden potato cubes tossed with sautéed garlic, fresh cilantro, chili, and lemon.",
    "region": "levant",
    "mealType": [
      "snack",
      "lunch",
      "dinner"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 30,
    "servings": 4,
    "difficulty": "easy",
    "isRamadanSpecial": false,
    "tags": [
      "لبناني",
      "مقبلات",
      "بطاطا",
      "نباتي"
    ],
    "image": "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "البطاطا الحرة طبق مزّة لبناني يجمع القرمشة مع نكهة الثوم والكزبرة والليمون.",
    "storyEn": "Batata harra is a Lebanese mezze favorite balancing crisp potatoes with garlic, cilantro, chili, and lemon.",
    "ingredients": [
      {
        "id": "lbh1",
        "nameAr": "بطاطا",
        "nameEn": "Potatoes",
        "amount": 900,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "lbh2",
        "nameAr": "ثوم",
        "nameEn": "Garlic",
        "amount": 5,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "lbh3",
        "nameAr": "كزبرة خضراء",
        "nameEn": "Fresh cilantro",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "produce"
      },
      {
        "id": "lbh4",
        "nameAr": "فلفل أحمر حار",
        "nameEn": "Red chili",
        "amount": 1,
        "unitAr": "حبة",
        "unitEn": "pc",
        "aisle": "produce"
      },
      {
        "id": "lbh5",
        "nameAr": "عصير ليمون",
        "nameEn": "Lemon juice",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "produce"
      },
      {
        "id": "lbh6",
        "nameAr": "زيت زيتون",
        "nameEn": "Olive oil",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "قطع البطاطا مكعبات متساوية وجففها جيداً.",
      "حمصها في الفرن مع الزيت والملح حتى تصبح ذهبية ومقرمشة.",
      "شوح الثوم والفلفل والكزبرة سريعاً في مقلاة واسعة.",
      "أضف البطاطا وعصير الليمون وقلبها ثم قدمها فوراً."
    ],
    "instructionsEn": [
      "Cut potatoes into even cubes and dry thoroughly.",
      "Roast with oil and salt until golden and crisp.",
      "Briefly sauté garlic, chili, and cilantro in a wide pan.",
      "Toss in potatoes and lemon juice, then serve immediately."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "تحمير البطاطا",
        "titleEn": "Roast potatoes",
        "durationMinutes": 25
      }
    ],
    "votesCount": {
      "likes": 215,
      "dislikes": 3
    },
    "rating": 4.87
  },
  {
    "id": "palestine-maqluba",
    "titleAr": "المقلوبة الفلسطينية بالدجاج والباذنجان",
    "titleEn": "Palestinian Chicken & Eggplant Maqluba",
    "descriptionAr": "قدر أرز ودجاج وباذنجان وقرنبيط يقلب كاملاً عند التقديم ليظهر كقالب احتفالي مكسو بالمكسرات.",
    "descriptionEn": "A layered pot of rice, chicken, and fried eggplant inverted into a stunning festive table masterpiece.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 35,
    "cookTimeMinutes": 60,
    "servings": 7,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "فلسطيني",
      "مقلوبة",
      "أرز",
      "عزائم"
    ],
    "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تنتشر المقلوبة في فلسطين وبلاد الشام، ويشكل قلب القدر لحظة جماعية مميزة على المائدة.",
    "storyEn": "Maqluba is widespread in Palestine and the Levant, with the dramatic inversion of the pot forming a shared table ritual.",
    "ingredients": [
      {
        "id": "pm1",
        "nameAr": "دجاج مقطع",
        "nameEn": "Chicken pieces",
        "amount": 1.2,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "pm2",
        "nameAr": "أرز بسمتي",
        "nameEn": "Basmati rice",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "pm3",
        "nameAr": "باذنجان",
        "nameEn": "Eggplants",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "pm4",
        "nameAr": "قرنبيط",
        "nameEn": "Cauliflower",
        "amount": 1,
        "unitAr": "حبة صغيرة",
        "unitEn": "small head",
        "aisle": "produce"
      },
      {
        "id": "pm5",
        "nameAr": "مرق دجاج",
        "nameEn": "Chicken stock",
        "amount": 5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "pm6",
        "nameAr": "بهار مشكل وقرفة",
        "nameEn": "Seven spice and cinnamon",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اسلق الدجاج نصف سلق في ماء متبل واحتفظ بالمرق.",
      "حمّر شرائح الباذنجان وزهرات القرنبيط في الفرن أو بقليل من الزيت.",
      "رتب الدجاج والخضار ثم الأرز المنقوع في قدر عميق واسكب المرق بحذر.",
      "اطه حتى ينضج الأرز، أرح القدر 15 دقيقة ثم اقلبه على طبق واسع."
    ],
    "instructionsEn": [
      "Partially simmer chicken in seasoned water and reserve the stock.",
      "Brown eggplant slices and cauliflower florets in the oven or a little oil.",
      "Layer chicken, vegetables, then soaked rice in a deep pot; carefully add stock.",
      "Cook until rice is tender, rest 15 minutes, then invert onto a wide platter."
    ],
    "timerSteps": [
      {
        "stepIndex": 3,
        "titleAr": "طهي المقلوبة",
        "titleEn": "Cook maqluba",
        "durationMinutes": 35
      },
      {
        "stepIndex": 3,
        "titleAr": "راحة قبل القلب",
        "titleEn": "Rest before inverting",
        "durationMinutes": 15
      }
    ],
    "votesCount": {
      "likes": 310,
      "dislikes": 6
    },
    "rating": 4.93
  },
  {
    "id": "jordan-zarb",
    "titleAr": "الزرب الأردني البدوي",
    "titleEn": "Jordanian Bedouin Zarb Roast",
    "descriptionAr": "لحم وخضار مطهوة ببطء بنكهة مدخنة زكية؛ هذه النسخة تحاكي طهي الحفرة البدوية.",
    "descriptionEn": "Slow-roasted tender lamb and root vegetables infused with rich natural smoke.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "prepTimeMinutes": 30,
    "cookTimeMinutes": 150,
    "servings": 8,
    "difficulty": "hard",
    "isRamadanSpecial": false,
    "tags": [
      "أردني",
      "بدوي",
      "لحم",
      "مدخن"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Cooked_zarb_01.png",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Cooked_zarb_01.png"
    ],
    "storyAr": "يصف مجلس السياحة الأردني الزرب كطبق بدوي من اللحم أو الدجاج يطهى في حفرة مبطنة بالطوب لاكتساب النكهة المدخنة.",
    "storyEn": "The Jordan Tourism Board describes zarb as a Bedouin meat dish cooked in a brick-lined underground pit for its smoky character.",
    "ingredients": [
      {
        "id": "jz1",
        "nameAr": "كتف ضأن",
        "nameEn": "Lamb shoulder",
        "amount": 2,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "jz2",
        "nameAr": "بطاطا",
        "nameEn": "Potatoes",
        "amount": 700,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "jz3",
        "nameAr": "جزر",
        "nameEn": "Carrots",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "jz4",
        "nameAr": "بصل",
        "nameEn": "Onions",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "jz5",
        "nameAr": "بهار عربي وهيل",
        "nameEn": "Arabic spice and cardamom",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "jz6",
        "nameAr": "رقائق خشب تدخين غذائية",
        "nameEn": "Food-safe smoking wood chips",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "other"
      }
    ],
    "instructionsAr": [
      "تبّل كتف الضأن بالملح والبهارات واتركه مبرداً ساعة.",
      "ضع اللحم فوق شبكة داخل قدر شواء أو فرن تدخين منزلي وضع الخضار أسفله.",
      "اطهه مغطى على حرارة منخفضة حتى يطرى اللحم وتصل حرارته الداخلية إلى درجة آمنة.",
      "أضف تدخيناً خفيفاً برقائق مخصصة للطعام وفق تعليمات جهازك ثم أرح اللحم وقطعه."
    ],
    "instructionsEn": [
      "Season lamb with salt and spices and refrigerate for one hour.",
      "Place it on a rack in a covered roaster or home smoker with vegetables below.",
      "Cook low and slow until tender and a safe internal temperature is reached.",
      "Apply light smoke using food-safe chips according to your equipment, then rest and carve."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "الطهي البطيء",
        "titleEn": "Slow cook",
        "durationMinutes": 135
      },
      {
        "stepIndex": 3,
        "titleAr": "راحة اللحم",
        "titleEn": "Rest lamb",
        "durationMinutes": 15
      }
    ],
    "votesCount": {
      "likes": 210,
      "dislikes": 4
    },
    "rating": 4.89
  },
  {
    "id": "syria-shishbarak",
    "titleAr": "الشيش برك الشامي باللبن المطبوخ",
    "titleEn": "Levantine Shish Barak Yogurt Dumplings",
    "descriptionAr": "عجائن صغيرة محشوة باللحم المفروم والبهارات، مطهوة في صلصة اللبن الدافئة بالثوم والكزبرة.",
    "descriptionEn": "Tiny meat-filled dumplings simmered in a silky, warm garlicky cilantro yogurt sauce.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 60,
    "cookTimeMinutes": 35,
    "servings": 6,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "شامي",
      "لبن",
      "عجين",
      "لحم"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Shish_barak.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Shish_barak.jpg"
    ],
    "storyAr": "الشيش برك من أطباق اللبن المطبوخ المعروفة في سوريا ولبنان، ويحتاج تشكيل حباته الصغيرة إلى صبر ولطف.",
    "storyEn": "Shish barak is a cooked-yogurt dish known in Syria and Lebanon; shaping its tiny dumplings is traditionally patient work.",
    "ingredients": [
      {
        "id": "ss1",
        "nameAr": "دقيق",
        "nameEn": "Flour",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "ss2",
        "nameAr": "لحم مفروم",
        "nameEn": "Minced meat",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "ss3",
        "nameAr": "بصل مفروم",
        "nameEn": "Chopped onion",
        "amount": 1,
        "unitAr": "حبة",
        "unitEn": "pc",
        "aisle": "produce"
      },
      {
        "id": "ss4",
        "nameAr": "لبن زبادي كامل الدسم",
        "nameEn": "Full-fat yogurt",
        "amount": 1.5,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "dairy"
      },
      {
        "id": "ss5",
        "nameAr": "نشا",
        "nameEn": "Cornstarch",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "ss6",
        "nameAr": "ثوم وكزبرة",
        "nameEn": "Garlic and cilantro",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "produce"
      }
    ],
    "instructionsAr": [
      "اعجن الدقيق بالماء والملح واترك العجين يرتاح.",
      "حمّر اللحم مع البصل، ثم افرد العجين واحشه واطوه على شكل قبعات صغيرة.",
      "اخبز الحبات عشر دقائق لتتماسك، واخفق اللبن مع النشا على نار هادئة حتى يغلي.",
      "أضف الحبات إلى اللبن ثم طشة الثوم والكزبرة واتركها تنضج برفق."
    ],
    "instructionsEn": [
      "Knead flour with water and salt, then rest the dough.",
      "Brown meat with onion; roll dough, fill, and fold into tiny hat shapes.",
      "Bake dumplings briefly to set; whisk yogurt with cornstarch over low heat to a simmer.",
      "Add dumplings, then sautéed garlic and cilantro, and cook gently."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "خبز الحبات",
        "titleEn": "Set dumplings",
        "durationMinutes": 10
      },
      {
        "stepIndex": 3,
        "titleAr": "الطهي في اللبن",
        "titleEn": "Cook in yogurt",
        "durationMinutes": 15
      }
    ],
    "votesCount": {
      "likes": 250,
      "dislikes": 5
    },
    "rating": 4.9
  },
  {
    "id": "lebanon-warak-enab",
    "titleAr": "ورق عنب لبناني بالزيت (يلنجي)",
    "titleEn": "Lebanese Olive-Oil Stuffed Grape Leaves",
    "descriptionAr": "ورق عنب محشو بالأرز والطماطم والأعشاب ومطهو بزيت الزيتون والليمون الحامض.",
    "descriptionEn": "Tender grape leaves rolled with herbaceous tomato rice, slow-braised with lemon juice and extra virgin olive oil.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "snack"
    ],
    "prepTimeMinutes": 50,
    "cookTimeMinutes": 55,
    "servings": 8,
    "difficulty": "hard",
    "isRamadanSpecial": false,
    "tags": [
      "لبناني",
      "ورق عنب",
      "نباتي",
      "مزة"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Mahshi.JPG",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Mahshi.JPG"
    ],
    "storyAr": "نسخة الزيت من ورق العنب جزء أساسي من المزة اللبنانية وتقدم غالباً باردة أو بدرجة حرارة الغرفة.",
    "storyEn": "The olive-oil version of stuffed grape leaves is a core Lebanese mezze item, often served cool or at room temperature.",
    "ingredients": [
      {
        "id": "lwe1",
        "nameAr": "ورق عنب",
        "nameEn": "Grape leaves",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "lwe2",
        "nameAr": "أرز قصير الحبة",
        "nameEn": "Short-grain rice",
        "amount": 1.5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "lwe3",
        "nameAr": "طماطم مفرومة",
        "nameEn": "Chopped tomatoes",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "lwe4",
        "nameAr": "بقدونس ونعناع",
        "nameEn": "Parsley and mint",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "produce"
      },
      {
        "id": "lwe5",
        "nameAr": "زيت زيتون",
        "nameEn": "Olive oil",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "lwe6",
        "nameAr": "عصير ليمون",
        "nameEn": "Lemon juice",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "produce"
      }
    ],
    "instructionsAr": [
      "اسلق ورق العنب سريعاً إن كان طازجاً واشطف المحفوظ جيداً.",
      "اخلط الأرز المنقوع بالطماطم والأعشاب ونصف الزيت والليمون.",
      "ضع مقداراً صغيراً من الحشوة في كل ورقة ولفها دون شد زائد.",
      "رص اللفائف بإحكام واسكب الماء وبقية الزيت والليمون ثم اطهها ببطء."
    ],
    "instructionsEn": [
      "Briefly blanch fresh leaves, or thoroughly rinse preserved leaves.",
      "Mix soaked rice with tomato, herbs, half the oil, and lemon.",
      "Place a small amount on each leaf and roll without packing too tightly.",
      "Arrange snugly, add water and remaining oil and lemon, then braise gently."
    ],
    "timerSteps": [
      {
        "stepIndex": 3,
        "titleAr": "طهي ورق العنب",
        "titleEn": "Braise grape leaves",
        "durationMinutes": 50
      }
    ],
    "votesCount": {
      "likes": 270,
      "dislikes": 4
    },
    "rating": 4.92
  },
  {
    "id": "saudi-jareesh",
    "titleAr": "الجريش السعودي التراثي",
    "titleEn": "Saudi Heritage Jareesh Bowl",
    "descriptionAr": "قمح مجروش مطهو ببطء مع اللبن الزبادي والمرق والبصل المكرمل بالسمن.",
    "descriptionEn": "Cracked wheat slowly simmered with cultured dairy, stock, and ghee-caramelized onions.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 100,
    "servings": 7,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "سعودي",
      "نجدي",
      "قمح",
      "تراثي"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Jarish_SaudiCuisine.JPG",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Jarish_SaudiCuisine.JPG"
    ],
    "storyAr": "الجريش طبق سعودي تراثي يعتمد على القمح المجروش والطهي الهادئ، ويرتبط بموائد نجد والمناسبات.",
    "storyEn": "Jareesh is a Saudi heritage dish of cracked wheat and slow cooking, closely associated with Najdi tables and gatherings.",
    "ingredients": [
      {
        "id": "sj1",
        "nameAr": "جريش قمح",
        "nameEn": "Cracked wheat jareesh",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "sj2",
        "nameAr": "مرق دجاج",
        "nameEn": "Chicken stock",
        "amount": 6,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "sj3",
        "nameAr": "لبن زبادي",
        "nameEn": "Yogurt",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "dairy"
      },
      {
        "id": "sj4",
        "nameAr": "بصل",
        "nameEn": "Onions",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "sj5",
        "nameAr": "سمن",
        "nameEn": "Ghee",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "sj6",
        "nameAr": "كمون وفلفل أسود",
        "nameEn": "Cumin and black pepper",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اغسل الجريش وانقعه 30 دقيقة ثم صفه.",
      "شوح بصلة في السمن وأضف الجريش والمرق واتركه يطهى مغطى على نار هادئة.",
      "حركه دورياً حتى يتفكك القمح، ثم أضف اللبن تدريجياً واستمر في الطهي.",
      "كرمل بقية البصل بالسمن والكمون وضعه فوق الجريش عند التقديم."
    ],
    "instructionsEn": [
      "Rinse jareesh, soak for 30 minutes, and drain.",
      "Sauté one onion in ghee; add wheat and stock and cook covered over low heat.",
      "Stir periodically until grains break down, then gradually add yogurt and continue cooking.",
      "Caramelize remaining onions with ghee and cumin and spoon over the jareesh."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي الجريش",
        "titleEn": "Slow-cook jareesh",
        "durationMinutes": 70
      },
      {
        "stepIndex": 2,
        "titleAr": "الطهي مع اللبن",
        "titleEn": "Cook with yogurt",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 205,
      "dislikes": 4
    },
    "rating": 4.88
  },
  {
    "id": "saudi-saleeg",
    "titleAr": "السليق الطائفي بالدجاج المحمر",
    "titleEn": "Taif-Style Saudi Saleeg with Chicken",
    "descriptionAr": "أرز أبيض كريمي بالحليب والمرق والهيل والمستكة، يقدم مع دجاج محمر بالسمن وصلصة الدقوس.",
    "descriptionEn": "Creamy white rice cooked in fragrant broth and milk, served with ghee-browned roasted chicken and tangy daqqous.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 70,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": false,
    "tags": [
      "سعودي",
      "طائفي",
      "أرز",
      "دجاج"
    ],
    "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "ينسب السليق خصوصاً إلى الطائف والحجاز، ويتميز بقوام أرز أبيض ناعم يوازن الدجاج المتبل.",
    "storyEn": "Saleeg is especially associated with Taif and the Hejaz, recognized by its soft white rice contrasting with seasoned chicken.",
    "ingredients": [
      {
        "id": "ss1",
        "nameAr": "دجاجة كاملة",
        "nameEn": "Whole chicken",
        "amount": 1.4,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "ss2",
        "nameAr": "أرز قصير الحبة",
        "nameEn": "Short-grain rice",
        "amount": 2.5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "ss3",
        "nameAr": "حليب",
        "nameEn": "Milk",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "dairy"
      },
      {
        "id": "ss4",
        "nameAr": "مرق دجاج",
        "nameEn": "Chicken stock",
        "amount": 5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "ss5",
        "nameAr": "سمن",
        "nameEn": "Ghee",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "ss6",
        "nameAr": "هيل ومستكة",
        "nameEn": "Cardamom and mastic",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اسلق الدجاج مع الهيل والمستكة والبصل حتى ينضج واحتفظ بالمرق.",
      "حمّر الدجاج في الفرن بعد دهنه بالسمن.",
      "اطه الأرز في المرق حتى يلين جداً، ثم أضف الحليب الساخن تدريجياً.",
      "حرك حتى يصبح القوام كريمياً وقدمه فوراً مع الدجاج والدقوس."
    ],
    "instructionsEn": [
      "Simmer chicken with cardamom, mastic, and onion until cooked; reserve stock.",
      "Brush the chicken with ghee and brown it in the oven.",
      "Cook rice in stock until very soft, then gradually add hot milk.",
      "Stir to a creamy texture and serve immediately with chicken and daqqous."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "سلق الدجاج",
        "titleEn": "Simmer chicken",
        "durationMinutes": 40
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الأرز",
        "titleEn": "Cook saleeg rice",
        "durationMinutes": 30
      }
    ],
    "votesCount": {
      "likes": 240,
      "dislikes": 3
    },
    "rating": 4.9
  },
  {
    "id": "uae-thareed",
    "titleAr": "الثريد الإماراتي باللحم والرقاق",
    "titleEn": "Emirati Lamb & Regag Thareed",
    "descriptionAr": "مرق لحم ضأن وخضروات غني يصب فوق خبز الرقاق ليتشرب النكهات العطرية.",
    "descriptionEn": "A rich spiced lamb and vegetable stew ladled over thin regag flatbread to absorb the savory broth.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 85,
    "servings": 7,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "إماراتي",
      "ثريد",
      "رقاق",
      "رمضان"
    ],
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تصفه هيئة أبوظبي للسياحة كطبق إماراتي مريح بارز في رمضان، ويجمع المرق بالخضار وخبز الرقاق.",
    "storyEn": "Abu Dhabi's tourism authority highlights thareed as an Emirati comfort dish prominent in Ramadan, combining stew, vegetables, and regag bread.",
    "ingredients": [
      {
        "id": "ut1",
        "nameAr": "لحم ضأن بالعظم",
        "nameEn": "Bone-in lamb",
        "amount": 1.2,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "ut2",
        "nameAr": "خبز رقاق",
        "nameEn": "Regag bread",
        "amount": 6,
        "unitAr": "رقائق",
        "unitEn": "sheets",
        "aisle": "bakery"
      },
      {
        "id": "ut3",
        "nameAr": "بطاطا وجزر وكوسا",
        "nameEn": "Potato, carrot, and zucchini",
        "amount": 1.2,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "produce"
      },
      {
        "id": "ut4",
        "nameAr": "طماطم",
        "nameEn": "Tomatoes",
        "amount": 4,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "ut5",
        "nameAr": "بصل وثوم",
        "nameEn": "Onion and garlic",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "ut6",
        "nameAr": "لومي وبهارات خليجية",
        "nameEn": "Dried lime and Gulf spices",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "حمّر اللحم مع البصل ثم أضف الثوم والطماطم والبهارات واللومي.",
      "غط بالماء واترك اللحم ينضج ببطء حتى يقارب الطراوة.",
      "أضف الخضار بالترتيب حسب وقت نضجها واتركها طرية دون أن تتفتت.",
      "قطع خبز الرقاق في طبق عميق واسكب فوقه المرق والخضار ثم ضع اللحم."
    ],
    "instructionsEn": [
      "Brown lamb with onion, then add garlic, tomatoes, spices, and dried lime.",
      "Cover with water and simmer slowly until the lamb is almost tender.",
      "Add vegetables according to cooking time and cook until tender but intact.",
      "Tear regag into a deep platter, ladle over broth and vegetables, and top with lamb."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي اللحم",
        "titleEn": "Simmer lamb",
        "durationMinutes": 55
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الخضار",
        "titleEn": "Cook vegetables",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 230,
      "dislikes": 4
    },
    "rating": 4.89
  },
  {
    "id": "uae-luqaimat",
    "titleAr": "اللقيمات الإماراتية بدبس التمر",
    "titleEn": "Emirati Luqaimat with Date Syrup",
    "descriptionAr": "كرات عجين مقلية مقرمشة من الخارج وهشة من الداخل مع دبس التمر والسمسم.",
    "descriptionEn": "Crisp, airy golden fried dough balls drizzled generously with date syrup and toasted sesame seeds.",
    "region": "gulf",
    "mealType": [
      "dessert",
      "snack",
      "iftar"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 20,
    "servings": 8,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "إماراتي",
      "لقيمات",
      "حلويات",
      "رمضان"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Luqaimat.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Luqaimat.jpg"
    ],
    "storyAr": "اللقيمات حلوى إماراتية محبوبة تقدم في رمضان والمناسبات وتعبر عن المشاركة والكرم.",
    "storyEn": "Luqaimat are a beloved Emirati sweet served during Ramadan and celebrations, associated with sharing and generosity.",
    "ingredients": [
      {
        "id": "ul1",
        "nameAr": "دقيق",
        "nameEn": "Flour",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "ul2",
        "nameAr": "خميرة فورية",
        "nameEn": "Instant yeast",
        "amount": 1.5,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "ul3",
        "nameAr": "نشا",
        "nameEn": "Cornstarch",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "ul4",
        "nameAr": "هيل وزعفران",
        "nameEn": "Cardamom and saffron",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "ul5",
        "nameAr": "زيت للقلي",
        "nameEn": "Oil for frying",
        "amount": 750,
        "unitAr": "مل",
        "unitEn": "ml",
        "aisle": "pantry"
      },
      {
        "id": "ul6",
        "nameAr": "دبس تمر",
        "nameEn": "Date syrup",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اخلط الدقيق والنشا والخميرة والهيل والزعفران ثم أضف ماء دافئاً لتكوين عجين لزج.",
      "غط العجين واتركه يختمر حتى يتضاعف.",
      "أسقط كرات صغيرة في زيت متوسط السخونة واقلها مع التحريك حتى تتحمر بالتساوي.",
      "صف اللقيمات واسكب عليها دبس التمر وقدمها فوراً."
    ],
    "instructionsEn": [
      "Mix flour, cornstarch, yeast, cardamom, and saffron; add warm water for a sticky batter.",
      "Cover and proof until doubled.",
      "Drop small balls into moderately hot oil and turn until evenly golden.",
      "Drain, drizzle with date syrup, and serve immediately."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "تخمير العجين",
        "titleEn": "Proof batter",
        "durationMinutes": 60
      },
      {
        "stepIndex": 2,
        "titleAr": "قلي اللقيمات",
        "titleEn": "Fry luqaimat",
        "durationMinutes": 15
      }
    ],
    "votesCount": {
      "likes": 295,
      "dislikes": 5
    },
    "rating": 4.93
  },
  {
    "id": "qatar-saloona",
    "titleAr": "الصالونة القطرية باللحم والخضار",
    "titleEn": "Qatari Lamb Saloona Stew",
    "descriptionAr": "يخنة طماطم كثيفة باللحم الضأن والخضار المعطرة بالهيل والقرنفل واللومي الأسود.",
    "descriptionEn": "A thick tomato-based lamb and vegetable stew scented with cardamom, clove, and dried black lime.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 75,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "قطري",
      "صالونة",
      "يخنة",
      "لومي"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Maraq.png",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Maraq.png"
    ],
    "storyAr": "تدرج هيئة قطر للسياحة الصالونة بين الأطباق التقليدية المحبوبة وتصفها كيخنة طماطم غنية بالتوابل واللومي.",
    "storyEn": "Qatar Tourism lists saloona among beloved traditional dishes and describes it as a thick tomato stew rich in spice and black lime.",
    "ingredients": [
      {
        "id": "qs1",
        "nameAr": "لحم ضأن مكعبات",
        "nameEn": "Cubed lamb",
        "amount": 900,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "qs2",
        "nameAr": "طماطم مهروسة",
        "nameEn": "Crushed tomatoes",
        "amount": 500,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "qs3",
        "nameAr": "بطاطا وجزر وكوسا",
        "nameEn": "Potato, carrot, and zucchini",
        "amount": 900,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "produce"
      },
      {
        "id": "qs4",
        "nameAr": "بصل وثوم",
        "nameEn": "Onion and garlic",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "qs5",
        "nameAr": "لومي أسود",
        "nameEn": "Black dried lime",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "pantry"
      },
      {
        "id": "qs6",
        "nameAr": "هيل وقرنفل وزنجبيل",
        "nameEn": "Cardamom, clove, and ginger",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "حمّر اللحم مع البصل في قليل من الزيت ثم أضف الثوم والتوابل.",
      "أضف الطماطم واللومي المثقوب والماء واترك اللحم يطهى ببطء.",
      "أضف البطاطا والجزر ثم الكوسا قرب النهاية.",
      "اضبط الملح واترك الصالونة تتكاثف وقدمها مع الأرز أو الخبز."
    ],
    "instructionsEn": [
      "Brown lamb with onion in a little oil, then add garlic and spices.",
      "Add tomatoes, pierced black limes, and water; simmer the meat gently.",
      "Add potato and carrot, followed by zucchini near the end.",
      "Adjust seasoning, reduce to a thick stew, and serve with rice or bread."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي اللحم",
        "titleEn": "Simmer lamb",
        "durationMinutes": 45
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الخضار",
        "titleEn": "Cook vegetables",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 180,
      "dislikes": 3
    },
    "rating": 4.86
  },
  {
    "id": "qatar-balaleet",
    "titleAr": "البلاليط القطرية بالزعفران والبيض",
    "titleEn": "Qatari Saffron Balaleet",
    "descriptionAr": "شعيرية حلوة بالهيل والزعفران وماء الورد تعلوها عجة بيض مالحة بالفرن.",
    "descriptionEn": "Sweet cardamom-saffron vermicelli crowned with a savory, lightly salted egg omelet.",
    "region": "gulf",
    "mealType": [
      "breakfast",
      "dessert"
    ],
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 25,
    "servings": 5,
    "difficulty": "easy",
    "isRamadanSpecial": false,
    "tags": [
      "قطري",
      "بلاليط",
      "فطور",
      "زعفران"
    ],
    "image": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=1000&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=1000&q=80"
    ],
    "storyAr": "تجمع البلاليط الخليجية بين الحلو والمالح؛ وتصفها هيئة قطر للسياحة كشعيرية مع ماء الورد والهيل والزعفران والبيض.",
    "storyEn": "Balaleet combines sweet and savory; Qatar Tourism describes vermicelli flavored with rosewater, cardamom, saffron, and turmeric and topped with egg.",
    "ingredients": [
      {
        "id": "qb1",
        "nameAr": "شعيرية",
        "nameEn": "Vermicelli",
        "amount": 400,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "pantry"
      },
      {
        "id": "qb2",
        "nameAr": "سكر",
        "nameEn": "Sugar",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "qb3",
        "nameAr": "بيض",
        "nameEn": "Eggs",
        "amount": 5,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "dairy"
      },
      {
        "id": "qb4",
        "nameAr": "ماء ورد",
        "nameEn": "Rosewater",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "qb5",
        "nameAr": "هيل وزعفران وكركم",
        "nameEn": "Cardamom, saffron, and turmeric",
        "amount": 1.5,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "qb6",
        "nameAr": "سمن",
        "nameEn": "Ghee",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      }
    ],
    "instructionsAr": [
      "اسلق الشعيرية حتى تلين جزئياً ثم صفها.",
      "قلبها بالسمن والسكر والهيل والزعفران وماء الورد حتى تتشرب النكهات.",
      "اخفق البيض مع الملح واطهه كعجة رقيقة.",
      "ضع الشعيرية في طبق التقديم وغطها بالعجة."
    ],
    "instructionsEn": [
      "Boil vermicelli until partly tender, then drain.",
      "Toss with ghee, sugar, cardamom, saffron, and rosewater until fragrant.",
      "Beat eggs with salt and cook as a thin omelet.",
      "Pile vermicelli onto a platter and top with the omelet."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "سلق الشعيرية",
        "titleEn": "Boil vermicelli",
        "durationMinutes": 6
      },
      {
        "stepIndex": 1,
        "titleAr": "تشريب النكهات",
        "titleEn": "Flavor vermicelli",
        "durationMinutes": 8
      }
    ],
    "votesCount": {
      "likes": 165,
      "dislikes": 3
    },
    "rating": 4.84
  },
  {
    "id": "oman-shuwa",
    "titleAr": "الشواء العُماني بالبهارات والتعتيق",
    "titleEn": "Omani Festive Slow-Roasted Shuwa Lamb",
    "descriptionAr": "لحم ضأن متبل بالبهارات العمانية ومطهو ببطء حتى يذوب؛ نسخة فرن منزلية ممتازة للطبق الاحتفالي.",
    "descriptionEn": "Slow-roasted marinated lamb shoulder baked until melt-in-mouth tender with aromatic Omani spices.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "prepTimeMinutes": 30,
    "cookTimeMinutes": 300,
    "servings": 10,
    "difficulty": "hard",
    "isRamadanSpecial": false,
    "tags": [
      "عُماني",
      "شواء",
      "لحم",
      "أعياد"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Wadi_Rum-Zarb_(2).jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Wadi_Rum-Zarb_(2).jpg"
    ],
    "storyAr": "الشواء العماني طبق مناسبات يطهى تقليدياً لساعات طويلة في تنور أرضي جماعي.",
    "storyEn": "Omani shuwa is a celebration dish traditionally cooked for many hours in a communal underground oven.",
    "ingredients": [
      {
        "id": "os1",
        "nameAr": "كتف ضأن",
        "nameEn": "Lamb shoulder",
        "amount": 3,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "os2",
        "nameAr": "خل",
        "nameEn": "Vinegar",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "os3",
        "nameAr": "ثوم",
        "nameEn": "Garlic",
        "amount": 12,
        "unitAr": "فص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "os4",
        "nameAr": "كزبرة وكمون وهيل",
        "nameEn": "Coriander, cumin, and cardamom",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "os5",
        "nameAr": "فلفل أحمر وكركم",
        "nameEn": "Chili and turmeric",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "os6",
        "nameAr": "أوراق موز أو ورق خبز وقصدير",
        "nameEn": "Banana leaf or parchment and foil",
        "amount": 1,
        "unitAr": "عبوة",
        "unitEn": "pack",
        "aisle": "other"
      }
    ],
    "instructionsAr": [
      "اخلط الخل والثوم والبهارات وادعك بها اللحم ثم انقعه مبرداً طوال الليل.",
      "لف اللحم بورق موز أو ورق خبز ثم بطبقتين من القصدير وضعه في صينية.",
      "اخبزه على حرارة منخفضة ساعات عدة حتى يصبح شديد الطراوة ويصل لحرارة آمنة.",
      "افتح اللفافة بحذر وحمّر السطح سريعاً ثم أرح اللحم قبل التقطيع."
    ],
    "instructionsEn": [
      "Blend vinegar, garlic, and spices; rub over lamb and marinate refrigerated overnight.",
      "Wrap in banana leaf or parchment, then two foil layers, and place in a roasting pan.",
      "Bake at low heat for several hours until very tender and safely cooked.",
      "Open carefully, brown the surface briefly, then rest before carving."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "الطهي البطيء",
        "titleEn": "Slow roast",
        "durationMinutes": 270
      },
      {
        "stepIndex": 3,
        "titleAr": "راحة اللحم",
        "titleEn": "Rest meat",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 210,
      "dislikes": 4
    },
    "rating": 4.88
  },
  {
    "id": "kuwait-mutabbaq-samak",
    "titleAr": "مطبق سمك كويتي بالأرز البسمتي المعطر",
    "titleEn": "Kuwaiti Mutabbaq Samak Fish & Rice",
    "descriptionAr": "سمك متبل ومقلي يقدم فوق أرز بسمتي مع بصل محمر ولومي وبهارات خليجية.",
    "descriptionEn": "Crisp pan-seared fish served over fragrant basmati rice with browned onions, dried lime, and Gulf spices.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 45,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": false,
    "tags": [
      "كويتي",
      "سمك",
      "أرز",
      "لومي"
    ],
    "image": "https://ik.imagekit.io/hrim/images/wajba/Kuwaiti_Fish.jpg",
    "galleryImages": [
      "https://ik.imagekit.io/hrim/images/wajba/Kuwaiti_Fish.jpg"
    ],
    "storyAr": "مطبق السمك من أطباق الساحل الكويتي التي تجمع صيد الخليج بالأرز والبصل واللومي.",
    "storyEn": "Mutabbaq samak reflects Kuwait's Gulf coast, bringing local fish together with rice, onions, and dried lime.",
    "ingredients": [
      {
        "id": "kms1",
        "nameAr": "سمك زبيدي أو سمك أبيض",
        "nameEn": "Pomfret or firm white fish",
        "amount": 1.5,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "kms2",
        "nameAr": "أرز بسمتي",
        "nameEn": "Basmati rice",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "kms3",
        "nameAr": "بصل",
        "nameEn": "Onions",
        "amount": 4,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "kms4",
        "nameAr": "لومي",
        "nameEn": "Dried limes",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "pantry"
      },
      {
        "id": "kms5",
        "nameAr": "كركم وكزبرة وكمون",
        "nameEn": "Turmeric, coriander, and cumin",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "kms6",
        "nameAr": "دقيق",
        "nameEn": "Flour",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "تبّل السمك بالملح والبهارات واتركه 20 دقيقة ثم غلفه بطبقة خفيفة من الدقيق.",
      "اقله أو اخبزه حتى ينضج ويتحمر ثم احتفظ به دافئاً.",
      "حمّر البصل وأضف الأرز واللومي والبهارات وماءً مناسباً واطهه مغطى.",
      "قدم الأرز في طبق واسع وضع السمك فوقه وزينه بالبصل المحمر."
    ],
    "instructionsEn": [
      "Season fish with salt and spices for 20 minutes, then dust lightly with flour.",
      "Pan-fry or bake until browned and safely cooked; keep warm.",
      "Brown onions, add rice, dried lime, spices, and measured water, and cook covered.",
      "Spread rice on a platter, place fish on top, and garnish with browned onion."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "تتبيل السمك",
        "titleEn": "Season fish",
        "durationMinutes": 20
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الأرز",
        "titleEn": "Cook rice",
        "durationMinutes": 22
      }
    ],
    "votesCount": {
      "likes": 195,
      "dislikes": 3
    },
    "rating": 4.87
  },
  {
    "id": "maghreb-moroccan-harira",
    "titleAr": "الحريرة المغربية",
    "titleEn": "Moroccan Harira",
    "descriptionAr": "شوربة مغربية غنية بالطماطم والعدس والحمص والأعشاب وتقدم كثيراً في رمضان.",
    "descriptionEn": "A nourishing Moroccan soup of tomatoes, lentils, chickpeas, herbs, and fine vermicelli, often served during Ramadan.",
    "region": "maghreb",
    "mealType": [
      "dinner",
      "iftar",
      "suhoor"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 55,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مغربي",
      "شوربة",
      "رمضان",
      "عدس"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Harira",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Harira"
    ],
    "storyAr": "الحريرة جزء أساسي من مائدة الإفطار المغربية، وتجمع بين البقول والطماطم والأعشاب في طبق دافئ مشبع.",
    "storyEn": "Harira is central to Moroccan iftar tables, bringing legumes, tomatoes, and herbs together in a warming, filling bowl.",
    "ingredients": [
      {
        "id": "mmh1",
        "nameAr": "عدس بني",
        "nameEn": "Brown lentils",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "mmh2",
        "nameAr": "حمص مسلوق",
        "nameEn": "Cooked chickpeas",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "mmh3",
        "nameAr": "طماطم مبشورة",
        "nameEn": "Grated tomatoes",
        "amount": 4,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "mmh4",
        "nameAr": "كرفس وكزبرة",
        "nameEn": "Celery and cilantro",
        "amount": 1,
        "unitAr": "حزمة",
        "unitEn": "bunch",
        "aisle": "produce"
      },
      {
        "id": "mmh5",
        "nameAr": "شعيرية رفيعة",
        "nameEn": "Fine vermicelli",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "mmh6",
        "nameAr": "دقيق",
        "nameEn": "Flour",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "شوح الكرفس والبصل والطماطم مع العدس والبهارات ثم أضف الماء واترك الخليط يغلي.",
      "أضف الحمص واترك الشوربة على نار هادئة حتى يطرى العدس وتتداخل النكهات.",
      "أضف الشعيرية واطهها حتى تلين.",
      "اخلط الدقيق بالماء البارد وأضفه تدريجياً مع التقليب حتى تتماسك الشوربة ثم أضف الكزبرة."
    ],
    "instructionsEn": [
      "Sauté celery, onion, and tomatoes with lentils and spices, then add water and bring to a boil.",
      "Add chickpeas and simmer until the lentils are tender and the flavors meld.",
      "Add vermicelli and cook until tender.",
      "Whisk flour with cold water, add gradually while stirring to thicken, then finish with cilantro."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي العدس",
        "titleEn": "Cook lentils",
        "durationMinutes": 40
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الشعيرية",
        "titleEn": "Cook vermicelli",
        "durationMinutes": 8
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "maghreb-chicken-tagine-olives",
    "titleAr": "طاجن الدجاج بالزيتون والليمون المصير",
    "titleEn": "Moroccan Chicken Tagine with Olives and Preserved Lemon",
    "descriptionAr": "دجاج مطهو ببطء مع البصل والزيتون والليمون المصير وبهارات مغربية عطرية.",
    "descriptionEn": "Slow-cooked chicken with onions, olives, preserved lemon, and fragrant Moroccan spices.",
    "region": "maghreb",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 75,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مغربي",
      "طاجن",
      "دجاج",
      "زيتون"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Chicken%20Tagine%20with%20Olives%20and%20Preserved%20Lemon",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Chicken%20Tagine%20with%20Olives%20and%20Preserved%20Lemon"
    ],
    "storyAr": "يُطهى الطاجن المغربي ببطء في وعاء يحافظ على البخار، وتمنح مكونات مثل الليمون المصير والزيتون الطبق نكهته المميزة.",
    "storyEn": "Moroccan tagine is gently steamed in a domed vessel, with preserved lemon and olives giving this version its signature character.",
    "ingredients": [
      {
        "id": "mcto1",
        "nameAr": "أفخاذ دجاج",
        "nameEn": "Chicken thighs",
        "amount": 1.2,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "mcto2",
        "nameAr": "بصل مفروم",
        "nameEn": "Chopped onions",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "mcto3",
        "nameAr": "ليمون مصير",
        "nameEn": "Preserved lemon",
        "amount": 1,
        "unitAr": "حبة",
        "unitEn": "pc",
        "aisle": "produce"
      },
      {
        "id": "mcto4",
        "nameAr": "زيتون أخضر منزوع النوى",
        "nameEn": "Pitted green olives",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "mcto5",
        "nameAr": "زنجبيل وكركم وفلفل",
        "nameEn": "Ginger, turmeric, and pepper",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "mcto6",
        "nameAr": "زيت زيتون",
        "nameEn": "Olive oil",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "تبّل الدجاج بالزنجبيل والكركم والفلفل والملح.",
      "شوح البصل في زيت الزيتون ثم أضف الدجاج وحمره من الجانبين.",
      "أضف ماءً قليلاً وغط الوعاء واطه الدجاج على نار هادئة حتى ينضج.",
      "أضف الليمون المصير والزيتون في النهاية واترك الصلصة تتكاثف قبل التقديم."
    ],
    "instructionsEn": [
      "Season chicken with ginger, turmeric, pepper, and salt.",
      "Sauté onions in olive oil, add chicken, and brown both sides.",
      "Add a little water, cover, and simmer gently until the chicken is cooked through.",
      "Add preserved lemon and olives near the end and reduce the sauce before serving."
    ],
    "timerSteps": [
      {
        "stepIndex": 2,
        "titleAr": "طهي الدجاج",
        "titleEn": "Simmer chicken",
        "durationMinutes": 55
      },
      {
        "stepIndex": 3,
        "titleAr": "تكثيف الصلصة",
        "titleEn": "Reduce sauce",
        "durationMinutes": 10
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "maghreb-couscous-seven-vegetables",
    "titleAr": "كسكس مغربي بسبع خضروات",
    "titleEn": "Moroccan Couscous with Seven Vegetables",
    "descriptionAr": "كسكس مفلفل يقدم مع مرق غني بسبع خضروات وحمص وتوابل دافئة.",
    "descriptionEn": "Fluffy couscous served with a rich broth of seven vegetables, chickpeas, and warm spices.",
    "region": "maghreb",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 30,
    "cookTimeMinutes": 70,
    "servings": 8,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مغربي",
      "كسكس",
      "خضروات",
      "نباتي"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Couscous%20with%20Seven%20Vegetables",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Couscous%20with%20Seven%20Vegetables"
    ],
    "storyAr": "الكسكس طبق جماعي يرتبط بالاجتماع والمشاركة، وتختلف الخضروات المصاحبة له حسب الموسم والمنطقة.",
    "storyEn": "Couscous is a communal dish associated with sharing, while the vegetables in its broth change with season and region.",
    "ingredients": [
      {
        "id": "mcsv1",
        "nameAr": "كسكس متوسط",
        "nameEn": "Medium couscous",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "mcsv2",
        "nameAr": "حمص مسلوق",
        "nameEn": "Cooked chickpeas",
        "amount": 1.5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "mcsv3",
        "nameAr": "جزر",
        "nameEn": "Carrots",
        "amount": 4,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "mcsv4",
        "nameAr": "كوسا وقرع ولفت",
        "nameEn": "Zucchini, pumpkin, and turnips",
        "amount": 1,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "produce"
      },
      {
        "id": "mcsv5",
        "nameAr": "ملفوف أبيض",
        "nameEn": "White cabbage",
        "amount": 0.5,
        "unitAr": "رأس",
        "unitEn": "head",
        "aisle": "produce"
      },
      {
        "id": "mcsv6",
        "nameAr": "طماطم وبصل",
        "nameEn": "Tomatoes and onion",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "mcsv7",
        "nameAr": "زيت زيتون وتوابل",
        "nameEn": "Olive oil and spices",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "شوح البصل والطماطم مع التوابل ثم أضف الماء والحمص واترك المرق يغلي.",
      "أضف الخضروات القاسية أولاً ثم الكوسا والقرع والملفوف حتى تنضج دون أن تهترئ.",
      "رطب الكسكس بقليل من الماء والزيت ثم بخّره حتى ينتفخ وافركه بالشوكة.",
      "ضع الكسكس في طبق واسع واسكب المرق ورتب الخضروات والحمص فوقه."
    ],
    "instructionsEn": [
      "Sauté onion and tomatoes with spices, add water and chickpeas, and bring the broth to a boil.",
      "Add firm vegetables first, then zucchini, pumpkin, and cabbage so they cook without collapsing.",
      "Moisten couscous with a little water and oil, steam until fluffy, and separate with a fork.",
      "Spread couscous on a platter, ladle over broth, and arrange vegetables and chickpeas on top."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي الخضروات",
        "titleEn": "Cook vegetables",
        "durationMinutes": 45
      },
      {
        "stepIndex": 2,
        "titleAr": "تبخير الكسكس",
        "titleEn": "Steam couscous",
        "durationMinutes": 20
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "maghreb-rfissa-chicken",
    "titleAr": "الرفيسة المغربية بالدجاج والعدس",
    "titleEn": "Moroccan Chicken Rfissa",
    "descriptionAr": "دجاج متبل يقدم فوق رقائق المسمن مع مرق البصل والعدس والحلبة.",
    "descriptionEn": "Spiced chicken served over shredded msemen with an onion, lentil, and fenugreek broth.",
    "region": "maghreb",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 35,
    "cookTimeMinutes": 80,
    "servings": 6,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "مغربي",
      "رفيسة",
      "دجاج",
      "عدس"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Chicken%20Rfissa",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Chicken%20Rfissa"
    ],
    "storyAr": "الرفيسة طبق ضيافة مغربي يحتفي بالمسمن والمرق المعطر ويقدم في المناسبات العائلية.",
    "storyEn": "Rfissa is a Moroccan hospitality dish built around msemen, fragrant broth, and chicken for family occasions.",
    "ingredients": [
      {
        "id": "mrc1",
        "nameAr": "دجاجة مقطعة",
        "nameEn": "Jointed chicken",
        "amount": 1.5,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "mrc2",
        "nameAr": "مسمن مقطع شرائح",
        "nameEn": "Shredded msemen",
        "amount": 6,
        "unitAr": "قطع",
        "unitEn": "pieces",
        "aisle": "bakery"
      },
      {
        "id": "mrc3",
        "nameAr": "بصل",
        "nameEn": "Onions",
        "amount": 5,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "mrc4",
        "nameAr": "عدس بني",
        "nameEn": "Brown lentils",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "mrc5",
        "nameAr": "حلبة",
        "nameEn": "Fenugreek",
        "amount": 1,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "mrc6",
        "nameAr": "رأس الحانوت وزنجبيل",
        "nameEn": "Ras el hanout and ginger",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "تبّل الدجاج بالبهارات والملح ثم حمره قليلاً في قدر واسع.",
      "أضف البصل والحلبة والعدس والماء واطه المزيج حتى ينضج الدجاج والعدس.",
      "سخن شرائح المسمن سريعاً حتى تلين دون أن تجف.",
      "فتت المسمن في طبق عميق واسكب المرق فوقه وضع الدجاج في الوسط."
    ],
    "instructionsEn": [
      "Season chicken with spices and salt, then brown it lightly in a wide pot.",
      "Add onions, fenugreek, lentils, and water; cook until the chicken and lentils are tender.",
      "Warm shredded msemen briefly so it softens without drying.",
      "Pile msemen in a deep platter, ladle over broth, and place chicken in the center."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي الدجاج والعدس",
        "titleEn": "Cook chicken and lentils",
        "durationMinutes": 65
      },
      {
        "stepIndex": 2,
        "titleAr": "تسخين المسمن",
        "titleEn": "Warm msemen",
        "durationMinutes": 5
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "maghreb-chicken-pastilla",
    "titleAr": "البسطيلة المغربية بالدجاج واللوز",
    "titleEn": "Moroccan Chicken Pastilla",
    "descriptionAr": "فطيرة احتفالية بطبقات رقيقة محشوة بالدجاج والبيض واللوز والقرفة.",
    "descriptionEn": "A festive flaky pastry layered with chicken, eggs, almonds, and cinnamon.",
    "region": "maghreb",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 45,
    "cookTimeMinutes": 55,
    "servings": 8,
    "difficulty": "hard",
    "isRamadanSpecial": true,
    "tags": [
      "مغربي",
      "بسطيلة",
      "دجاج",
      "لوز"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Chicken%20Pastilla",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Chicken%20Pastilla"
    ],
    "storyAr": "البسطيلة من أطباق المناسبات المغربية، وتمزج بين الحشوة المتبلة والقشرة المقرمشة واللمسة الحلوة.",
    "storyEn": "Pastilla is a Moroccan celebration pastry balancing a savory spiced filling, crisp layers, and a gentle sweet finish.",
    "ingredients": [
      {
        "id": "mcp1",
        "nameAr": "صدور دجاج",
        "nameEn": "Chicken breasts",
        "amount": 1,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "mcp2",
        "nameAr": "رقائق ورق البسطيلة",
        "nameEn": "Warqa or phyllo sheets",
        "amount": 12,
        "unitAr": "ورقة",
        "unitEn": "sheets",
        "aisle": "frozen"
      },
      {
        "id": "mcp3",
        "nameAr": "بيض",
        "nameEn": "Eggs",
        "amount": 6,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "dairy"
      },
      {
        "id": "mcp4",
        "nameAr": "لوز محمص مطحون",
        "nameEn": "Ground toasted almonds",
        "amount": 1.5,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "mcp5",
        "nameAr": "بصل",
        "nameEn": "Onions",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "mcp6",
        "nameAr": "قرفة وزنجبيل",
        "nameEn": "Cinnamon and ginger",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اطه الدجاج مع البصل والبهارات وماء قليل ثم فتته واحتفظ بالمرق.",
      "اختزل المرق وأضف البيض المخفوق مع التحريك حتى تتكون حشوة ناعمة.",
      "ادهن الرقائق بالزبدة ورتبها في قالب ثم أضف الدجاج وحشوة البيض واللوز على طبقات.",
      "أغلق الفطيرة واخبزها حتى تصبح ذهبية ثم رشها بالسكر البودرة والقرفة."
    ],
    "instructionsEn": [
      "Cook chicken with onions, spices, and a little water, then shred it and reserve the broth.",
      "Reduce the broth and stir in beaten eggs until a soft filling forms.",
      "Brush pastry sheets with butter, layer them in a pan, and add chicken, egg filling, and almonds.",
      "Seal the pastry and bake until golden, then dust with powdered sugar and cinnamon."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "طهي الدجاج",
        "titleEn": "Cook chicken",
        "durationMinutes": 35
      },
      {
        "stepIndex": 3,
        "titleAr": "خبز البسطيلة",
        "titleEn": "Bake pastilla",
        "durationMinutes": 35
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "maghreb-zaalouk",
    "titleAr": "الزعلوك المغربي",
    "titleEn": "Moroccan Zaalouk",
    "descriptionAr": "سلطة دافئة من الباذنجان والطماطم والثوم والكمون تقدم مع الخبز.",
    "descriptionEn": "A warm eggplant and tomato salad with garlic and cumin, served with bread.",
    "region": "maghreb",
    "mealType": [
      "breakfast",
      "snack",
      "iftar"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 35,
    "servings": 4,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مغربي",
      "باذنجان",
      "سلطة",
      "نباتي"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Zaalouk",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Zaalouk"
    ],
    "storyAr": "الزعلوك من المقبلات المغربية المنزلية التي تقدم دافئة أو بدرجة حرارة الغرفة مع الخبز.",
    "storyEn": "Zaalouk is a Moroccan home-style accompaniment served warm or at room temperature with bread.",
    "ingredients": [
      {
        "id": "mz1",
        "nameAr": "باذنجان",
        "nameEn": "Eggplant",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "mz2",
        "nameAr": "طماطم",
        "nameEn": "Tomatoes",
        "amount": 4,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "mz3",
        "nameAr": "ثوم",
        "nameEn": "Garlic",
        "amount": 4,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "mz4",
        "nameAr": "كزبرة مفرومة",
        "nameEn": "Chopped cilantro",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "produce"
      },
      {
        "id": "mz5",
        "nameAr": "كمون وبابريكا",
        "nameEn": "Cumin and paprika",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "mz6",
        "nameAr": "زيت زيتون",
        "nameEn": "Olive oil",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اشوِ الباذنجان أو اسلقه حتى يطرى ثم قشره وقطعه.",
      "شوح الثوم والطماطم مع الزيت والكمون والبابريكا.",
      "أضف الباذنجان واهرِسه برفق واطه الخليط حتى يتبخر الماء.",
      "أضف الكزبرة والليمون وقدمه مع الخبز."
    ],
    "instructionsEn": [
      "Roast or simmer eggplant until tender, then peel and chop it.",
      "Sauté garlic and tomatoes with oil, cumin, and paprika.",
      "Add eggplant, mash gently, and cook until excess moisture evaporates.",
      "Finish with cilantro and lemon and serve with bread."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "تطرية الباذنجان",
        "titleEn": "Tenderize eggplant",
        "durationMinutes": 20
      },
      {
        "stepIndex": 2,
        "titleAr": "اختزال السلطة",
        "titleEn": "Reduce salad",
        "durationMinutes": 12
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "maghreb-msemen",
    "titleAr": "المسمن المغربي",
    "titleEn": "Moroccan Msemen",
    "descriptionAr": "خبز مغربي مربع مورق يقدم مع العسل أو الجبن في الفطور والشاي.",
    "descriptionEn": "Layered Moroccan square flatbread served with honey or cheese at breakfast and tea time.",
    "region": "maghreb",
    "mealType": [
      "breakfast",
      "snack",
      "suhoor"
    ],
    "prepTimeMinutes": 40,
    "cookTimeMinutes": 20,
    "servings": 8,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "مغربي",
      "خبز",
      "فطور",
      "عجين"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Msemen",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Msemen"
    ],
    "storyAr": "المسمن حاضر في الفطور المغربي ووقت الشاي، وتظهر طبقاته من فرد العجين الرقيق وطيه بالزيت.",
    "storyEn": "Msemen is a Moroccan breakfast and tea-time staple whose layers come from stretching and folding oiled dough.",
    "ingredients": [
      {
        "id": "mm1",
        "nameAr": "دقيق",
        "nameEn": "Flour",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "mm2",
        "nameAr": "سميد ناعم",
        "nameEn": "Fine semolina",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "mm3",
        "nameAr": "ماء فاتر",
        "nameEn": "Lukewarm water",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "other"
      },
      {
        "id": "mm4",
        "nameAr": "ملح وسكر",
        "nameEn": "Salt and sugar",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "mm5",
        "nameAr": "زيت نباتي",
        "nameEn": "Vegetable oil",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "mm6",
        "nameAr": "زبدة مذابة",
        "nameEn": "Melted butter",
        "amount": 100,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      }
    ],
    "instructionsAr": [
      "اعجن الدقيق والسميد والملح والسكر بالماء حتى تصبح العجينة لينة ثم أرحها.",
      "قسم العجين كرات وادهنها بالزيت ثم افردها رقيقة جداً.",
      "ادهن بالزبدة ورش السميد واطوِ الأطراف إلى مربع.",
      "افرد المربع قليلاً وحمره على صاج ساخن من الجانبين حتى يصبح مورقاً."
    ],
    "instructionsEn": [
      "Knead flour, semolina, salt, and sugar with water until soft, then rest the dough.",
      "Divide into balls, oil them, and stretch each one very thin.",
      "Brush with butter, sprinkle with semolina, and fold the edges into a square.",
      "Flatten each square slightly and cook on a hot griddle until layered and golden."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "راحة العجين",
        "titleEn": "Rest dough",
        "durationMinutes": 30
      },
      {
        "stepIndex": 3,
        "titleAr": "طهي المسمن",
        "titleEn": "Cook msemen",
        "durationMinutes": 12
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "maghreb-sellou",
    "titleAr": "السلو المغربي",
    "titleEn": "Moroccan Sellou",
    "descriptionAr": "حلوى مغربية جافة من الدقيق المحمص واللوز والسمسم والعسل تقدم في رمضان.",
    "descriptionEn": "A Moroccan no-bake sweet of toasted flour, almonds, sesame, and honey, popular during Ramadan.",
    "region": "maghreb",
    "mealType": [
      "dessert",
      "snack",
      "suhoor"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 20,
    "servings": 10,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مغربي",
      "حلويات",
      "رمضان",
      "لوز"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Sellou",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Moroccan%20Sellou"
    ],
    "storyAr": "السلو من حلويات رمضان المغربية المركزة، ويقدم في كرات أو طبقات مع الشاي.",
    "storyEn": "Sellou is a concentrated Moroccan Ramadan sweet served in mounds or slices alongside tea.",
    "ingredients": [
      {
        "id": "ms1",
        "nameAr": "دقيق محمص",
        "nameEn": "Toasted flour",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "ms2",
        "nameAr": "لوز محمص مطحون",
        "nameEn": "Ground toasted almonds",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "ms3",
        "nameAr": "سمسم محمص",
        "nameEn": "Toasted sesame",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "ms4",
        "nameAr": "عسل",
        "nameEn": "Honey",
        "amount": 0.75,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "ms5",
        "nameAr": "زبدة مذابة",
        "nameEn": "Melted butter",
        "amount": 150,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "dairy"
      },
      {
        "id": "ms6",
        "nameAr": "يانسون وقرفة",
        "nameEn": "Anise and cinnamon",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "حمص الدقيق على نار هادئة مع التقليب حتى يصبح ذهبياً ثم اتركه يبرد.",
      "اخلط الدقيق مع اللوز والسمسم واليانسون والقرفة.",
      "أضف الزبدة والعسل تدريجياً حتى يتماسك الخليط.",
      "شكله في طبق أو كرات وزينه باللوز واتركه يبرد قبل التقديم."
    ],
    "instructionsEn": [
      "Toast flour over low heat, stirring until golden, then cool it.",
      "Combine flour with almonds, sesame, anise, and cinnamon.",
      "Add butter and honey gradually until the mixture holds together.",
      "Press into a dish or shape into mounds, garnish with almonds, and cool before serving."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "تحميص الدقيق",
        "titleEn": "Toast flour",
        "durationMinutes": 15
      },
      {
        "stepIndex": 2,
        "titleAr": "تماسك الخليط",
        "titleEn": "Bind mixture",
        "durationMinutes": 5
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "saudi-chicken-kabsa",
    "titleAr": "كبسة الدجاج السعودية",
    "titleEn": "Saudi Chicken Kabsa",
    "descriptionAr": "أرز بسمتي متبل بالدجاج والطماطم واللومي والبهارات الخليجية.",
    "descriptionEn": "Fragrant basmati rice cooked with chicken, tomato, dried lime, and Saudi spices.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 65,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "سعودي",
      "كبسة",
      "دجاج",
      "أرز"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Saudi%20Chicken%20Kabsa",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Saudi%20Chicken%20Kabsa"
    ],
    "storyAr": "الكبسة من أطباق التجمعات في السعودية، وتظهر فيها نكهة اللومي والبهارات مع الأرز والدجاج.",
    "storyEn": "Kabsa is a Saudi gathering dish where dried lime and warm spices perfume rice cooked with chicken.",
    "ingredients": [
      {
        "id": "sck1",
        "nameAr": "دجاج مقطع",
        "nameEn": "Jointed chicken",
        "amount": 1.2,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "sck2",
        "nameAr": "أرز بسمتي",
        "nameEn": "Basmati rice",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "sck3",
        "nameAr": "طماطم مفرومة",
        "nameEn": "Chopped tomatoes",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "sck4",
        "nameAr": "بصل",
        "nameEn": "Onions",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "sck5",
        "nameAr": "لومي وبهارات كبسة",
        "nameEn": "Dried lime and kabsa spices",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "pantry"
      },
      {
        "id": "sck6",
        "nameAr": "زبيب ولوز",
        "nameEn": "Raisins and almonds",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "حمر البصل والدجاج مع البهارات حتى يكتسب الدجاج لوناً.",
      "أضف الطماطم واللومي والماء واطه الدجاج حتى ينضج.",
      "ارفع الدجاج وصف المرق ثم أضف الأرز واطهه مغطى حتى يتشرب.",
      "حمر الدجاج في الفرن وأضفه فوق الأرز مع الزبيب واللوز."
    ],
    "instructionsEn": [
      "Brown onion and chicken with spices until the chicken gains color.",
      "Add tomatoes, dried lime, and water and cook until the chicken is tender.",
      "Remove chicken, strain the broth, add rice, and cook covered until absorbed.",
      "Brown chicken in the oven and serve over rice with raisins and almonds."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي الدجاج",
        "titleEn": "Cook chicken",
        "durationMinutes": 45
      },
      {
        "stepIndex": 2,
        "titleAr": "طهي الأرز",
        "titleEn": "Cook rice",
        "durationMinutes": 22
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "oman-harees",
    "titleAr": "الهريس العُماني",
    "titleEn": "Omani Harees",
    "descriptionAr": "قمح مطهو ببطء مع اللحم والسمن حتى يصبح قوامه ناعماً ومتماسكاً.",
    "descriptionEn": "Wheat and meat cooked slowly with ghee until smooth and cohesive.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "iftar",
      "suhoor"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 150,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "عُماني",
      "هريس",
      "قمح",
      "رمضان"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Omani%20Harees",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Omani%20Harees"
    ],
    "storyAr": "الهريس طبق خليجي احتفالي حاضر في رمضان والمناسبات، ويعتمد على الطهي البطيء والهرس حتى النعومة.",
    "storyEn": "Harees is a Gulf celebration dish served in Ramadan and on special occasions, built around slow cooking and pounding until smooth.",
    "ingredients": [
      {
        "id": "oh1",
        "nameAr": "قمح مجروش منقوع",
        "nameEn": "Soaked cracked wheat",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "oh2",
        "nameAr": "لحم ضأن بدون عظم",
        "nameEn": "Boneless lamb",
        "amount": 700,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "oh3",
        "nameAr": "ماء",
        "nameEn": "Water",
        "amount": 8,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "other"
      },
      {
        "id": "oh4",
        "nameAr": "سمن",
        "nameEn": "Ghee",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "oh5",
        "nameAr": "هيل وقرفة",
        "nameEn": "Cardamom and cinnamon",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "oh6",
        "nameAr": "ملح",
        "nameEn": "Salt",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "انقع القمح عدة ساعات ثم صفه.",
      "اطه القمح واللحم والماء والهيل على نار هادئة حتى يلين القمح وينضج اللحم تماماً.",
      "فتت اللحم واهرِس الخليط أو اخفقه حتى يصبح ناعماً.",
      "قدمه ساخناً مع السمن والقرفة."
    ],
    "instructionsEn": [
      "Soak the wheat for several hours, then drain it.",
      "Cook wheat, meat, water, and cardamom gently until the wheat is soft and meat is fully cooked.",
      "Shred the meat and pound or whisk the mixture until smooth.",
      "Serve hot with ghee and cinnamon."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "نقع القمح",
        "titleEn": "Soak wheat",
        "durationMinutes": 240
      },
      {
        "stepIndex": 1,
        "titleAr": "الطهي البطيء",
        "titleEn": "Slow cook",
        "durationMinutes": 120
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "bahrain-muhammar",
    "titleAr": "المحمر البحريني",
    "titleEn": "Bahraini Muhammar Rice",
    "descriptionAr": "أرز حلو مع دبس التمر والزعفران وماء الورد يقدم مع الأطباق البحرية.",
    "descriptionEn": "Sweet rice perfumed with date syrup, saffron, and rosewater, traditionally paired with seafood.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "dessert"
    ],
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 35,
    "servings": 6,
    "difficulty": "easy",
    "isRamadanSpecial": false,
    "tags": [
      "بحريني",
      "أرز",
      "تمر",
      "حلو"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Bahraini%20Muhammar%20Rice",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Bahraini%20Muhammar%20Rice"
    ],
    "storyAr": "المحمر أرز بحريني حلو ارتبط بالمائدة الساحلية ويقدم خصوصاً إلى جانب السمك.",
    "storyEn": "Muhammar is a Bahraini sweet rice dish rooted in the coastal table and often served alongside fish.",
    "ingredients": [
      {
        "id": "bm1",
        "nameAr": "أرز بسمتي",
        "nameEn": "Basmati rice",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "bm2",
        "nameAr": "دبس تمر",
        "nameEn": "Date syrup",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "bm3",
        "nameAr": "سكر",
        "nameEn": "Sugar",
        "amount": 0.25,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "bm4",
        "nameAr": "زعفران وماء ورد",
        "nameEn": "Saffron and rosewater",
        "amount": 2,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "bm5",
        "nameAr": "زبدة",
        "nameEn": "Butter",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      },
      {
        "id": "bm6",
        "nameAr": "هيل",
        "nameEn": "Cardamom",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "اغسل الأرز واسلقه في ماء مملح حتى يقترب من النضج ثم صفه.",
      "سخن دبس التمر والسكر والزبدة والهيل مع قليل من الماء.",
      "أضف الأرز ووزع الزعفران وماء الورد ثم غطه على نار هادئة.",
      "اتركه يرتاح وافلفله بالشوكة قبل التقديم."
    ],
    "instructionsEn": [
      "Rinse rice, parboil it in salted water until nearly tender, then drain.",
      "Warm date syrup, sugar, butter, cardamom, and a little water.",
      "Add rice, scatter over saffron and rosewater, and steam covered on low heat.",
      "Rest and fluff with a fork before serving."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "سلق الأرز",
        "titleEn": "Parboil rice",
        "durationMinutes": 12
      },
      {
        "stepIndex": 2,
        "titleAr": "تبخير الأرز",
        "titleEn": "Steam rice",
        "durationMinutes": 18
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "qatar-madrouba",
    "titleAr": "المضروبة القطرية بالدجاج",
    "titleEn": "Qatari Chicken Madrouba",
    "descriptionAr": "طبق أرز كثيف يطهى مع الدجاج واللبن والبهارات ثم يهرس حتى يصبح كريمي القوام.",
    "descriptionEn": "A thick rice and chicken dish cooked with yogurt and spices, then beaten to a creamy texture.",
    "region": "gulf",
    "mealType": [
      "lunch",
      "dinner",
      "iftar",
      "suhoor"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 90,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "قطري",
      "مضروبة",
      "دجاج",
      "أرز"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Qatari%20Chicken%20Madrouba",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Qatari%20Chicken%20Madrouba"
    ],
    "storyAr": "المضروبة من أطباق الخليج الدافئة، ويأتي اسمها من طريقة ضرب الأرز واللحم حتى يتجانس القوام.",
    "storyEn": "Madrouba is a warming Gulf dish named for the beating that combines rice and meat into a cohesive texture.",
    "ingredients": [
      {
        "id": "qm1",
        "nameAr": "أرز قصير الحبة",
        "nameEn": "Short-grain rice",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "qm2",
        "nameAr": "دجاج منزوع الجلد",
        "nameEn": "Skinless chicken",
        "amount": 800,
        "unitAr": "جرام",
        "unitEn": "g",
        "aisle": "meat"
      },
      {
        "id": "qm3",
        "nameAr": "زبادي",
        "nameEn": "Yogurt",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "dairy"
      },
      {
        "id": "qm4",
        "nameAr": "بصل",
        "nameEn": "Onion",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "qm5",
        "nameAr": "هيل وزنجبيل وكركم",
        "nameEn": "Cardamom, ginger, and turmeric",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "qm6",
        "nameAr": "ليمون مجفف",
        "nameEn": "Dried lime",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "شوح البصل والدجاج مع البهارات والليمون المجفف.",
      "أضف الأرز والماء واطه الخليط مغطى حتى يتهرى الأرز وينضج الدجاج.",
      "أخرج الليمون وفتت الدجاج ثم أعده إلى القدر.",
      "أضف الزبادي تدريجياً واضرب الخليط حتى يصبح كثيفاً وناعماً ثم قدمه ساخناً."
    ],
    "instructionsEn": [
      "Sauté onion and chicken with spices and dried lime.",
      "Add rice and water, cover, and cook until the rice breaks down and chicken is tender.",
      "Remove limes, shred the chicken, and return it to the pot.",
      "Stir in yogurt gradually and beat until thick and smooth, then serve hot."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي الأرز والدجاج",
        "titleEn": "Cook rice and chicken",
        "durationMinutes": 70
      },
      {
        "stepIndex": 3,
        "titleAr": "تجانس المضروبة",
        "titleEn": "Blend madrouba",
        "durationMinutes": 10
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "palestine-musakhan",
    "titleAr": "المسخن الفلسطيني",
    "titleEn": "Palestinian Musakhan",
    "descriptionAr": "دجاج بالبصل والسماق وزيت الزيتون يقدم فوق خبز الطابون مع الصنوبر.",
    "descriptionEn": "Chicken with sumac onions and olive oil served over taboon bread with pine nuts.",
    "region": "levant",
    "mealType": [
      "lunch",
      "dinner",
      "iftar"
    ],
    "prepTimeMinutes": 25,
    "cookTimeMinutes": 65,
    "servings": 6,
    "difficulty": "medium",
    "isRamadanSpecial": true,
    "tags": [
      "فلسطيني",
      "مسخن",
      "سماق",
      "دجاج"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Palestinian%20Musakhan",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Palestinian%20Musakhan"
    ],
    "storyAr": "المسخن الفلسطيني يحتفي بزيت الزيتون والسماق وخبز الطابون، ويقدم غالباً في موسم قطاف الزيتون.",
    "storyEn": "Palestinian musakhan celebrates olive oil, sumac, and taboon bread, especially around the olive harvest season.",
    "ingredients": [
      {
        "id": "pm1",
        "nameAr": "أفخاذ دجاج",
        "nameEn": "Chicken thighs",
        "amount": 1.2,
        "unitAr": "كجم",
        "unitEn": "kg",
        "aisle": "meat"
      },
      {
        "id": "pm2",
        "nameAr": "بصل شرائح",
        "nameEn": "Sliced onions",
        "amount": 6,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "pm3",
        "nameAr": "سماق",
        "nameEn": "Sumac",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      },
      {
        "id": "pm4",
        "nameAr": "خبز طابون أو خبز عربي",
        "nameEn": "Taboon or flatbread",
        "amount": 4,
        "unitAr": "أرغفة",
        "unitEn": "loaves",
        "aisle": "bakery"
      },
      {
        "id": "pm5",
        "nameAr": "زيت زيتون",
        "nameEn": "Olive oil",
        "amount": 1,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "pm6",
        "nameAr": "صنوبر محمص",
        "nameEn": "Toasted pine nuts",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "تبّل الدجاج بالملح والفلفل والبهارات واخبزه حتى ينضج.",
      "اطه البصل ببطء في زيت الزيتون حتى يذبل ثم أضف السماق.",
      "ضع الخبز في صينية ووزع فوقه البصل وزيت الزيتون ثم الدجاج.",
      "حمّر الصينية سريعاً وزينها بالصنوبر وقدّمها ساخنة."
    ],
    "instructionsEn": [
      "Season chicken with salt, pepper, and spices and roast until cooked through.",
      "Cook onions slowly in olive oil until soft, then stir in sumac.",
      "Arrange bread in a tray and cover with onions, olive oil, and chicken.",
      "Brown briefly, garnish with pine nuts, and serve hot."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "خبز الدجاج",
        "titleEn": "Roast chicken",
        "durationMinutes": 45
      },
      {
        "stepIndex": 1,
        "titleAr": "طهي البصل",
        "titleEn": "Cook onions",
        "durationMinutes": 25
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "levant-fattet-hummus",
    "titleAr": "فتة الحمص الشامية",
    "titleEn": "Levantine Fattet Hummus",
    "descriptionAr": "خبز محمص وحمص ولبن وطحينة في طبق دافئ مزين بالصنوبر والبابريكا.",
    "descriptionEn": "Toasted bread layered with chickpeas, yogurt, and tahini, finished with pine nuts and paprika.",
    "region": "levant",
    "mealType": [
      "breakfast",
      "lunch",
      "iftar"
    ],
    "prepTimeMinutes": 20,
    "cookTimeMinutes": 15,
    "servings": 4,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "شامي",
      "فتة",
      "حمص",
      "نباتي"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Levantine%20Fattet%20Hummus",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Levantine%20Fattet%20Hummus"
    ],
    "storyAr": "فتة الحمص طبق شامي منزلي يقدم دافئاً، وتوازن فيه طبقات الخبز والحمص واللبن بين القوام المقرمش والكريمي.",
    "storyEn": "Fattet hummus is a warm Levantine home dish balancing crisp bread, tender chickpeas, and creamy yogurt.",
    "ingredients": [
      {
        "id": "lfh1",
        "nameAr": "حمص مسلوق",
        "nameEn": "Cooked chickpeas",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "lfh2",
        "nameAr": "خبز عربي محمص",
        "nameEn": "Toasted pita",
        "amount": 3,
        "unitAr": "أرغفة",
        "unitEn": "loaves",
        "aisle": "bakery"
      },
      {
        "id": "lfh3",
        "nameAr": "زبادي",
        "nameEn": "Yogurt",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "dairy"
      },
      {
        "id": "lfh4",
        "nameAr": "طحينة",
        "nameEn": "Tahini",
        "amount": 0.5,
        "unitAr": "كوب",
        "unitEn": "cup",
        "aisle": "pantry"
      },
      {
        "id": "lfh5",
        "nameAr": "ثوم وليمون",
        "nameEn": "Garlic and lemon",
        "amount": 3,
        "unitAr": "فصوص",
        "unitEn": "cloves",
        "aisle": "produce"
      },
      {
        "id": "lfh6",
        "nameAr": "صنوبر وزبدة",
        "nameEn": "Pine nuts and butter",
        "amount": 3,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "dairy"
      }
    ],
    "instructionsAr": [
      "حمص الخبز في الفرن حتى يصبح مقرمشاً ثم كسره في طبق التقديم.",
      "سخن الحمص مع قليل من ماء السلق والكمون.",
      "اخلط اللبن والطحينة والثوم والليمون والملح.",
      "ضع الحمص فوق الخبز واسكب خليط اللبن وحمر الصنوبر بالزبدة فوق الوجه."
    ],
    "instructionsEn": [
      "Toast pita until crisp, then break it into a serving dish.",
      "Warm chickpeas with a little cooking liquid and cumin.",
      "Whisk yogurt, tahini, garlic, lemon, and salt.",
      "Layer chickpeas over bread, pour on yogurt sauce, and top with pine nuts browned in butter."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "تحميص الخبز",
        "titleEn": "Toast bread",
        "durationMinutes": 8
      },
      {
        "stepIndex": 3,
        "titleAr": "تحمير الصنوبر",
        "titleEn": "Brown pine nuts",
        "durationMinutes": 3
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "egypt-ful-medames",
    "titleAr": "الفول المدمس المصري",
    "titleEn": "Egyptian Ful Medames",
    "descriptionAr": "فول مدمس متبل بالكمون والليمون وزيت الزيتون ويقدم مع الخبز والخضار.",
    "descriptionEn": "Slow-cooked fava beans seasoned with cumin, lemon, and olive oil and served with bread and vegetables.",
    "region": "egypt",
    "mealType": [
      "breakfast",
      "lunch",
      "suhoor"
    ],
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 20,
    "servings": 4,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "مصري",
      "فول",
      "فطور",
      "نباتي"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Egyptian%20Ful%20Medames",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Egyptian%20Ful%20Medames"
    ],
    "storyAr": "الفول المدمس من أشهر أطباق الفطور المصرية ويقدم من عربات الشوارع إلى موائد البيوت مع إضافات متعددة.",
    "storyEn": "Ful medames is one of Egypt's most beloved breakfasts, served everywhere from street carts to family tables with varied toppings.",
    "ingredients": [
      {
        "id": "efm1",
        "nameAr": "فول مدمس معلب أو مطهو",
        "nameEn": "Cooked fava beans",
        "amount": 3,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "efm2",
        "nameAr": "طماطم",
        "nameEn": "Tomato",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "efm3",
        "nameAr": "بصل أخضر",
        "nameEn": "Spring onions",
        "amount": 2,
        "unitAr": "حزمة",
        "unitEn": "bunches",
        "aisle": "produce"
      },
      {
        "id": "efm4",
        "nameAr": "ليمون",
        "nameEn": "Lemon",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "efm5",
        "nameAr": "كمون",
        "nameEn": "Cumin",
        "amount": 1,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "efm6",
        "nameAr": "زيت زيتون",
        "nameEn": "Olive oil",
        "amount": 4,
        "unitAr": "ملعقة كبيرة",
        "unitEn": "tbsp",
        "aisle": "pantry"
      }
    ],
    "instructionsAr": [
      "سخن الفول مع قليل من مائه حتى يغلي برفق.",
      "اهرِس جزءاً من الحبوب واترك بعضها كاملاً.",
      "تبّل بالكمون والليمون والملح وزيت الزيتون.",
      "قدمه فوراً مع الطماطم والبصل الأخضر والخبز."
    ],
    "instructionsEn": [
      "Warm fava beans with a little of their liquid until gently bubbling.",
      "Mash some beans while leaving the rest whole.",
      "Season with cumin, lemon, salt, and olive oil.",
      "Serve immediately with tomato, spring onion, and bread."
    ],
    "timerSteps": [
      {
        "stepIndex": 0,
        "titleAr": "تسخين الفول",
        "titleEn": "Warm beans",
        "durationMinutes": 12
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  },
  {
    "id": "general-arabic-lentil-soup",
    "titleAr": "شوربة العدس العربية",
    "titleEn": "Arabic Red Lentil Soup",
    "descriptionAr": "شوربة عدس حمراء ناعمة بالجزر والبطاطس والكمون والليمون.",
    "descriptionEn": "A smooth red lentil soup with carrot, potato, cumin, and lemon.",
    "region": "general",
    "mealType": [
      "dinner",
      "iftar",
      "suhoor"
    ],
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 35,
    "servings": 6,
    "difficulty": "easy",
    "isRamadanSpecial": true,
    "tags": [
      "عربي",
      "شوربة",
      "عدس",
      "رمضان"
    ],
    "image": "https://placehold.co/1000x700/f3ead8/6b4226?text=Arabic%20Red%20Lentil%20Soup",
    "galleryImages": [
      "https://placehold.co/1000x700/f3ead8/6b4226?text=Arabic%20Red%20Lentil%20Soup"
    ],
    "storyAr": "شوربة العدس طبق دافئ مشترك في مطابخ المنطقة، وتظهر كثيراً على موائد الشتاء والإفطار.",
    "storyEn": "Red lentil soup is a warming shared staple across the region, especially welcome in winter and at iftar.",
    "ingredients": [
      {
        "id": "gals1",
        "nameAr": "عدس أحمر",
        "nameEn": "Red lentils",
        "amount": 2,
        "unitAr": "كوب",
        "unitEn": "cups",
        "aisle": "pantry"
      },
      {
        "id": "gals2",
        "nameAr": "جزر",
        "nameEn": "Carrots",
        "amount": 3,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "gals3",
        "nameAr": "بطاطس",
        "nameEn": "Potatoes",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      },
      {
        "id": "gals4",
        "nameAr": "بصل",
        "nameEn": "Onion",
        "amount": 1,
        "unitAr": "حبة",
        "unitEn": "pc",
        "aisle": "produce"
      },
      {
        "id": "gals5",
        "nameAr": "كمون وكركم",
        "nameEn": "Cumin and turmeric",
        "amount": 2,
        "unitAr": "ملعقة صغيرة",
        "unitEn": "tsp",
        "aisle": "pantry"
      },
      {
        "id": "gals6",
        "nameAr": "ليمون",
        "nameEn": "Lemon",
        "amount": 2,
        "unitAr": "حبة",
        "unitEn": "pcs",
        "aisle": "produce"
      }
    ],
    "instructionsAr": [
      "اغسل العدس وضعه مع البصل والجزر والبطاطس والبهارات في قدر ماء.",
      "اطه الخليط حتى تلين الخضروات والعدس تماماً.",
      "اخلط الشوربة حتى تصبح ناعمة ثم أعدها إلى النار واضبط الملح.",
      "قدمها ساخنة مع عصير الليمون والخبز المحمص."
    ],
    "instructionsEn": [
      "Rinse lentils and place them with onion, carrot, potato, spices, and water in a pot.",
      "Cook until the vegetables and lentils are completely tender.",
      "Blend until smooth, return to the heat, and adjust the salt.",
      "Serve hot with lemon juice and toasted bread."
    ],
    "timerSteps": [
      {
        "stepIndex": 1,
        "titleAr": "طهي العدس والخضروات",
        "titleEn": "Cook lentils and vegetables",
        "durationMinutes": 30
      }
    ],
    "votesCount": {
      "likes": 0,
      "dislikes": 0
    },
    "rating": 0
  }
];

const VERIFIED_DIETARY_TAGS: Record<string, DietaryTag[]> = {
  'egypt-koshary': ['vegan', 'dairy-free'],
  'arabic-shakshuka': ['vegetarian'],
  'egypt-taameya-ful': ['vegan', 'dairy-free'],
};

INITIAL_RECIPES.forEach((recipe) => {
  const tags = VERIFIED_DIETARY_TAGS[recipe.id];
  if (tags) recipe.dietaryTags = tags;
});
