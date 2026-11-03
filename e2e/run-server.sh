#!/usr/bin/env bash
# Builds and starts the app against the local mock backend (see e2e/README.md).
set -euo pipefail
export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=mock-publishable-key
export NEXT_PUBLIC_AUTH_INTERNAL_EMAIL_DOMAIN=skyline.test
export OPENAI_API_KEY=mock-not-a-real-key
export OPENAI_BASE_URL=http://127.0.0.1:54321/openai/v1
npx next build
exec npx next start -p "${PORT:-3100}"
