# Customization Guide

This template provides a working landing page with email capture and survey. To add custom functionality:

## Adding Custom Pages

Create new pages in `src/app/`:
```
src/app/
├── page.tsx          # Landing page (exists)
├── dashboard/
│   └── page.tsx      # Add custom dashboard
└── api/
    └── custom/
        └── route.ts  # Add custom API routes
```

## Adding Custom Backend Routes

Add routes in `server/src/routes/`:
```typescript
// server/src/routes/custom.ts
import { Hono } from "hono";
export const custom = new Hono();
custom.get("/", (c) => c.json({ hello: "world" }));
```

Register in `server/src/index.ts`:
```typescript
import { custom } from "./routes/custom.js";
app.route("/api/v1/custom", custom);
```

## Adding Custom Services

Add services in `server/src/services/`:
```typescript
// server/src/services/ai.ts — example AI integration
export async function analyze(input: string): Promise<string> { ... }
```

## Database Schema

Current tables:
- `leads` — email captures with `landing_page_id`
- `survey_responses` — survey answers linked to leads

To add custom tables, create new migration files:
```
supabase/migrations/002_custom.sql
```

## Design Tokens

Edit `src/lib/config.ts` → `design` section:
- `accent`: blue, emerald, sky, rose, amber, teal, violet, cyan, lime, fuchsia, orange
- `radius`: sm, md, lg, xl, 2xl
