# OpenNutriSync

Open-source, zero-friction nutrition tracking ecosystem. Converts multimodal meal descriptions
from any LLM chat app into Apple HealthKit entries across all 39 dietary metrics via a native iOS
Shortcut. A self-hosted dashboard backed by PostgreSQL is available as an optional add-on for
long-term history and RDA tracking.

Several open-source projects cover individual pieces of this pipeline (mobile apps, AI parsing,
self-hosted dashboards, and databases), though virtually none tie the LLM-chat-first → iOS
Shortcut → 39 HealthKit field loop into a single turnkey project.

## Architecture

```
Any LLM Chat App (paste-in system prompt)
        │  shortcuts://run-shortcut?name=LogFullNutrition&...
        ▼
iOS Shortcut Client  →  writes to HealthKit         ◀── this alone is the whole app
        │
        │  (optional) POST /api/v1/meals
        ▼
Self-Hosted Backend (Next.js API routes + PostgreSQL)
        ▼
Web Dashboard (Next.js + shadcn/ui)
```

## 1. Core flow: chat → HealthKit (required)

No backend, no signup, no deploy.

1. Paste [docs/SYSTEM_PROMPT.md](docs/SYSTEM_PROMPT.md) into any LLM chat app (ChatGPT,
   Claude, Gemini — whatever you already use). No account setup, no Gem/GPT/Project to
   create. See [docs/USAGE.md](docs/USAGE.md).
2. Get the iOS Shortcut: download the prebuilt one from
   [Releases (v0.1.0, verified working)](https://github.com/PrajwalSood/OpenNutriSync/releases/tag/v0.1.0) (sign it for yourself on
   a Mac with one command), or build it by hand — both covered in
   [docs/SHORTCUT_SETUP.md](docs/SHORTCUT_SETUP.md).
3. Describe a meal in the chat app, tap the link it replies with. Done — it's in Apple Health.

## 2. Dashboard & history (optional)

Adds a webhook sync from the Shortcut to a Postgres-backed web dashboard (macro/RDA tracking,
meal history). Pick one:

**Self-hosted with Docker** (own server/NAS):
1. Copy `.env.example` to `.env` and set `API_SECRET_KEY` and Postgres credentials.
2. `docker compose up -d --build`
3. Dashboard available at `http://localhost:3000`.

**Free hosted** with Vercel + Supabase — see [docs/DEPLOY_FREE.md](docs/DEPLOY_FREE.md).

Then add the optional webhook step (§4) in [docs/SHORTCUT_SETUP.md](docs/SHORTCUT_SETUP.md),
pointing it at your backend URL and `API_SECRET_KEY`.

## Local (non-Docker) development

```
cd web
npm install
npm run dev
```

Requires a running Postgres instance matching `DATABASE_URL` (run `docker compose up -d postgres`
and apply `schema.sql`, or point at any existing Postgres/Supabase instance).

## Tracked nutrients (all 39)

**Energy & Hydration** — Dietary Energy, Water, Caffeine

**Macronutrients** — Carbohydrates, Dietary Sugar, Fiber, Protein, Total Fat, Saturated Fat,
Monounsaturated Fat, Polyunsaturated Fat, Cholesterol

**Vitamins** — Vitamin A, Thiamin (B1), Riboflavin (B2), Niacin (B3), Pantothenic Acid (B5),
Vitamin B6 (Pyridoxine), Biotin (B7), Folate/Folic Acid (B9), Cobalamin (B12), Vitamin C,
Vitamin D, Vitamin E, Vitamin K

**Minerals & Electrolytes** — Calcium, Chloride, Chromium, Copper, Iodine, Iron, Magnesium,
Manganese, Molybdenum, Phosphorus, Potassium, Selenium, Sodium, Zinc

JSON field names for each are in [docs/SYSTEM_PROMPT.md](docs/SYSTEM_PROMPT.md),
the Postgres columns in [schema.sql](schema.sql), and the HealthKit mapping in
[docs/SHORTCUT_SETUP.md](docs/SHORTCUT_SETUP.md).

## API

- `POST /api/v1/meals` — ingest a full nutrition payload (see the JSON schema in
  [docs/SYSTEM_PROMPT.md](docs/SYSTEM_PROMPT.md)). Requires
  `Authorization: Bearer <API_SECRET_KEY>`.
- `GET /api/v1/meals?date=YYYY-MM-DD` — fetch meals for a given day.
- `POST /api/v1/activity` — optional activity sync (`active_energy_kcal`, `steps`).

## License

See [LICENSE](LICENSE).
