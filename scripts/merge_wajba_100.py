"""Merge the 35 new recipes + 100 Style-B images into the wajba repo.

Usage: python3 merge_wajba_100.py   (run from anywhere; repo root is derived from the script path)

Reads:  ~/workspace/wajba-images/content/new35-recipes.jsonl
Writes: recipes_data.json, public/recipes_data.json, src/data/recipes.ts
Expects: public/recipe-images/wajba-{id}.webp for every recipe id.
"""
import json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSONL = os.path.expanduser('~/workspace/wajba-images/content/new35-recipes.jsonl')
IMG_DIR = os.path.join(REPO, 'public', 'recipe-images')

def img_path(rid):
    return f'/recipe-images/wajba-{rid}.webp'

def load_jsonl(path):
    recs = []
    with open(path, encoding='utf-8') as f:
        for n, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                recs.append(json.loads(line))
            except json.JSONDecodeError as e:
                sys.exit(f'JSONL line {n} invalid: {e}')
    return recs

def require(condition, message):
    if not condition:
        raise ValueError(message)

def validate(rec):
    require(isinstance(rec, dict), 'recipe must be a JSON object')
    req = ['id','titleAr','titleEn','descriptionAr','descriptionEn','region',
           'mealType','prepTimeMinutes','cookTimeMinutes','servings','difficulty',
           'isRamadanSpecial','tags','image','galleryImages','storyAr','storyEn',
           'ingredients','instructionsAr','instructionsEn']
    missing = [k for k in req if k not in rec]
    require(not missing, f"{rec.get('id')}: missing {missing}")
    require(isinstance(rec['id'], str) and re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', rec['id']),
            f"{rec['id']}: id must be a lowercase slug")
    require(isinstance(rec['mealType'], list) and rec['mealType'], f"{rec['id']}: mealType")
    require(isinstance(rec['ingredients'], list) and len(rec['ingredients']) >= 5,
            f"{rec['id']}: ingredients")
    require(isinstance(rec['instructionsAr'], list) and len(rec['instructionsAr']) >= 5,
            f"{rec['id']}: instructionsAr")
    require(isinstance(rec['instructionsEn'], list) and len(rec['instructionsEn']) >= 5,
            f"{rec['id']}: instructionsEn")
    for ing in rec['ingredients']:
        require(isinstance(ing, dict), f"{rec['id']}: ingredient must be a JSON object")
        for k in ['id','nameAr','nameEn','amount','unitAr','unitEn','aisle']:
            require(k in ing, f"{rec['id']}: ingredient missing {k}")

def main():
    data = json.load(open(os.path.join(REPO, 'recipes_data.json'), encoding='utf-8'))
    require(isinstance(data, dict) and isinstance(data.get('recipes'), list),
            'recipes_data.json must contain a recipes list')
    recipes = data['recipes']
    existing_ids = {r['id'] for r in recipes}
    require(len(recipes) == 65, f'expected 65 existing, got {len(recipes)}')

    new = load_jsonl(JSONL)
    require(len(new) == 35, f'expected 35 new, got {len(new)}')
    for rec in new:
        validate(rec)
    new_ids = [r['id'] for r in new]
    require(len(set(new_ids)) == 35, 'duplicate new ids')
    overlap = existing_ids & set(new_ids)
    require(not overlap, f'id overlap: {overlap}')

    for rec in new:
        require(rec['region'] == 'egypt', f"{rec['id']}: region must be egypt")
        rec['image'] = img_path(rec['id'])
        rec['galleryImages'] = [img_path(rec['id'])]

    for rec in recipes:
        rec['image'] = img_path(rec['id'])
        rec['galleryImages'] = [img_path(rec['id'])]

    all_recipes = recipes + new
    require(len(all_recipes) == 100, f'expected 100 merged recipes, got {len(all_recipes)}')

    missing_imgs = [r['id'] for r in all_recipes
                    if not os.path.isfile(os.path.join(IMG_DIR, f"wajba-{r['id']}.webp"))]
    require(not missing_imgs, f'missing images: {missing_imgs}')

    data['recipes'] = all_recipes
    data['_meta']['totalMeals'] = 100
    out = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
    open(os.path.join(REPO, 'recipes_data.json'), 'w', encoding='utf-8').write(out)
    open(os.path.join(REPO, 'public', 'recipes_data.json'), 'w', encoding='utf-8').write(out)
    print('wrote recipes_data.json + public/recipes_data.json (100 recipes)')

    # Regenerate src/data/recipes.ts preserving header/footer
    ts_path = os.path.join(REPO, 'src', 'data', 'recipes.ts')
    ts = open(ts_path, encoding='utf-8').read()
    marker = 'INITIAL_RECIPES: Recipe[] = ['
    hstart = ts.index(marker) + len(marker) - 1  # at '['
    depth, in_str, esc, end = 0, False, False, None
    for i in range(hstart, len(ts)):
        c = ts[i]
        if in_str:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == '"': in_str = False
        else:
            if c == '"': in_str = True
            elif c == '[': depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
    require(end is not None, 'array end not found')
    header, footer = ts[:hstart], ts[end:]
    body = json.dumps(all_recipes, ensure_ascii=False, indent=2)
    open(ts_path, 'w', encoding='utf-8').write(header + body + footer)
    print('regenerated src/data/recipes.ts')

    # stats
    diffs = {}
    ram = sum(1 for r in all_recipes if r.get('isRamadanSpecial'))
    for r in all_recipes:
        diffs[r['difficulty']] = diffs.get(r['difficulty'], 0) + 1
    print(f'difficulty: {diffs}, ramadan: {ram}')

if __name__ == '__main__':
    main()
