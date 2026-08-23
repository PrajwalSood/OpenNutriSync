# Free self-hosting: Vercel + Supabase

No server needed. Supabase gives a free Postgres instance; Vercel hosts the Next.js dashboard
and API routes for free on their Hobby tier.

## 1. Create the database (Supabase)

1. Sign up at [supabase.com](https://supabase.com) and create a new project (free tier).
2. Open **SQL Editor** → paste the contents of [schema.sql](../schema.sql) → run it.
3. Go to **Project Settings → Database → Connection string** → copy the **URI** (mode:
   "Session" or "Transaction pooler" both work). It looks like:
   ```
   postgresql://postgres.xxxx:<password>@aws-0-region.pooler.supabase.com:6543/postgres
   ```
   This is your `DATABASE_URL`.

## 2. Deploy the dashboard (Vercel)

1. Push this repo to your own GitHub account (fork or push to a new repo).
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Set **Root Directory** to `web`.
4. Add environment variables:
   - `DATABASE_URL` — the Supabase connection string from step 1.
   - `API_SECRET_KEY` — any long random string you generate (e.g. `openssl rand -hex 32`).
5. Deploy. Vercel gives you a URL like `https://your-project.vercel.app`.

## 3. Point the iOS Shortcut at it

In the `LogFullNutrition` shortcut's webhook step (see
[SHORTCUT_SETUP.md](SHORTCUT_SETUP.md)), set:
- URL: `https://your-project.vercel.app/api/v1/meals`
- Header `Authorization: Bearer <API_SECRET_KEY>` (same value as step 2).

## Notes on the free tiers

- Supabase free tier pauses projects after a week of inactivity (auto-resumes on next request,
  first request after pause is slower).
- Vercel Hobby tier is free for personal, non-commercial use and has generous serverless
  function limits — fine for this project's request volume.
- Both `docker-compose.yml` (fully self-hosted) and this Vercel+Supabase path read the same
  `schema.sql` and `DATABASE_URL`/`API_SECRET_KEY` env vars — pick whichever fits.
