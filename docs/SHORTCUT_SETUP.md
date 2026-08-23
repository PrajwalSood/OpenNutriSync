# iOS Shortcut Setup — `LogFullNutrition`

## Fastest path: import the prebuilt shortcut (needs a Mac once)

A ready-made shortcut with all 39 HealthKit actions ships in
[../shortcut/](../shortcut/). Apple blocks importing unsigned shortcut files, so sign it for
yourself on any Mac:

```sh
cd shortcut
shortcuts sign --input LogFullNutrition-unsigned.shortcut \
               --output LogFullNutrition.shortcut
```

Double-click the signed file — it imports into Shortcuts and syncs to your iPhone via iCloud
(or AirDrop it). Done: HealthKit logging works immediately. If you also want the dashboard,
add the webhook step from §4 below inside the imported shortcut.

No Mac? Build it by hand following the steps below.

## Building manually

Create an Apple Shortcut named `LogFullNutrition`.

Steps 1–3 (parse payload, write to HealthKit) are the whole point of this project and work
completely standalone — no backend, no dashboard, nothing to deploy. Step 4 (webhook sync) is
optional: only add it if you also want the [self-hosted dashboard](../README.md#2-dashboard--history-optional).

## 1. Parse Incoming Payload

Accepts JSON string from the chat app's URL scheme.

- `Get Shortcut Input`
- `Get Dictionary from Shortcut Input` → variable `Payload`

## 2. Extract Dictionaries

- `Get Dictionary Value` for `energy_hydration` in `Payload` → `Energy`
- `Get Dictionary Value` for `macronutrients` in `Payload` → `Macros`
- `Get Dictionary Value` for `vitamins` in `Payload` → `Vits`
- `Get Dictionary Value` for `minerals` in `Payload` → `Mins`

## 3. Log Health Samples (chained `Log Health Sample` actions)

All 39 Apple Health nutrition fields, in one `Log Health Sample` action per row. This is the
full HealthKit "Nutrition" category — nothing skipped.

**Energy & Hydration**

| Source | HealthKit Type | Unit |
|---|---|---|
| `Energy.dietary_energy_kcal` | Dietary Energy | kcal |
| `Energy.water_ml` | Water | mL |
| `Energy.caffeine_mg` | Caffeine | mg |

**Macronutrients**

| Source | HealthKit Type | Unit |
|---|---|---|
| `Macros.carbohydrates_g` | Carbohydrates | g |
| `Macros.dietary_sugar_g` | Sugar | g |
| `Macros.fiber_g` | Fiber | g |
| `Macros.protein_g` | Protein | g |
| `Macros.total_fat_g` | Total Fat | g |
| `Macros.saturated_fat_g` | Saturated Fat | g |
| `Macros.monounsaturated_fat_g` | Monounsaturated Fat | g |
| `Macros.polyunsaturated_fat_g` | Polyunsaturated Fat | g |
| `Macros.cholesterol_mg` | Cholesterol | mg |

**Vitamins**

| Source | HealthKit Type | Unit |
|---|---|---|
| `Vits.vitamin_a_mcg` | Vitamin A | mcg |
| `Vits.thiamin_b1_mg` | Thiamin (Vitamin B1) | mg |
| `Vits.riboflavin_b2_mg` | Riboflavin (Vitamin B2) | mg |
| `Vits.niacin_b3_mg` | Niacin (Vitamin B3) | mg |
| `Vits.pantothenic_acid_b5_mg` | Pantothenic Acid (Vitamin B5) | mg |
| `Vits.vitamin_b6_mg` | Vitamin B6 (Pyridoxine) | mg |
| `Vits.biotin_b7_mcg` | Biotin (Vitamin B7) | mcg |
| `Vits.folate_b9_mcg` | Folate / Folic Acid (Vitamin B9) | mcg |
| `Vits.cobalamin_b12_mcg` | Vitamin B12 (Cobalamin) | mcg |
| `Vits.vitamin_c_mg` | Vitamin C | mg |
| `Vits.vitamin_d_iu` | Vitamin D | IU |
| `Vits.vitamin_e_mg` | Vitamin E | mg |
| `Vits.vitamin_k_mcg` | Vitamin K | mcg |

**Minerals & Electrolytes**

| Source | HealthKit Type | Unit |
|---|---|---|
| `Mins.calcium_mg` | Calcium | mg |
| `Mins.chloride_mg` | Chloride | mg |
| `Mins.chromium_mcg` | Chromium | mcg |
| `Mins.copper_mg` | Copper | mg |
| `Mins.iodine_mcg` | Iodine | mcg |
| `Mins.iron_mg` | Iron | mg |
| `Mins.magnesium_mg` | Magnesium | mg |
| `Mins.manganese_mg` | Manganese | mg |
| `Mins.molybdenum_mcg` | Molybdenum | mcg |
| `Mins.phosphorus_mg` | Phosphorus | mg |
| `Mins.potassium_mg` | Potassium | mg |
| `Mins.selenium_mcg` | Selenium | mcg |
| `Mins.sodium_mg` | Sodium | mg |
| `Mins.zinc_mg` | Zinc | mg |

This maps 1:1 to the JSON schema in
[SYSTEM_PROMPT.md](SYSTEM_PROMPT.md), the `meal_nutrients` columns in
[schema.sql](../schema.sql), and the RDA table in `web/src/lib/rda-standards.ts` — every field
tracked end to end.

## 4. Webhook Sync (optional — skip if not running the dashboard)

Only add this if you deployed the dashboard (Docker or [Vercel + Supabase](../docs/DEPLOY_FREE.md)).
Without it, the shortcut still logs everything to HealthKit — you just won't have the web
dashboard's history/RDA view.

- `Get Contents of URL` → `POST` `https://<YOUR_DOMAIN_OR_VERCEL_URL>/api/v1/meals`
- Headers: `Authorization: Bearer <YOUR_API_SECRET_KEY>`, `Content-Type: application/json`
- Request Body: `Shortcut Input`
- `Show Notification` → "Logged [Payload.meal_name] to Health"

## Sharing the finished Shortcut

Once built, share it so others don't have to rebuild it by hand:

1. In the Shortcuts app, open `LogFullNutrition` → tap the **⋯** (Details) icon → **Share**.
2. Choose **Copy iCloud Link**.
3. Post that link in your repo's README or a GitHub Release. Anyone who opens it on iOS/iPadOS
   gets a native "Add Shortcut" screen — no manual action-by-action setup.
4. After importing, they can use it as-is for HealthKit-only logging. If they also want the
   dashboard, they fill in their own `API_SECRET_KEY` and backend URL in the optional webhook
   step (§4 above) — the shared link doesn't carry your secrets.

There is no way to bundle a `.shortcut` file directly in this repo that iOS will import from a
raw GitHub URL reliably — the iCloud link is the supported distribution method.

## Optional: Activity Export

Requires the dashboard backend (step 4). To sync active energy burned and step count back for
net calorie balance, add a periodic automation that:

1. Reads `Active Energy` and `Steps` from Health for the day.
2. `POST`s `{ "timestamp", "active_energy_kcal", "steps" }` to `/api/v1/activity` with the
   same `Authorization` header.
