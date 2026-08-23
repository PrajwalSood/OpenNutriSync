# Using OpenNutriSync (any chat app)

The "skill" is just one system prompt: [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md). Every app below
uses the exact same prompt text — copy the full file contents, paste it where each section
says. Nothing else to install.

## Quick start (zero setup)

1. Open any LLM chat app that renders Markdown links.
2. Paste the full contents of [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md) as your first message.
3. In the same thread, describe a meal (text, photo, or voice). The model replies with a
   nutrition breakdown and a `[📲 Log to Apple Health & Sync]` link.
4. On iPhone, tap the link — it opens Shortcuts and runs `LogFullNutrition`
   (one-time setup: [SHORTCUT_SETUP.md](SHORTCUT_SETUP.md)).

Works in every app. The per-app setups below just save you from repasting the prompt in each
new chat.

## Persistent setup per app

All of these take the same prompt from [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md), verbatim.

### ChatGPT (Custom GPT)

1. chatgpt.com → left sidebar → **GPTs** → **+ Create**.
2. Open the **Configure** tab (skip the conversational builder).
3. Name: `OpenNutriSync Logger`. Paste the prompt into **Instructions**.
4. Under **Capabilities**, enable **Web Search** (helps USDA lookups). Disable the rest.
5. **Create** → visibility **Only me**.
6. Log meals by opening the GPT from the sidebar. On mobile, use the ChatGPT iOS app — links
   open Shortcuts directly.

Lighter alternative: Settings → **Personalization** → **Custom Instructions** → paste the
prompt into "How would you like ChatGPT to respond?". Applies to every chat, no GPT needed —
but also fires when you're not logging food, so the dedicated GPT is cleaner.

### Claude (Project)

1. claude.ai → left sidebar → **Projects** → **+ New Project**.
2. Name: `OpenNutriSync`. In the project, open **Instructions** (or "Set project instructions")
   and paste the prompt.
3. Start every meal-logging chat inside this project.
4. On iPhone, use the Claude iOS app — the `shortcuts://` link opens the Shortcuts app.

### Gemini (Gem)

1. gemini.google.com → left sidebar → **Explore Gems** → **+ New Gem**.
2. Name: `OpenNutriSync Logger`. Paste the prompt into **Instructions**. Save.
3. Open the Gem from the sidebar for each logging chat. Photo + voice input both work.

### Microsoft Copilot

No user-defined system prompt on the consumer app. Use the quick-start flow (paste the prompt
as your first message each chat). If you have Copilot Studio access, create an agent with the
prompt as its instructions.

### Perplexity

1. perplexity.ai → **Spaces** → **Create Space**.
2. Name: `OpenNutriSync`. Paste the prompt into **Custom Instructions** (AI Prompt).
3. Log meals in threads inside that Space.

### Grok

No persistent custom instructions on grok.com / X as of this writing — use the quick-start
flow (paste per chat).

### Anything else (local models, other apps)

Any app or API wrapper that accepts a system prompt works: set
[SYSTEM_PROMPT.md](SYSTEM_PROMPT.md) as the system message. Requirements are only that the app
renders Markdown links and, for photos, supports image input. For local models via Ollama /
LM Studio / Open WebUI, paste it into the system-prompt field of your model preset.

## Troubleshooting

- **Link doesn't open Shortcuts**: confirm the shortcut is literally named `LogFullNutrition`
  (case-sensitive) and exists on the device opening the link. Some Android/desktop apps can't
  open `shortcuts://` at all — the link only works on iOS/iPadOS.
- **JSON fails to parse in the Shortcut**: the model must URL-encode the JSON (`%7B` for `{`,
  etc.) — if raw `{`/`"` characters appear in the link, ask it to re-encode and resend.
- **Model omits nutrients**: remind it "all 39 fields, every category" — the prompt requires
  every key present in every payload.
