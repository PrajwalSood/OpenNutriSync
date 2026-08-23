# Setting up the Gemini Gem

1. Open the Gemini app (gemini.google.com or mobile app).
2. Left sidebar → **Explore Gems** → **+ New Gem**.
3. Name it (e.g. "OpenNutriSync Logger").
4. In the **Instructions** box, paste the full contents of
   [GEMINI_SYSTEM_PROMPT.md](GEMINI_SYSTEM_PROMPT.md).
5. Save.
6. Open the new Gem from the sidebar to start a chat. Describe a meal by text, photo, or voice —
   the Gem replies with a nutrition breakdown and a `[📲 Log to Apple Health & Sync]` link.
7. On iPhone, tap that link — it opens the Shortcuts app and runs `LogFullNutrition`
   (set that up first, see [SHORTCUT_SETUP.md](SHORTCUT_SETUP.md)).

## Using a different LLM chat app

The system prompt is not Gemini-specific. Any chat app that supports custom
instructions/system prompts and can render Markdown links (ChatGPT custom GPTs, Claude
Projects, etc.) works the same way — paste the same prompt from
[GEMINI_SYSTEM_PROMPT.md](GEMINI_SYSTEM_PROMPT.md) into that app's instructions field.

## Troubleshooting

- **Link doesn't open Shortcuts**: confirm the shortcut is literally named `LogFullNutrition`
  (case-sensitive) and exists on the device opening the link.
- **JSON fails to parse in the Shortcut**: the Gem must URL-encode the JSON (`%7B` for `{`,
  etc.) — if raw `{`/`"` characters appear in the link, tell the Gem to re-encode.
