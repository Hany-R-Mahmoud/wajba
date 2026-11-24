import { ProduceCategory, ProduceItem, SeasonMonth } from '../types';

/**
 * Egyptian seasonal-produce dataset, ported from Mawsimha (donor app).
 *
 * Arabic names, categories, season months, peak months and Arabic cook hints
 * are copied VERBATIM from Mawsimha `src/data/produce.ts` (dataset
 * `mawsimha-v1-2026-11-02`). Do not edit them here. Any doubt goes into
 * `docs/seasons-translation-review.md`; a dataset change needs a new
 * version date and a re-check by the owner.
 *
 * DRAFT: every English string in this file (`nameEn`, `cookHintEn`,
 * `GUIDE_NOTE_EN`, `SOURCE_NOTE_EN`, `SEASON_MONTHS_EN`,
 * `PRODUCE_CATEGORY_LABELS.en`) was written by an AI assistant and is a
 * draft pending owner review. See `docs/seasons-translation-review.md`.
 */

export const DATASET_DATE = '2026-11-02';
export const DATASET_VERSION = 'mawsimha-v1-2026-11-02';

/** Flip to false once the owner has approved the English wording. */
export const ENGLISH_IS_DRAFT = true;

export const GUIDE_NOTE_AR = 'دليل مواسم مش قايمة أسعار — التوفر بيختلف حسب السوق والمنطقة';
export const GUIDE_NOTE_EN = 'A seasonal guide, not a price list. Availability varies by market and region.';
export const SOURCE_NOTE_AR = 'متجمع من تقاويم الزراعة والحصاد المصرية المتاحة للعامة، بتاريخ 2026-11-02';
export const SOURCE_NOTE_EN = 'Compiled from publicly available Egyptian planting and harvest calendars, dated 2026-11-02.';

/** Calendar order; index zero is January, month numbers stay 1-12. */
export const SEASON_MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
] as const;
export const SEASON_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const PRODUCE_CATEGORY_LABELS: Record<ProduceCategory | 'all', { ar: string; en: string }> = {
  all: { ar: 'الكل', en: 'All' },
  vegetable: { ar: 'خضار', en: 'Vegetables' },
  fruit: { ar: 'فاكهة', en: 'Fruit' },
  herbs: { ar: 'خضرة', en: 'Herbs' },
};

const ALL: SeasonMonth[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type AuthoredRow = [
  id: string,
  nameAr: string,
  nameEn: string,
  category: ProduceCategory,
  season: SeasonMonth[],
  peak: SeasonMonth[],
  cookHintAr: string,
  cookHintEn: string,
];

const rows: AuthoredRow[] = [
  ['01', 'طماطم', 'Tomato', 'vegetable', ALL, [5, 6, 7, 8], 'صلصة، خضار مطبوخ، سلطة', 'Sauce, cooked vegetables, salad'],
  ['02', 'خيار', 'Cucumber', 'vegetable', [3, 4, 5, 6, 7, 8, 9, 10], [5, 6, 7, 8], 'سلطة، مخلل سريع، سلطة زبادي', 'Salad, quick pickle, yogurt salad'],
  ['03', 'باذنجان', 'Eggplant', 'vegetable', [5, 6, 7, 8, 9], [6, 7, 8], 'مسقعة، بابا غنوج، مقلي', 'Moussaka, baba ghanoush, fried'],
  ['04', 'كوسة', 'Zucchini', 'vegetable', [3, 4, 5, 6, 7, 8, 9, 10], [5, 6, 7, 8], 'محشي، خضار سوتيه، شوربة', 'Stuffed, sautéed vegetables, soup'],
  ['05', 'فلفل رومي', 'Bell pepper', 'vegetable', [5, 6, 7, 8, 9, 10], [6, 7, 8, 9], 'سلطة، محشي، شكشوكة', 'Salad, stuffed, shakshuka'],
  ['06', 'بامية', 'Okra', 'vegetable', [6, 7, 8, 9, 10], [7, 8, 9], 'بامية بالصلصة، ويكة', 'Okra in tomato sauce, weika'],
  ['07', 'فاصوليا خضراء', 'Green beans', 'vegetable', [3, 4, 5, 9, 10, 11], [4, 10], 'فاصوليا بالصلصة، سوتيه', 'Beans in tomato sauce, sautéed'],
  ['08', 'بسلة', 'Peas', 'vegetable', [11, 12, 1, 2, 3], [12, 1, 2], 'بسلة بالجزر، شوربة، رز بالخضار', 'Peas with carrots, soup, vegetable rice'],
  ['09', 'سبانخ', 'Spinach', 'vegetable', [11, 12, 1, 2, 3], [12, 1, 2], 'سبانخ بالصلصة، فطاير، شوربة', 'Spinach in tomato sauce, savory pies, soup'],
  ['10', 'ملوخية', 'Molokhia', 'vegetable', [5, 6, 7, 8, 9], [6, 7, 8], 'ملوخية بالفراخ أو اللحمة', 'Molokhia with chicken or meat'],
  ['11', 'كرنب', 'Cabbage', 'vegetable', [11, 12, 1, 2, 3], [12, 1, 2], 'محشي كرنب، شوربة', 'Stuffed cabbage rolls, soup'],
  ['12', 'قرنبيط', 'Cauliflower', 'vegetable', [11, 12, 1, 2, 3], [12, 1, 2], 'قرنبيط مقلي، بالصلصة', 'Fried cauliflower, in tomato sauce'],
  ['13', 'جزر', 'Carrot', 'vegetable', [11, 12, 1, 2, 3, 4], [12, 1, 2, 3], 'شوربة، سلطة، مخلل', 'Soup, salad, pickles'],
  ['14', 'بطاطس', 'Potato', 'vegetable', ALL, [2, 3, 4], 'صينية، مقلية، شوربة', 'Oven tray, fries, soup'],
  ['15', 'بصل', 'Onion', 'vegetable', ALL, [4, 5, 6, 7], 'أساس الطبخ، مخلل، صواني', 'Base of cooking, pickles, oven trays'],
  ['16', 'ثوم', 'Garlic', 'vegetable', ALL, [4, 5, 6], 'تقلية، تتبيلة، مخلل', 'Garlic sizzle, marinade, pickles'],
  ['17', 'خس', 'Lettuce', 'vegetable', [10, 11, 12, 1, 2, 3, 4], [11, 12, 1, 2, 3], 'سلطة، ساندوتشات', 'Salad, sandwiches'],
  ['18', 'جرجير', 'Arugula', 'vegetable', [10, 11, 12, 1, 2, 3, 4], [11, 12, 1, 2, 3], 'سلطة جرجير، مع الفول والجبنة', 'Arugula salad, with fava beans and cheese'],
  ['19', 'خضرة (بقدونس وشبت وكزبرة)', 'Fresh herbs (parsley, dill, coriander)', 'herbs', ALL, [11, 12, 1, 2, 3], 'سلطة، محشي، تتبيلة', 'Salad, stuffing, marinade'],
  ['20', 'برتقال بلدي', 'Baladi orange', 'fruit', [12, 1, 2, 3], [1, 2], 'عصير، سلطة فواكه، كيك', 'Juice, fruit salad, cake'],
  ['21', 'يوسفي', 'Mandarin', 'fruit', [11, 12, 1, 2, 3], [12, 1], 'أكل طازج، عصير، سلطة فواكه', 'Fresh, juice, fruit salad'],
  ['22', 'ليمون بلدي', 'Baladi lemon', 'fruit', [11, 12, 1, 2, 3, 4, 5, 6], [12, 1, 2, 3], 'عصير، تتبيلة، مخلل', 'Juice, marinade, pickles'],
  ['23', 'جوافة', 'Guava', 'fruit', [8, 9, 10, 11], [9, 10], 'عصير، أكل طازج، سلطة فواكه', 'Juice, fresh, fruit salad'],
  ['24', 'مانجو', 'Mango', 'fruit', [7, 8, 9, 10], [8, 9], 'عصير، أكل طازج، سلطة فواكه', 'Juice, fresh, fruit salad'],
  ['25', 'عنب', 'Grapes', 'fruit', [6, 7, 8, 9], [7, 8], 'أكل طازج، ورق عنب في موسمه', 'Fresh; grape leaves in season'],
  ['26', 'تين برشومي', 'Barshomi fig (prickly pear)', 'fruit', [7, 8, 9], [8], 'أكل طازج، مع الجبنة والعسل', 'Fresh, with cheese and honey'],
  ['27', 'رمان', 'Pomegranate', 'fruit', [9, 10, 11], [10], 'سلطة، عصير، فتة', 'Salad, juice, fatteh'],
  ['28', 'فراولة', 'Strawberry', 'fruit', [12, 1, 2, 3], [1, 2], 'عصير، مربى، سلطة فواكه', 'Juice, jam, fruit salad'],
  ['29', 'موز بلدي', 'Baladi banana', 'fruit', ALL, [12, 1, 2], 'أكل طازج، عصير باللبن، كيك', 'Fresh, milk smoothie, cake'],
  ['30', 'بطيخ', 'Watermelon', 'fruit', [5, 6, 7, 8, 9], [6, 7, 8], 'أكل طازج مع الجبنة، عصير', 'Fresh with cheese, juice'],
  ['31', 'شمام (كنتالوب)', 'Melon (cantaloupe)', 'fruit', [5, 6, 7, 8, 9], [6, 7, 8], 'أكل طازج، عصير', 'Fresh, juice'],
  ['32', 'خوخ', 'Peach', 'fruit', [5, 6, 7, 8], [6, 7], 'أكل طازج، عصير، سلطة فواكه', 'Fresh, juice, fruit salad'],
  ['33', 'مشمش', 'Apricot', 'fruit', [5, 6, 7], [6], 'أكل طازج، قمر الدين، مربى', 'Fresh, qamar al-din (apricot sheets), jam'],
  ['34', 'برقوق', 'Plum', 'fruit', [6, 7, 8], [7], 'أكل طازج، عصير', 'Fresh, juice'],
  ['35', 'بلح (زغلول وسيوي)', 'Fresh dates (zaghloul and siwi)', 'fruit', [8, 9, 10, 11], [9, 10], 'أكل طازج، مع اللبن، حلو', 'Fresh, with milk, dessert'],
  ['36', 'خرشوف', 'Artichoke', 'vegetable', [12, 1, 2, 3, 4], [1, 2, 3], 'خرشوف باللحمة المفرومة، شوربة', 'Artichoke with minced meat, soup'],
];

export const PRODUCE: ProduceItem[] = rows.map(
  ([id, nameAr, nameEn, category, seasonMonths, peakMonths, cookHintAr, cookHintEn]) => ({
    id,
    nameAr,
    nameEn,
    category,
    seasonMonths,
    peakMonths,
    cookHintAr,
    cookHintEn,
    seasonStartMonth: seasonMonths[0],
    seasonEndMonth: seasonMonths[seasonMonths.length - 1],
  }),
);

const CATEGORY_ORDER: Record<ProduceCategory, number> = { vegetable: 0, fruit: 1, herbs: 2 };

/** Items in season for a month: peak first, then category, then Arabic name. */
export function getMonthList(
  month: number,
  category: ProduceCategory | 'all' = 'all',
  items: ProduceItem[] = PRODUCE,
): ProduceItem[] {
  const m = month as SeasonMonth;
  return items
    .filter((p) => p.seasonMonths.includes(m) && (category === 'all' || p.category === category))
    .sort(
      (a, b) =>
        Number(b.peakMonths.includes(m)) - Number(a.peakMonths.includes(m)) ||
        CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category] ||
        a.nameAr.localeCompare(b.nameAr, 'ar') ||
        a.id.localeCompare(b.id),
    );
}
