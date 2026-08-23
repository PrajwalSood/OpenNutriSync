# OpenNutriSync

Open-source, zero-friction nutrition tracking ecosystem. Converts multimodal meal descriptions
from any LLM chat app into Apple HealthKit entries across 35+ dietary metrics via a native iOS
Shortcut, and syncs the same data to a self-hosted dashboard backed by PostgreSQL.

Several open-source projects cover individual pieces of this pipeline (mobile apps, AI parsing,
self-hosted dashboards, and databases), though virtually none tie the LLM-chat-first → iOS
Shortcut → 35+ HealthKit field → custom dashboard loop into a single turnkey project.

## Architecture

```
LLM Chat App (Gemini / Custom Gem)
        │  shortcuts://run-shortcut?name=LogFullNutrition&...
        ▼
iOS Shortcut Client  →  writes to HealthKit  →  POST /api/v1/meals
        ▼
Self-Hosted Backend (Next.js API routes + PostgreSQL)
        ▼
Web Dashboard (Next.js + Tailwind CSS)
```

## Getting started

Self-host with Docker (own server/NAS):
1. Copy `.env.example` to `.env` and set `API_SECRET_KEY` and Postgres credentials.
2. `docker compose up -d --build`
3. Dashboard available at `http://localhost:3000`.

Or deploy for free with Vercel + Supabase — see [docs/DEPLOY_FREE.md](docs/DEPLOY_FREE.md).

Then:
4. Configure the iOS Shortcut per [docs/SHORTCUT_SETUP.md](docs/SHORTCUT_SETUP.md).
5. Set up the Gemini Gem (or any LLM chat app) per
   [docs/GEMINI_SETUP.md](docs/GEMINI_SETUP.md), using the system prompt in
   [docs/GEMINI_SYSTEM_PROMPT.md](docs/GEMINI_SYSTEM_PROMPT.md).

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
