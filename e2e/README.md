# e2e (local, mock backend)

Runs the real app against `mock-backend.mjs`, a local stand-in for Supabase
Auth/PostgREST and OpenAI. No real keys, no network, no production data.

```bash
node e2e/mock-backend.mjs &      # :54321
e2e/run-server.sh &              # builds + serves the app on :3100
node e2e/run.mjs                 # needs the preinstalled Playwright; restart the app between runs (in-memory rate limit)
```
