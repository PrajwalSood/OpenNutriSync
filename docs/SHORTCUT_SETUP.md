# iOS Shortcut Setup — `LogFullNutrition`

Create an Apple Shortcut named `LogFullNutrition`.

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

| Source | HealthKit Type | Unit |
|---|---|---|
| `Energy.dietary_energy_kcal` | Dietary Energy | kcal |
| `Energy.water_ml` | Water | mL |
| `Macros.protein_g` | Protein | g |
| `Macros.carbohydrates_g` | Carbohydrates | g |
| `Macros.total_fat_g` | Total Fat | g |
| `Macros.fiber_g` | Fiber | g |
| `Vits.vitamin_c_mg` | Vitamin C | mg |
| `Vits.vitamin_d_iu` | Vitamin D | IU |
| `Mins.potassium_mg` | Potassium | mg |
| `Mins.sodium_mg` | Sodium | mg |

Add the remaining vitamin & mineral fields the same way as needed.

## 4. Webhook Sync

- `Get Contents of URL` → `POST` `https://<YOUR_DOMAIN_OR_TAILSCALE_IP>/api/v1/meals`
- Headers: `Authorization: Bearer <YOUR_API_SECRET_KEY>`, `Content-Type: application/json`
- Request Body: `Shortcut Input`
- `Show Notification` → "Logged [Payload.meal_name] to Health & Dashboard"

## Sharing the finished Shortcut

Once built, share it so others don't have to rebuild it by hand:

1. In the Shortcuts app, open `LogFullNutrition` → tap the **⋯** (Details) icon → **Share**.
2. Choose **Copy iCloud Link**.
3. Post that link in your repo's README or a GitHub Release. Anyone who opens it on iOS/iPadOS
   gets a native "Add Shortcut" screen — no manual action-by-action setup.
4. After importing, they still need to fill in their own `API_SECRET_KEY` and backend URL in
   the webhook step (§4 above) — the shared link doesn't carry your secrets.

There is no way to bundle a `.shortcut` file directly in this repo that iOS will import from a
raw GitHub URL reliably — the iCloud link is the supported distribution method.

## Optional: Activity Export

To sync active energy burned and step count back for net calorie balance, add a periodic
automation that:

1. Reads `Active Energy` and `Steps` from Health for the day.
2. `POST`s `{ "timestamp", "active_energy_kcal", "steps" }` to `/api/v1/activity` with the
   same `Authorization` header.
