# Using OpenNutriSync (any chat app, no setup)

No Gem, no Custom GPT, no Project to create. This is just a prompt.

1. Open any LLM chat app that renders Markdown links — ChatGPT, Claude, Gemini, whatever you
   already have open.
2. Paste the full contents of [SYSTEM_PROMPT.md](SYSTEM_PROMPT.md) as your first message in
   the conversation.
3. In the same thread, describe a meal (text, photo, or voice, if the app supports it). The
   model replies with a nutrition breakdown and a `[📲 Log to Apple Health & Sync]` link.
4. On iPhone, tap that link — it opens Shortcuts and runs `LogFullNutrition`
   (set that up once, see [SHORTCUT_SETUP.md](SHORTCUT_SETUP.md)).
5. Keep describing meals in the same thread — the model remembers the instructions for the
   rest of the conversation. Start a new chat next day and paste the prompt again, or move to
   step "Optional: persistent setup" below to stop repasting it.

That's the whole flow. Nothing to configure, no dashboard required.

## Optional: persistent setup

Repasting the prompt every new chat gets old. If your chat app supports saved
instructions, do it once instead:

- **ChatGPT**: Settings → Personalization → Custom Instructions, or create a Custom GPT.
- **Gemini**: sidebar → Explore Gems → New Gem → paste into Instructions.
- **Claude**: Projects → New Project → paste into Project instructions.

This is a convenience, not a requirement — everything works with plain copy-paste too.

## Troubleshooting

- **Link doesn't open Shortcuts**: confirm the shortcut is literally named `LogFullNutrition`
  (case-sensitive) and exists on the device opening the link.
- **JSON fails to parse in the Shortcut**: the model must URL-encode the JSON (`%7B` for `{`,
  etc.) — if raw `{`/`"` characters appear in the link, ask it to re-encode and resend.
