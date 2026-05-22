#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"

printf "\n== Beyond Borders Go-Live Checks ==\n"

printf "\n1) Ops readiness endpoint\n"
curl -s "$BASE_URL/api/ops/readiness" | sed -n '1,200p'

printf "\n\n2) Health endpoint\n"
curl -s "$BASE_URL/api/health" | sed -n '1,120p'

printf "\n\n3) Core business endpoints\n"
for route in \
  /api/user/profile \
  /api/jobs \
  /api/scholarships \
  /api/mentors \
  /api/community/posts \
  /api/podcasts \
  /api/study-chat/rooms \
  /api/ai/career-roadmap \
  /api/ai/job-match \
  /api/ai/visa-score; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
  printf "%s -> %s\n" "$route" "$code"
done

printf "\nDone.\n"
