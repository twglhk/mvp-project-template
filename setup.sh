#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# MVP Project Template — Interactive Setup
# ─────────────────────────────────────────────

BOLD='\033[1m'
DIM='\033[2m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BOLD}${CYAN}"
echo "┌───────────────────────────────────────────┐"
echo "│   MVP Project Template — Project Setup    │"
echo "└───────────────────────────────────────────┘"
echo -e "${NC}"

# ── 1. Collect project info ──────────────────

read -rp "$(echo -e "${BOLD}Project name${NC} ${DIM}(e.g. MyProject)${NC}: ")" PROJECT_NAME
if [[ -z "$PROJECT_NAME" ]]; then
  echo "Error: Project name is required."
  exit 1
fi

# Generate slug from project name (lowercase, hyphens)
PROJECT_SLUG=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')

read -rp "$(echo -e "${BOLD}Project description${NC} ${DIM}(one line)${NC}: ")" PROJECT_DESCRIPTION
PROJECT_DESCRIPTION="${PROJECT_DESCRIPTION:-$PROJECT_NAME}"

read -rp "$(echo -e "${BOLD}Current phase${NC} ${DIM}(e.g. Phase 0: 초기 셋업)${NC}: ")" CURRENT_PHASE
CURRENT_PHASE="${CURRENT_PHASE:-TBD}"

read -rp "$(echo -e "${BOLD}Project purpose${NC} ${DIM}(한 줄 요약)${NC}: ")" PROJECT_PURPOSE
PROJECT_PURPOSE="${PROJECT_PURPOSE:-TBD}"

read -rp "$(echo -e "${BOLD}Infrastructure${NC} ${DIM}(e.g. Netlify + Railway + Supabase)${NC}: ")" INFRASTRUCTURE
INFRASTRUCTURE="${INFRASTRUCTURE:-Netlify + Railway + Supabase}"

echo ""
echo -e "${BOLD}${YELLOW}Roam Research Configuration${NC}"
read -rp "$(echo -e "${BOLD}Roam API Token${NC}: ")" ROAM_API_TOKEN
read -rp "$(echo -e "${BOLD}Roam Graph Name${NC}: ")" ROAM_GRAPH_NAME

if [[ -z "$ROAM_API_TOKEN" || -z "$ROAM_GRAPH_NAME" ]]; then
  echo -e "${YELLOW}Warning: Roam credentials empty. You'll need to edit opencode.json manually.${NC}"
fi

# ── 2. Replace placeholders ─────────────────

echo ""
echo -e "${DIM}Replacing placeholders...${NC}"

# AGENTS.md
sed -i "s|{{PROJECT_NAME}}|${PROJECT_NAME}|g" AGENTS.md
sed -i "s|{{PROJECT_DESCRIPTION}}|${PROJECT_DESCRIPTION}|g" AGENTS.md
sed -i "s|{{CURRENT_PHASE}}|${CURRENT_PHASE}|g" AGENTS.md
sed -i "s|{{PROJECT_PURPOSE}}|${PROJECT_PURPOSE}|g" AGENTS.md
sed -i "s|{{INFRASTRUCTURE}}|${INFRASTRUCTURE}|g" AGENTS.md
echo -e "  ${GREEN}✓${NC} AGENTS.md"

# README.md
sed -i "s|{{PROJECT_NAME}}|${PROJECT_NAME}|g" README.md
sed -i "s|{{PROJECT_DESCRIPTION}}|${PROJECT_DESCRIPTION}|g" README.md
echo -e "  ${GREEN}✓${NC} README.md"

# OpenCode agents
sed -i "s|{{PROJECT_NAME}}|${PROJECT_NAME}|g" .opencode/agents/po.md
sed -i "s|{{PROJECT_NAME}}|${PROJECT_NAME}|g" .opencode/agents/web-designer.md
echo -e "  ${GREEN}✓${NC} .opencode/agents/po.md"
echo -e "  ${GREEN}✓${NC} .opencode/agents/web-designer.md"

# Landing config — set project slug
sed -i "s|projectSlug: \"mvp-landing\"|projectSlug: \"${PROJECT_SLUG}\"|g" src/lib/config.ts
echo -e "  ${GREEN}✓${NC} src/lib/config.ts (projectSlug → ${PROJECT_SLUG})"

# ── 3. Configure opencode.json ───────────────

if [[ -n "$ROAM_API_TOKEN" && -n "$ROAM_GRAPH_NAME" ]]; then
  sed -i "s|<REPLACE_WITH_YOUR_TOKEN>|${ROAM_API_TOKEN}|g" opencode.json
  sed -i "s|<REPLACE_WITH_YOUR_GRAPH>|${ROAM_GRAPH_NAME}|g" opencode.json
  sed -i "s|<REPLACE_WITH_PROJECT_NAME>|${PROJECT_NAME}|g" opencode.json
  echo -e "  ${GREEN}✓${NC} opencode.json"
else
  echo -e "  ${YELLOW}⊘${NC} opencode.json ${DIM}(skipped — edit manually)${NC}"
fi

# ── 4. Create .env ───────────────────────────

if [[ ! -f .env ]]; then
  cat > .env <<EOF
# ── Project ───────────────────────────────────
PROJECT_NAME=${PROJECT_NAME}

# ── Roam Research ─────────────────────────────
ROAM_API_TOKEN=${ROAM_API_TOKEN}
ROAM_GRAPH_NAME=${ROAM_GRAPH_NAME}

# ── Supabase (Frontend) ──────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# ── Backend API ──────────────────────────────
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_PROJECT_SLUG=${PROJECT_SLUG}
EOF
  echo -e "  ${GREEN}✓${NC} .env created"
else
  echo -e "  ${YELLOW}⊘${NC} .env ${DIM}(already exists, skipped)${NC}"
fi

# ── 5. Install dependencies ──────────────────

if command -v npm &>/dev/null; then
  echo ""
  echo -e "${DIM}Installing OpenCode plugins...${NC}"
  (cd .opencode && npm install --silent 2>/dev/null) && echo -e "  ${GREEN}✓${NC} .opencode/node_modules" || echo -e "  ${YELLOW}⊘${NC} .opencode npm install failed ${DIM}(run manually: cd .opencode && npm install)${NC}"

  echo ""
  echo -e "${DIM}Installing frontend dependencies...${NC}"
  npm install --silent 2>/dev/null && echo -e "  ${GREEN}✓${NC} node_modules" || echo -e "  ${YELLOW}⊘${NC} npm install failed ${DIM}(run manually: npm install)${NC}"

  echo ""
  echo -e "${DIM}Installing backend dependencies...${NC}"
  (cd server && npm install --silent 2>/dev/null) && echo -e "  ${GREEN}✓${NC} server/node_modules" || echo -e "  ${YELLOW}⊘${NC} server npm install failed ${DIM}(run manually: cd server && npm install)${NC}"
elif command -v bun &>/dev/null; then
  echo ""
  echo -e "${DIM}Installing dependencies with bun...${NC}"
  (cd .opencode && bun install --silent 2>/dev/null) && echo -e "  ${GREEN}✓${NC} .opencode/node_modules" || true
  bun install --silent 2>/dev/null && echo -e "  ${GREEN}✓${NC} node_modules" || true
  (cd server && bun install --silent 2>/dev/null) && echo -e "  ${GREEN}✓${NC} server/node_modules" || true
else
  echo ""
  echo -e "${YELLOW}Warning: npm/bun not found. Install dependencies manually.${NC}"
fi

# ── 6. Summary ───────────────────────────────

echo ""
echo -e "${BOLD}${GREEN}┌───────────────────────────────────────────┐${NC}"
echo -e "${BOLD}${GREEN}│             Setup Complete!                │${NC}"
echo -e "${BOLD}${GREEN}└───────────────────────────────────────────┘${NC}"
echo ""
echo -e "  Project:  ${BOLD}${PROJECT_NAME}${NC} ${DIM}(slug: ${PROJECT_SLUG})${NC}"
echo -e "  Memory:   ${BOLD}${PROJECT_NAME} Memory${NC} ${DIM}(project)${NC} + ${BOLD}Agent Memory${NC} ${DIM}(universal)${NC}"
echo -e "  Roam:     ${BOLD}${ROAM_GRAPH_NAME:-not configured}${NC}"
echo ""
echo -e "${DIM}Next steps:${NC}"
echo -e "  1. Fill in Supabase/API vars in ${BOLD}.env${NC}"
echo -e "  2. Run ${BOLD}supabase/migrations/001_init.sql${NC} in Supabase SQL Editor"
echo -e "  3. Create '${PROJECT_NAME} WorkBlocks' page in Roam"
echo -e "  4. Create '${PROJECT_NAME} Memory' page in Roam"
echo -e "  5. Review ${BOLD}AGENTS.md${NC} — fill in Project Context section"
echo -e "  6. Run ${BOLD}npm run dev${NC} (frontend) + ${BOLD}cd server && npm run dev${NC} (backend)"
echo -e "  7. Run ${BOLD}opencode${NC} to start working with AI agents"
echo ""
echo -e "${DIM}Tip: This setup script can be safely deleted after use.${NC}"
