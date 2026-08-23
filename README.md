# OpenNutriSync

Open-source, zero-friction nutrition tracking ecosystem. Converts multimodal meal descriptions
from any LLM chat app into Apple HealthKit entries across 35+ dietary metrics via a native iOS
Shortcut. A self-hosted dashboard backed by PostgreSQL is available as an optional add-on for
long-term history and RDA tracking.

Several open-source projects cover individual pieces of this pipeline (mobile apps, AI parsing,
self-hosted dashboards, and databases), though virtually none tie the LLM-chat-first → iOS
Shortcut → 35+ HealthKit field loop into a single turnkey project.

## Architecture

```
LLM Chat App (Gemini / Custom Gem)
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

1. Set up the Gemini Gem (or any LLM chat app) per
   [docs/GEMINI_SETUP.md](docs/GEMINI_SETUP.md), using the system prompt in
   [docs/GEMINI_SYSTEM_PROMPT.md](docs/GEMINI_SYSTEM_PROMPT.md).
2. Build the iOS Shortcut per [docs/SHORTCUT_SETUP.md](docs/SHORTCUT_SETUP.md) — steps 1–3 only.
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

## API

- `POST /api/v1/meals` — ingest a full nutrition payload (see the JSON schema in
  [docs/GEMINI_SYSTEM_PROMPT.md](docs/GEMINI_SYSTEM_PROMPT.md)). Requires
  `Authorization: Bearer <API_SECRET_KEY>`.
- `GET /api/v1/meals?date=YYYY-MM-DD` — fetch meals for a given day.
- `POST /api/v1/activity` — optional activity sync (`active_energy_kcal`, `steps`).

## License

See [LICENSE](LICENSE).
