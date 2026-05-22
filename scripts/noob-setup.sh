#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Fill local-safe defaults for development only
set_kv () {
  key="$1"
  value="$2"
  if grep -q "^${key}=" .env; then
    sed -i '' "s|^${key}=.*|${key}=\"${value}\"|" .env
  else
    echo "${key}=\"${value}\"" >> .env
  fi
}

RAND_SECRET=$(openssl rand -hex 24 2>/dev/null || echo "local-dev-secret-change-me")
set_kv NEXTAUTH_SECRET "$RAND_SECRET"
set_kv NEXTAUTH_URL "http://localhost:3000"
set_kv NEXT_PUBLIC_APP_URL "http://localhost:3000"
set_kv EMAIL_FROM "Beyond Borders <no-reply@beyond-borders.local>"
set_kv MEETING_PROVIDER "google-meet"
set_kv MEETING_BASE_URL "https://meet.google.com"
set_kv REMINDER_CRON_SECRET "local-reminder-secret"

# Keep external integrations empty unless user provides real keys
set_kv DATABASE_URL ""
set_kv SUPABASE_URL ""
set_kv SUPABASE_SERVICE_ROLE_KEY ""
set_kv STRIPE_SECRET_KEY ""
set_kv STRIPE_WEBHOOK_SECRET ""
set_kv RESEND_API_KEY ""

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use --lts >/dev/null || true
fi

npm install
npm run typecheck

echo ""
echo "Setup complete."
echo "Run: npm run dev"
echo "Open: http://localhost:3000"
